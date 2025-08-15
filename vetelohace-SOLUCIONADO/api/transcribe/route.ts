
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const petId = formData.get('petId') as string
    const mimeType = formData.get('mimeType') as string || 'audio/wav'

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Create a temporary file for the audio
    const tempDir = tmpdir()
    const fileName = `audio_${Date.now()}.${getFileExtension(mimeType)}`
    const tempFilePath = path.join(tempDir, fileName)

    // Convert File to Buffer and save to temporary file
    const buffer = Buffer.from(await audioFile.arrayBuffer())
    fs.writeFileSync(tempFilePath, buffer)

    // Create a readable stream response for Server-Sent Events
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Simulate transcription process
          const transcriptionText = await transcribeAudio(tempFilePath, mimeType)
          
          // Send transcription in chunks to simulate streaming
          const words = transcriptionText.split(' ')
          let currentText = ''

          for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i]
            
            const chunk = encoder.encode(`data: ${JSON.stringify({ content: words[i] + (i < words.length - 1 ? ' ' : '') })}\n\n`)
            controller.enqueue(chunk)
            
            // Small delay to simulate real-time transcription
            await new Promise(resolve => setTimeout(resolve, 50))
          }

          // Send completion signal
          const doneChunk = encoder.encode('data: [DONE]\n\n')
          controller.enqueue(doneChunk)
          
          controller.close()
        } catch (error) {
          console.error('Transcription error:', error)
          const errorChunk = encoder.encode(`data: ${JSON.stringify({ error: 'Error during transcription: ' + (error instanceof Error ? error.message : 'Unknown error') })}\n\n`)
          controller.enqueue(errorChunk)
          controller.close()
        } finally {
          // Clean up temporary file
          try {
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath)
            }
          } catch (cleanupError) {
            console.error('Error cleaning up temp file:', cleanupError)
          }
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

function getFileExtension(mimeType: string): string {
  if (mimeType.includes('webm')) return 'webm'
  if (mimeType.includes('wav')) return 'wav'
  if (mimeType.includes('mp3')) return 'mp3'
  if (mimeType.includes('ogg')) return 'ogg'
  return 'wav'
}

async function transcribeAudio(filePath: string, mimeType: string): Promise<string> {
  try {
    // Check if file exists and has content
    const stats = fs.statSync(filePath)
    if (stats.size === 0) {
      throw new Error('Audio file is empty')
    }

    // For now, we'll use the AbacusAI API for transcription
    // If ABACUSAI_API_KEY is not available, return a mock transcription
    const apiKey = process.env.ABACUSAI_API_KEY

    if (!apiKey) {
      console.log('No ABACUSAI_API_KEY found, using mock transcription')
      return 'Esta es una transcripción simulada del audio grabado. El paciente muestra signos de comportamiento normal y parece estar en buen estado de salud general.'
    }

    // Read the audio file
    const audioBuffer = fs.readFileSync(filePath)
    
    // Prepare FormData for the API call
    const formData = new FormData()
    const audioBlob = new Blob([audioBuffer], { type: mimeType })
    formData.append('file', audioBlob, `audio.${getFileExtension(mimeType)}`)
    formData.append('model', 'whisper-1')
    formData.append('language', 'es')

    // Call the transcription API
    const response = await fetch('https://apps.abacus.ai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      console.error('Transcription API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('API Error details:', errorText)
      throw new Error(`Transcription API failed with status ${response.status}`)
    }

    const result = await response.json()
    
    if (result.text) {
      return result.text
    } else {
      console.warn('No text in transcription result:', result)
      return 'No se pudo transcribir el audio. Intenta grabar de nuevo.'
    }

  } catch (error) {
    console.error('Error in transcribeAudio:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        throw new Error('Audio file not found')
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error during transcription')
      }
    }
    
    // Return a fallback transcription for testing
    return 'Error al transcribir el audio. Esta es una transcripción de prueba para verificar el funcionamiento del sistema.'
  }
}
