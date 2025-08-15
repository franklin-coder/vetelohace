
const fs = require('fs');
const path = require('path');

async function testTranscription() {
  try {
    console.log('🔍 Iniciando prueba de transcripción...');
    
    // Simular un archivo de audio simple (crear un blob simulado)
    const audioData = Buffer.from('fake-audio-data-for-testing');
    const formData = new FormData();
    
    // Crear un blob simulado
    const audioBlob = new Blob([audioData], { type: 'audio/webm' });
    
    formData.append('audio', audioBlob, 'test-recording.webm');
    formData.append('petId', 'test-pet-id');
    formData.append('mimeType', 'audio/webm');
    
    console.log('📤 Enviando petición a /api/transcribe...');
    
    const response = await fetch('http://localhost:3000/api/transcribe', {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': 'next-auth.session-token=test-session' // Simular autenticación
      }
    });
    
    console.log('📦 Status de respuesta:', response.status);
    console.log('📦 Headers de respuesta:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }
    
    // Procesar stream de respuesta
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    console.log('🔄 Procesando stream de respuesta...');
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      console.log('📝 Chunk recibido:', chunk);
    }
    
    console.log('✅ Transcripción completada:', buffer);
    
  } catch (error) {
    console.error('💥 Error en prueba de transcripción:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar prueba
testTranscription();
