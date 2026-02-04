import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowRight, BarChart3, Target, Award } from "lucide-react"

export default function ResultsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1 pt-12">
        <div className="bg-[#161616] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-light mb-2">
              Interview Results
            </h1>
            <p className="text-[#c6c6c6]">
              View your interview performance and AI feedback
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16">
          <div className="bg-white p-12 text-center">
            <div className="w-20 h-20 bg-[#e8f1ff] flex items-center justify-center mx-auto mb-6">
              <FileQuestion className="w-10 h-10 text-[#0f62fe]" />
            </div>
            
            <h2 className="text-2xl font-semibold text-[#161616] mb-4">
              No Recent Interview Results
            </h2>
            
            <p className="text-[#525252] mb-8 max-w-md mx-auto">
              Complete an interview practice session to see your detailed performance analysis 
              and AI-powered feedback here.
            </p>

            <Button
              asChild
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-12 px-8"
            >
              <Link href="/interview">
                Start Interview
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* What You'll Get */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-[#161616] text-center mb-8">
              What You Will Get After Each Interview
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 text-center">
                <div className="w-12 h-12 bg-[#e8f1ff] flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-[#0f62fe]" />
                </div>
                <h4 className="font-semibold text-[#161616] mb-2">Detailed Scores</h4>
                <p className="text-sm text-[#525252]">
                  Get scores for relevance, clarity, structure, and confidence for each answer
                </p>
              </div>

              <div className="bg-white p-6 text-center">
                <div className="w-12 h-12 bg-[#defbe6] flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-[#198038]" />
                </div>
                <h4 className="font-semibold text-[#161616] mb-2">STAR Analysis</h4>
                <p className="text-sm text-[#525252]">
                  Evaluation using the STAR method for behavioral questions
                </p>
              </div>

              <div className="bg-white p-6 text-center">
                <div className="w-12 h-12 bg-[#f6f2ff] flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-[#6929c4]" />
                </div>
                <h4 className="font-semibold text-[#161616] mb-2">Hiring Recommendation</h4>
                <p className="text-sm text-[#525252]">
                  AI-powered hiring recommendation based on your performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
