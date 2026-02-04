"use client"

import { useState, useEffect, useRef } from "react"
import { Video, VideoOff, Mic, MicOff, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SpeechRecognition } from "web-speech-api"

interface CameraInterviewProps {
  question: string
  questionNumber: number
  totalQuestions: number
  onSubmit: (answer: string, timeSpent: number) => void
  isSubmitting: boolean
}

export function CameraInterview({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  isSubmitting
}: CameraInterviewProps) {
  const [answer, setAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [startTime])

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = ""
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " "
            }
          }
          
          if (finalTranscript) {
            setAnswer(prev => prev + finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error("[v0] Speech recognition error:", event.error)
        }
      }
    }

    return () => {
      stopCamera()
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 640, height: 480 }, 
        audio: true 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      streamRef.current = stream
      setIsCameraOn(true)
    } catch (error) {
      console.error("[v0] Error starting camera:", error)
      alert("Could not access camera/microphone. Please allow access and try again.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraOn(false)
    setIsRecording(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.")
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = () => {
    if (!answer.trim() || isSubmitting) return
    stopCamera()
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    onSubmit(answer, timeSpent)
    setAnswer("")
  }

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Video Panel */}
      <div className="lg:w-1/2 bg-[#161616] p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-white">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-mono text-[#0f62fe]">{formatTime(elapsedTime)}</span>
        </div>
        
        {/* Video Feed */}
        <div className="flex-1 relative bg-[#262626] mb-4 min-h-[240px]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${isCameraOn ? "" : "hidden"}`}
          />
          
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <VideoOff className="w-12 h-12 text-[#525252] mx-auto mb-2" />
                <p className="text-sm text-[#a8a8a8]">Camera is off</p>
              </div>
            </div>
          )}

          {isRecording && isCameraOn && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#da1e28] px-3 py-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs text-white font-medium">REC</span>
            </div>
          )}
        </div>

        {/* Video Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isCameraOn ? stopCamera : startCamera}
            variant={isCameraOn ? "destructive" : "default"}
            className={`h-12 w-12 rounded-full ${
              isCameraOn 
                ? "bg-[#da1e28] hover:bg-[#ba1b23]" 
                : "bg-[#0f62fe] hover:bg-[#0353e9]"
            }`}
          >
            {isCameraOn ? (
              <VideoOff className="w-5 h-5 text-white" />
            ) : (
              <Video className="w-5 h-5 text-white" />
            )}
          </Button>
          
          <Button
            onClick={toggleRecording}
            disabled={!isCameraOn}
            variant={isRecording ? "destructive" : "default"}
            className={`h-12 w-12 rounded-full ${
              !isCameraOn 
                ? "bg-[#525252] cursor-not-allowed"
                : isRecording 
                ? "bg-[#da1e28] hover:bg-[#ba1b23]" 
                : "bg-[#0f62fe] hover:bg-[#0353e9]"
            }`}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Question & Answer Panel */}
      <div className="lg:w-1/2 flex flex-col bg-white">
        {/* Question */}
        <div className="p-6 border-b border-[#e0e0e0]">
          <h3 className="text-sm font-medium text-[#525252] mb-2">Current Question</h3>
          <p className="text-lg text-[#161616] leading-relaxed">{question}</p>
        </div>

        {/* Transcript & Submit */}
        <div className="flex-1 p-6 bg-[#f4f4f4] flex flex-col">
          <label className="text-sm font-medium text-[#161616] mb-2 block">
            Your Answer (transcript - editable)
          </label>
          <Textarea
            placeholder="Start the camera and microphone to begin recording, or type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 min-h-[120px] resize-none border-[#8d8d8d] focus:border-[#0f62fe] focus:ring-[#0f62fe] text-base leading-relaxed"
            disabled={isSubmitting}
          />
          
          <div className="flex items-center justify-between mt-4">
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
