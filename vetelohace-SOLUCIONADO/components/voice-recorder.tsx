
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Volume2,
  FileAudio,
  Zap,
  Copy,
  Check,
  MessageSquare
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceRecorderProps {
  petId: string
}

// Declarar los tipos para SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionResult {
  [index: number]: {
    transcript: string;
  };
  isFinal: boolean;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: SpeechRecognitionResult;
    length: number;
  };
  resultIndex: number;
}

export function VoiceRecorder({ petId }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioMimeType, setAudioMimeType] = useState<string>('')
  const [transcription, setTranscription] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [microphoneStatus, setMicrophoneStatus] = useState<'unknown' | 'granted' | 'denied' | 'unavailable'>('unknown')
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const speechRecognitionRef = useRef<any>(null)
  const recognitionRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Speech Recognition
  const initializeSpeechRecognition = useCallback(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setSpeechRecognitionSupported(false)
        console.warn('Speech Recognition not supported in this browser')
        return
      }
      
      const recognition = new SpeechRecognition()
      
      // Configuration for best results
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'es-ES'
      recognition.maxAlternatives = 1
      
      recognition.onstart = () => {
        console.log('Speech recognition started')
        setIsListening(true)
      }
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = ''
        let final = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          
          if (event.results[i].isFinal) {
            final += transcript + ' '
          } else {
            interim += transcript
          }
        }
        
        // Update transcriptions
        if (final) {
          setFinalTranscript(prev => prev + final)
        }
        setInterimTranscript(interim)
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        
        if (event.error === 'not-allowed') {
          setMicrophoneStatus('denied')
          toast.error('Permiso de micrófono denegado')
        } else if (event.error === 'network') {
          // Automatic restart on network errors
          setTimeout(() => {
            if (isListening && speechRecognitionRef.current) {
              try {
                speechRecognitionRef.current.start()
              } catch (e) {
                console.error('Error restarting recognition:', e)
              }
            }
          }, 1000)
        } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
          toast.error(`Error de reconocimiento: ${event.error}`)
        }
      }
      
      // recognition.onend = () => {
      //   console.log('Speech recognition ended')
      //   setIsListening(false)
        
      //   // Auto-restart if still recording (unless manually stopped)
      //   if (isRecording && !recognition.stopped) {
      //     recognitionRestartTimeoutRef.current = setTimeout(() => {
      //       if (isRecording && speechRecognitionRef.current) {
      //         try {
      //           speechRecognitionRef.current.start()
      //         } catch (error) {
      //           console.error('Error restarting recognition:', error)
      //         }
      //       }
      //     }, 100)
      //   }
      // }
      
      recognition.onend = () => {
  setIsListening(false);
  // Solo reiniciar si no fue un stop manual
  if (isRecording && !recognition.stopped) {
    recognitionRestartTimeoutRef.current = setTimeout(() => {
      if (isRecording && speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
      }
    }, 100);
  }
};

      speechRecognitionRef.current = recognition
      setSpeechRecognitionSupported(true)
    } catch (error) {
      console.error('Error initializing speech recognition:', error)
      setSpeechRecognitionSupported(false)
    }
  }, [isRecording, isListening])

  // Check capabilities on mount
  useEffect(() => {
    const checkCapabilities = async () => {
      try {
        // Check microphone support
        if (!navigator.mediaDevices?.getUserMedia) {
          setMicrophoneStatus('unavailable')
          return
        }
        
        // Check permissions
        if ('permissions' in navigator) {
          try {
            const permissionStatus = await navigator.permissions.query({ 
              name: 'microphone' as PermissionName 
            })
            setMicrophoneStatus(permissionStatus.state as 'granted' | 'denied')
            
            permissionStatus.onchange = () => {
              setMicrophoneStatus(permissionStatus.state as 'granted' | 'denied')
            }
          } catch (error) {
            setMicrophoneStatus('unknown')
          }
        }
        
        // Initialize speech recognition
        initializeSpeechRecognition()
      } catch (error) {
        console.error('Error checking capabilities:', error)
        setMicrophoneStatus('unknown')
      }
    }

    checkCapabilities()
  }, [initializeSpeechRecognition])

  // Start real-time transcription
  const startRealTimeTranscription = useCallback(() => {
    if (!speechRecognitionSupported || !speechRecognitionRef.current) {
      console.warn('Speech recognition not available')
      return
    }

    try {
      // Clear previous transcriptions
      setFinalTranscript('')
      setInterimTranscript('')
      setTranscription('')
      
      // Mark recognition as not manually stopped
      speechRecognitionRef.current.stopped = false
      speechRecognitionRef.current.start()
      
      console.log('Real-time transcription started')
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      if (error instanceof Error && error.message.includes('already started')) {
        // Recognition already running, this is fine
        return
      }
      toast.error('Error al iniciar transcripción en tiempo real')
    }
  }, [speechRecognitionSupported])

  // Stop real-time transcription
  const stopRealTimeTranscription = useCallback(() => {
    if (speechRecognitionRef.current && isListening) {
      try {
        // Mark as manually stopped
        speechRecognitionRef.current.stopped = true
        speechRecognitionRef.current.stop()
        
        // Clear restart timeout
        if (recognitionRestartTimeoutRef.current) {
          clearTimeout(recognitionRestartTimeoutRef.current)
          recognitionRestartTimeoutRef.current = null
        }
        
        // Finalize transcription
        const fullTranscript = finalTranscript + interimTranscript
        setTranscription(fullTranscript)
        
        console.log('Real-time transcription stopped')
      } catch (error) {
        console.error('Error stopping speech recognition:', error)
      }
    }
  }, [isListening, finalTranscript, interimTranscript])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (recognitionRestartTimeoutRef.current) {
        clearTimeout(recognitionRestartTimeoutRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (speechRecognitionRef.current && isListening) {
        speechRecognitionRef.current.stopped = true
        speechRecognitionRef.current.stop()
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl, isListening])

  const startRecording = async () => {
    try {
      // Check browser compatibility
      if (!navigator.mediaDevices) {
        toast.error('Tu navegador no soporta grabación de audio. Prueba con Chrome, Firefox o Safari moderno.')
        return
      }

      if (!navigator.mediaDevices.getUserMedia) {
        toast.error('La función de grabación no está disponible en tu navegador.')
        return
      }

      // Check if we're in a secure context (required for microphone access in most browsers)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        toast.error('La grabación requiere una conexión segura (HTTPS).')
        return
      }

      // Request microphone access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      })
      
      streamRef.current = stream
      
      // Check MediaRecorder support
      if (!MediaRecorder.isTypeSupported('audio/webm') && !MediaRecorder.isTypeSupported('audio/wav')) {
        stream.getTracks().forEach(track => track.stop())
        toast.error('Tu navegador no soporta grabación de audio. Actualiza a una versión más reciente.')
        return
      }

      // Choose the best available audio format
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm'
        : 'audio/wav'

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType })
        setAudioBlob(blob)
        setAudioMimeType(mimeType)
        
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }
        
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        toast.error('Error durante la grabación. Inténtalo de nuevo.')
        setIsRecording(false)
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
      
      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      // Start real-time transcription if supported
      if (speechRecognitionSupported) {
        startRealTimeTranscription()
        toast.success('Grabación y transcripción en tiempo real iniciadas')
      } else {
        toast.success('Grabación iniciada')
      }
      
      setMicrophoneStatus('granted') // Update permission status on successful access
    } catch (error: any) {
      console.error('Error accessing microphone:', error)
      
      // Handle specific error cases and update permission status
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setMicrophoneStatus('denied')
        toast.error('Permiso de micrófono denegado. Por favor, permite el acceso al micrófono y recarga la página.')
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setMicrophoneStatus('unavailable')
        toast.error('No se encontró micrófono. Verifica que tengas un micrófono conectado.')
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        toast.error('El micrófono está siendo usado por otra aplicación. Cierra otras aplicaciones que usen el micrófono.')
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        toast.error('Error de configuración del micrófono. Tu dispositivo no cumple los requisitos.')
      } else if (error.name === 'NotSupportedError') {
        setMicrophoneStatus('unavailable')
        toast.error('Tu navegador no soporta grabación de audio. Prueba con Chrome, Firefox o Safari.')
      } else if (error.name === 'AbortError') {
        toast.error('Acceso al micrófono cancelado.')
      } else {
        toast.error(`Error al acceder al micrófono: ${error.message || 'Error desconocido'}`)
      }
    }
  }

  // const stopRecording = () => {
  //   if (mediaRecorderRef.current && isRecording) {
  //     mediaRecorderRef.current.stop()
  //     setIsRecording(false)
      
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current)
  //       timerRef.current = null
  //     }
      
  //     // Stop real-time transcription
  //     if (isListening) {
  //       stopRealTimeTranscription()
  //       toast.success('Grabación y transcripción finalizadas')
  //     } else {
  //       toast.success('Grabación finalizada')
  //     }
      
  //     // Limpiar el stream y detener todos los tracks inmediatamente
  //     if (streamRef.current) {
  //       streamRef.current.getTracks().forEach(track => {
  //         track.stop()
  //       })
  //       streamRef.current = null
  //     }
  //   }
  // }

const stopRecording = () => {
  if (mediaRecorderRef.current && isRecording) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Detener transcripción en tiempo real y evitar reinicio automático
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stopped = true;
      speechRecognitionRef.current.stop();
    }
    setIsListening(false);

    // Consolidar la transcripción final
    setTranscription((finalTranscript + interimTranscript).trim());

    toast.success('Grabación y transcripción finalizadas');

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }
};

 const playAudio = () => {
  if (audioRef.current) {
    audioRef.current.play();
    setIsPlaying(true);
    setIsPaused(false);
  }
};

const pauseAudio = () => {
  if (audioRef.current) {
    audioRef.current.pause();
    setIsPlaying(false);
    setIsPaused(true);
  }
};

  const resetRecording = () => {
    if (isRecording) {
      stopRecording()
    }
    
    if (isListening) {
      stopRealTimeTranscription()
    }
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    
    setAudioBlob(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setAudioMimeType('')
    setIsPlaying(false)
    setIsPaused(false)
    setRecordingTime(0)
    setTranscription('')
    setFinalTranscript('')
    setInterimTranscript('')
    setIsCopied(false)
    
    toast.success('Grabación reiniciada')
  }

  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast.error('No hay audio para transcribir')
      return
    }

    setIsTranscribing(true)
    
    try {
      // Determinar la extensión correcta basada en el tipo MIME
      const getFileExtension = (mimeType: string) => {
        if (mimeType.includes('webm')) return 'webm'
        if (mimeType.includes('wav')) return 'wav'
        if (mimeType.includes('mp3')) return 'mp3'
        if (mimeType.includes('ogg')) return 'ogg'
        return 'wav' // fallback
      }

      const extension = getFileExtension(audioMimeType)
      const fileName = `recording.${extension}`

      const formData = new FormData()
      formData.append('audio', audioBlob, fileName)
      formData.append('petId', petId)
      formData.append('mimeType', audioMimeType)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Transcription API error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })
        throw new Error(errorData.details || errorData.message || `Error HTTP ${response.status} en la transcripción`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let transcriptionBuffer = ''
      let partialRead = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          partialRead += decoder.decode(value, { stream: true })
          
          // Process complete lines
          let lines = partialRead.split('\n')
          partialRead = lines.pop() || '' // Keep incomplete line
          
          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              const data = line.slice(6).trim()
              
              if (data === '[DONE]') {
                setTranscription(transcriptionBuffer.trim())
                toast.success('Transcripción completada')
                return
              }
              
              // Skip empty data
              if (!data) continue
              
              try {
                // Validate JSON format before parsing
                if (!data.startsWith('{') && !data.startsWith('[')) {
                  console.warn('Received non-JSON data, skipping:', data.substring(0, 50))
                  continue
                }
                
                const parsed = JSON.parse(data)
                
                // Handle error responses
                if (parsed.error) {
                  console.error('API error received:', parsed.error)
                  throw new Error(parsed.error)
                }
                
                // Process content
                if (parsed.content) {
                  transcriptionBuffer += parsed.content
                  setTranscription(transcriptionBuffer)
                }
              } catch (parseError) {
                console.error('JSON parsing error:', {
                  error: parseError,
                  data: data.substring(0, 100),
                  dataLength: data.length
                })
                
                // If it's a JSON parsing error, check for specific error patterns
                if (parseError instanceof SyntaxError) {
                  if (data.toLowerCase().includes('upstream') || 
                      data.toLowerCase().includes('error') ||
                      data.toLowerCase().includes('failed')) {
                    throw new Error('Error en el servicio de transcripción: Problema de conectividad')
                  }
                  // Skip invalid JSON chunks
                  continue
                } else {
                  // Re-throw other errors (like API errors)
                  throw parseError
                }
              }
            }
          }
        }
        
        // If we exit the loop without receiving [DONE], finalize the transcription
        if (transcriptionBuffer.trim()) {
          setTranscription(transcriptionBuffer.trim())
          toast.success('Transcripción completada')
        }
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al transcribir el audio'
      toast.error(`Error al transcribir: ${errorMessage}`)
    } finally {
      setIsTranscribing(false)
    }
  }

  const copyTranscription = async () => {
    const currentTranscript = finalTranscript + interimTranscript
    const textToCopy = isListening ? currentTranscript : transcription
    if (!textToCopy) return
    
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      toast.success('Transcripción copiada al portapapeles')
      
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Error al copiar al portapapeles')
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-red-600" />
            Grabador de Voz
          </div>
          {microphoneStatus !== 'unknown' && (
            <Badge 
              variant={
                microphoneStatus === 'granted' ? 'default' : 
                microphoneStatus === 'denied' ? 'destructive' : 
                'secondary'
              }
              className="text-xs"
            >
              {microphoneStatus === 'granted' ? '🎤 Acceso permitido' :
               microphoneStatus === 'denied' ? '🚫 Acceso denegado' :
               '⚠️ No disponible'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recording Controls */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            {isRecording ? (
              <motion.div
                key="recording"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <motion.div
                    className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <MicOff className="h-8 w-8 text-white" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="destructive" className="animate-pulse">
                      REC
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-mono text-red-600">
                    {formatTime(recordingTime)}
                  </p>
                  <p className="text-sm text-gray-600">Grabando...</p>
                </div>
                
                <Button 
                  onClick={stopRecording}
                  variant="destructive"
                  size="lg"
                  className="w-full"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Detener Grabación
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="space-y-4"
              >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto hover:bg-green-600 transition-colors cursor-pointer"
                     onClick={startRecording}>
                  <Mic className="h-8 w-8 text-white" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {audioBlob ? 'Grabación lista' : 
                     microphoneStatus === 'denied' ? 'Permiso de micrófono denegado' :
                     microphoneStatus === 'unavailable' ? 'Micrófono no disponible' :
                     'Presiona para grabar'}
                  </p>
                  {recordingTime > 0 && !audioBlob && (
                    <p className="text-xs text-gray-500 font-mono">
                      Última duración: {formatTime(recordingTime)}
                    </p>
                  )}
                  {microphoneStatus === 'denied' && (
                    <p className="text-xs text-red-600">
                      Ve a configuración del navegador y permite el acceso al micrófono
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={startRecording}
                  className="w-full veterinary-gradient text-white"
                  size="lg"
                  disabled={microphoneStatus === 'unavailable' || microphoneStatus === 'denied'}
                >
                  <Mic className="h-5 w-5 mr-2" />
                  {microphoneStatus === 'denied' ? 'Permiso Denegado' :
                   microphoneStatus === 'unavailable' ? 'No Disponible' :
                   'Iniciar Grabación'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Audio Playback Controls */}
       {audioUrl && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg">
      <FileAudio className="h-5 w-5 text-gray-600" />
      <span className="text-sm text-gray-700">
        Audio grabado ({formatTime(recordingTime)})
      </span>
    </div>

    <div className="flex gap-2">
      <Button
        onClick={isPlaying ? pauseAudio : playAudio}
        variant="outline"
        className="flex-1"
        disabled={!audioUrl}
      >
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4 mr-2" />
            Pausar
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Reproducir
          </>
        )}
      </Button>
      <Button
        onClick={resetRecording}
        variant="outline"
        size="icon"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>

    <audio
      ref={audioRef}
      src={audioUrl || undefined}
      onEnded={() => {
        setIsPlaying(false)
        setIsPaused(false)
      }}
      style={{ display: 'none' }}
    />
  </motion.div>
)}

        {/* Transcription */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              Transcripción
              {speechRecognitionSupported && (
                <Badge variant="outline" className="text-xs ml-2">
                  En tiempo real
                </Badge>
              )}
              {!speechRecognitionSupported && (
                <Badge variant="secondary" className="text-xs ml-2">
                  Whisper AI
                </Badge>
              )}
            </h4>
            
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex items-center gap-2 text-blue-600"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Escuchando...</span>
              </motion.div>
            )}

            {/* Whisper AI Fallback Button */}
            {!isListening && audioBlob && (
              <Button
                onClick={transcribeAudio}
                disabled={isTranscribing}
                size="sm"
                variant="outline"
              >
                {isTranscribing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="h-4 w-4 mr-2"
                    >
                      <Zap className="h-4 w-4" />
                    </motion.div>
                    Whisper AI...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Usar Whisper AI
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="relative">
            <Textarea
              value={isListening ? (finalTranscript + interimTranscript) : transcription}
              onChange={(e) => {
                if (!isListening) {
                  setTranscription(e.target.value)
                }
              }}
              placeholder={
                speechRecognitionSupported 
                  ? (isListening 
                    ? "Habla ahora... el texto aparecerá aquí en tiempo real" 
                    : "Presiona 'Iniciar Grabación' para comenzar la transcripción en tiempo real")
                  : (audioBlob 
                    ? "Presiona 'Usar Whisper AI' para convertir el audio a texto..." 
                    : "Graba un audio primero para obtener la transcripción...")
              }
              className={`min-h-[120px] resize-none transition-colors ${
                isListening ? 'bg-blue-50 border-blue-200 text-blue-900' : ''
              }`}
              disabled={isTranscribing}
              readOnly={isListening}
            />
            
            {/* Real-time indicator */}
            {isListening && interimTranscript && (
              <div className="absolute bottom-2 left-2 text-xs text-blue-600 font-medium">
                Transcribiendo...
              </div>
            )}
            
            {(transcription || finalTranscript || interimTranscript) && (
              <Button
                onClick={copyTranscription}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Status indicators */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {speechRecognitionSupported ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                  <span>Transcripción en tiempo real disponible</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <Zap className="h-4 w-4" />
                  <span>Usando Whisper AI como respaldo</span>
                </div>
              )}
            </div>
            
            {(transcription || finalTranscript || interimTranscript) && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span>
                  {(isListening ? (finalTranscript + interimTranscript) : transcription).length} caracteres
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t space-y-2">
          <p className="text-xs text-gray-500 text-center">
            Usa la transcripción para completar rápidamente los campos de la consulta médica
          </p>
          
          {(transcription || finalTranscript || interimTranscript) && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                Usar como Síntomas
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                Usar como Diagnóstico
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
