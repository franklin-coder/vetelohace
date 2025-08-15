
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getTemplateById } from "@/lib/report-templates"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { petId, medicalRecordId, template, formData } = body

    if (!petId || !template || !formData) {
      return NextResponse.json(
        { message: "Datos requeridos faltantes" },
        { status: 400 }
      )
    }

    const reportTemplate = getTemplateById(template)
    if (!reportTemplate) {
      return NextResponse.json(
        { message: "Template no encontrado" },
        { status: 400 }
      )
    }

    // Create structured prompt for report generation
    const prompt = `
Eres un veterinario experto generando un reporte médico profesional para ${reportTemplate.name.toLowerCase()}.

INFORMACIÓN DEL PACIENTE:
${Object.entries(formData)
  .filter(([key, value]) => value && value.toString().trim())
  .map(([key, value]) => {
    const field = reportTemplate.fields.find(f => f.name === key)
    return `- ${field?.label || key}: ${value}`
  })
  .join('\n')}

INSTRUCCIONES:
1. Genera un reporte veterinario profesional y completo
2. Usa terminología médica veterinaria apropiada
3. Estructura el reporte de manera clara y organizada
4. Incluye recomendaciones específicas para ${reportTemplate.species.toLowerCase()}
5. Mantén un tono profesional pero comprensible para el propietario
6. Incluye próximos pasos si es necesario
7. El reporte debe ser específico para la especie: ${reportTemplate.name}

FORMATO DEL REPORTE:
- Encabezado con información del paciente
- Motivo de la consulta
- Hallazgos del examen físico
- Diagnóstico
- Plan de tratamiento
- Medicamentos y dosificación (si aplica)
- Recomendaciones específicas
- Próxima cita (si aplica)
- Observaciones adicionales

Genera un reporte completo, profesional y detallado en español:
`

    // Call the LLM API for report generation
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true,
        max_tokens: 3000,
        temperature: 0.3
      }),
    })

    if (!response.ok) {
      console.error('LLM API error:', response.status, response.statusText)
      return NextResponse.json(
        { message: "Error en el servicio de generación de reportes" },
        { status: 500 }
      )
    }

    // Create a readable stream to forward the response
    const encoder = new TextEncoder()
    const stream = response.body

    if (!stream) {
      return NextResponse.json(
        { message: "Error en la respuesta del servicio" },
        { status: 500 }
      )
    }

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = stream.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({content})}\n\n`))
                  }
                } catch (parseError) {
                  // Skip invalid JSON
                  continue
                }
              }
            }
          }

          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error("Error in report generation API:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
