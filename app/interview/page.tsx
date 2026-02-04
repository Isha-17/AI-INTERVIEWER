import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { InterviewSetup } from "@/components/interview/interview-setup"

export default function InterviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />
      
      <main className="flex-1 pt-12">
        <div className="bg-[#161616] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-light mb-2">
              Start Your Interview
            </h1>
            <p className="text-[#c6c6c6]">
              Practice with AI-powered interviews tailored to your role
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <InterviewSetup />
        </div>
      </main>

      <Footer />
    </div>
  )
}
