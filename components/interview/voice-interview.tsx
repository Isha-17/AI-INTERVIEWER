"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Send, Loader2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import SpeechRecognition from "speech-recognition"

interface VoiceInterviewProps {
  question: string
  questionNumber: number
  totalQuestions: number
  onSubmit: (answer: string, timeSpent: number) => void
  isSubmitting: boolean
}

export function VoiceInterview({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  isSubmitting
}: VoiceInterviewProps) {
  const [answer, setAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [startTime])

  useEffect(() => {
    // Check for browser support
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " "
            } else {
              interimTranscript += transcript
            }
          }
          
          if (finalTranscript) {
            setAnswer(prev => prev + finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error("[v0] Speech recognition error:", event.error)
          setIsRecording(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = async () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Set up audio visualization
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)

      const updateLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(average / 255)
        }
        animationRef.current = requestAnimationFrame(updateLevel)
      }
      updateLevel()

      recognitionRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("[v0] Error starting recording:", error)
      alert("Could not access microphone. Please allow microphone access and try again.")
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    setIsRecording(false)
    setAudioLevel(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = () => {
    if (!answer.trim() || isSubmitting) return
    stopRecording()
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    onSubmit(answer, timeSpent)
    setAnswer("")
  }

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="h-full flex flex-col">
      {/* Question Display */}
      <div className="bg-white border-b border-[#e0e0e0] p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#525252]">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-mono text-[#0f62fe]">{formatTime(elapsedTime)}</span>
        </div>
        <p className="text-lg text-[#161616] leading-relaxed">{question}</p>
      </div>

      {/* Voice Controls & Transcript */}
      <div className="flex-1 p-6 bg-[#f4f4f4]">
        <div className="h-full flex flex-col">
          {/* Recording Status */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className={`h-16 w-16 rounded-full ${
                isRecording 
                  ? "bg-[#da1e28] hover:bg-[#ba1b23]" 
                  : "bg-[#0f62fe] hover:bg-[#0353e9]"
              }`}
            >
              {isRecording ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </Button>
            
            {isRecording && (
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#0f62fe]" />
                <div className="w-32 h-2 bg-[#e0e0e0] overflow-hidden">
                  <div 
                    className="h-full bg-[#0f62fe] transition-all duration-100"
                    style={{ width: `${audioLevel * 100}%` }}
                  />
                </div>
                <span className="text-sm text-[#da1e28] animate-pulse">Recording...</span>
              </div>
            )}
          </div>

          {/* Transcript */}
          <div className="flex-1 mb-4">
            <label className="text-sm font-medium text-[#161616] mb-2 block">
              Transcript (you can edit)
            </label>
            <Textarea
              placeholder="Start speaking or type your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="h-full min-h-[150px] resize-none border-[#8d8d8d] focus:border-[#0f62fe] focus:ring-[#0f62fe] text-base leading-relaxed"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#525252]">
              {wordCount} words
            </span>
            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || isSubmitting}
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-12 px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Answer
                  <Send className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
