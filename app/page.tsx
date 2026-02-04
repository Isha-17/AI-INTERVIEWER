import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Mic, 
  Video, 
  Brain, 
  Target, 
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-12">
        {/* Hero Section */}
        <section className="relative bg-[#161616] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 border border-[#0f62fe] rotate-45" />
            <div className="absolute bottom-20 right-20 w-96 h-96 border border-[#0f62fe] rotate-12" />
            <div className="absolute top-40 right-40 w-32 h-32 border border-[#0f62fe] -rotate-12" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-24 lg:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#0f62fe]/20 border border-[#0f62fe] px-4 py-2 text-sm mb-6">
                <Sparkles className="w-4 h-4 text-[#0f62fe]" />
                <span>Powered by IBM Watson AI</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 text-balance">
                AI-Powered Interviews.{" "}
                <span className="text-[#0f62fe] font-medium">Smarter Preparation.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#c6c6c6] mb-8 leading-relaxed max-w-2xl">
                Domain-independent, unbiased AI interviews powered by IBM Watson. 
                Practice with text, voice, or video and receive instant feedback to 
                ace your next interview.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-12 px-8 text-base"
                >
                  <Link href="/interview">
                    Start Interview
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[#161616] h-12 px-8 text-base bg-transparent"
                >
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Interview Modes Section */}
        <section className="py-20 bg-[#f4f4f4]">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#161616]">
                Choose Your Interview Mode
              </h2>
              <p className="text-[#525252] max-w-2xl mx-auto">
                Practice interviews in the format that works best for you. 
                Each mode provides AI-powered feedback tailored to help you improve.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Text Mode */}
              <div className="bg-white p-8 border-t-4 border-t-[#0f62fe] hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#e8f1ff] flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-[#0f62fe]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#161616]">Text Mode</h3>
                <p className="text-[#525252] mb-6 leading-relaxed">
                  Type your responses at your own pace. Perfect for thoughtful, 
                  well-structured answers and those who prefer written communication.
                </p>
                <ul className="space-y-2 text-sm text-[#525252]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                    No time pressure
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                    Edit before submitting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                    Written feedback analysis
                  </li>
                </ul>
              </div>

              {/* Voice Mode */}
              <div className="bg-white p-8 border-t-4 border-t-[#6929c4] hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#f6f2ff] flex items-center justify-center mb-6">
                  <Mic className="w-6 h-6 text-[#6929c4]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#161616]">Voice Mode</h3>
                <p className="text-[#525252] mb-6 leading-relaxed">
                  Speak your answers naturally. Practice verbal communication skills 
                  and get feedback on clarity and confidence.
                </p>
                <ul className="space-y-2 text-sm text-[#525252]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                    Real-time transcription
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                    Speech clarity analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                    Verbal communication tips
                  </li>
                </ul>
              </div>

              {/* Camera Mode */}
              <div className="bg-white p-8 border-t-4 border-t-[#198038] hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#defbe6] flex items-center justify-center mb-6">
                  <Video className="w-6 h-6 text-[#198038]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#161616]">Camera Mode</h3>
                <p className="text-[#525252] mb-6 leading-relaxed">
                  Full video interview simulation. Practice body language, 
                  eye contact, and overall presentation skills.
                </p>
                <ul className="space-y-2 text-sm text-[#525252]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                    Video recording
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                    Presentation feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                    Full interview simulation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-light mb-6 text-[#161616]">
                  Intelligent Interview Training
                </h2>
                <p className="text-[#525252] text-lg mb-8 leading-relaxed">
                  Our AI-powered platform adapts to any domain and role, providing 
                  personalized interview practice that helps you build confidence 
                  and improve your skills.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-[#e8f1ff] flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-[#0f62fe]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#161616] mb-1">AI-Driven Analysis</h3>
                      <p className="text-sm text-[#525252]">
                        Advanced NLP evaluates your responses for structure, clarity, and relevance.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-[#e8f1ff] flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-[#0f62fe]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#161616] mb-1">Domain Independent</h3>
                      <p className="text-sm text-[#525252]">
                        Practice for any role - technical, HR, behavioral, management, and more.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-[#e8f1ff] flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-[#0f62fe]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#161616] mb-1">Detailed Feedback</h3>
                      <p className="text-sm text-[#525252]">
                        Get comprehensive scores, strengths, areas for improvement, and actionable tips.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#f4f4f4] p-8 lg:p-12">
                <div className="bg-white p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[#525252]">Overall Score</span>
                    <span className="text-2xl font-semibold text-[#0f62fe]">8.5/10</span>
                  </div>
                  <div className="h-2 bg-[#e0e0e0]">
                    <div className="h-full bg-[#0f62fe] w-[85%]" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4">
                    <span className="text-xs text-[#525252] block mb-1">Communication</span>
                    <span className="text-lg font-semibold text-[#161616]">9/10</span>
                  </div>
                  <div className="bg-white p-4">
                    <span className="text-xs text-[#525252] block mb-1">Clarity</span>
                    <span className="text-lg font-semibold text-[#161616]">8/10</span>
                  </div>
                  <div className="bg-white p-4">
                    <span className="text-xs text-[#525252] block mb-1">Confidence</span>
                    <span className="text-lg font-semibold text-[#161616]">8.5/10</span>
                  </div>
                  <div className="bg-white p-4">
                    <span className="text-xs text-[#525252] block mb-1">Relevance</span>
                    <span className="text-lg font-semibold text-[#161616]">8.5/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IBM SkillsBuild Section */}
        <section className="py-20 bg-[#0f62fe] text-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Built with IBM SkillsBuild
              </h2>
              <p className="text-lg text-[#d0e2ff] mb-8 leading-relaxed">
                This platform is developed under the IBM SkillsBuild program, leveraging 
                IBM Watson AI to deliver enterprise-grade interview training accessible 
                to everyone. No sign-up required – start practicing immediately.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-white text-[#0f62fe] hover:bg-[#e8f1ff] h-12 px-8"
                >
                  <Link href="/interview">
                    Start Free Practice
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[#0f62fe] h-12 px-8 bg-transparent"
                >
                  <a 
                    href="https://skillsbuild.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Learn About IBM SkillsBuild
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-[#f4f4f4]">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-[#161616]">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Choose Mode", desc: "Select text, voice, or camera interview mode" },
                { step: "02", title: "Set Preferences", desc: "Pick your role, interview type, and difficulty" },
                { step: "03", title: "Practice Interview", desc: "Answer AI-generated questions in real-time" },
                { step: "04", title: "Get Feedback", desc: "Receive detailed scores and improvement tips" }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="text-5xl font-light text-[#0f62fe] mb-4">{item.step}</div>
                  <h3 className="text-lg font-semibold text-[#161616] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#525252]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-[#161616]">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-lg text-[#525252] mb-8">
              No registration required. Start practicing with AI-powered interviews now.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-14 px-10 text-lg"
            >
              <Link href="/interview">
                Start Interview Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
