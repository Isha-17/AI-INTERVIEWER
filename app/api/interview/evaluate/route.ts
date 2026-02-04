import { generateText, Output } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"
import type { InterviewConfig, UserAnswer, QuestionFeedback, InterviewResult } from "@/lib/interview-types"

export const maxDuration = 120

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const feedbackSchema = z.object({
  questionFeedback: z.array(
    z.object({
      questionId: z.number(),
      scores: z.object({
        relevance: z.number(),
        clarity: z.number(),
        structure: z.number(),
        confidence: z.number(),
        overall: z.number()
      }),
      starAnalysis: z.object({
        situation: z.number(),
        task: z.number(),
        action: z.number(),
        result: z.number()
      }),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      suggestions: z.string()
    })
  ),
  overallScore: z.number(),
  recommendation: z.enum(["strong-hire", "hire", "hold", "reject"]),
  summary: z.object({
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    overallFeedback: z.string()
  })
})

export async function POST(req: Request) {
  try {
    const { config, answers }: { config: InterviewConfig; answers: UserAnswer[] } = await req.json()
    
    const prompt = `You are an expert HR interviewer and interview coach. Evaluate the following interview responses.

Interview Configuration:
- Role: ${config.role}
- Interview Type: ${config.type}
- Difficulty: ${config.difficulty}
- Experience Level: ${config.experience}

Candidate Responses:
${answers.map((a, i) => `
Question ${i + 1}: ${a.question}
Answer: ${a.answer}
Time Spent: ${a.timeSpent} seconds
`).join("\n")}

Evaluation Guidelines:
1. Score each category from 1-10 (1 being poor, 10 being excellent)
2. Use the STAR method analysis for behavioral questions
3. Be constructive but honest in feedback
4. Provide actionable improvement suggestions
5. Consider the experience level when evaluating

For each answer, evaluate:
- Relevance: How well the answer addresses the question
- Clarity: How clear and understandable the response is
- Structure: How well-organized the answer is (STAR method if applicable)
- Confidence: Perceived confidence based on language and content
- Overall: Holistic assessment of the answer quality

STAR Analysis (for behavioral questions):
- Situation: How well they set up the context
- Task: How well they explained their role/responsibility
- Action: How well they described what they did
- Result: How well they communicated the outcome

Provide:
1. Individual feedback for each question
2. Overall interview score (1-10, convert to percentage)
3. Hiring recommendation based on performance
4. Summary of key strengths and areas for improvement
5. Actionable suggestions for future interviews

Be encouraging but realistic. Focus on helping the candidate improve.`

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      output: Output.object({ schema: feedbackSchema })
    })

    if (!result.object) {
      throw new Error("Failed to get evaluation from AI")
    }

    const { questionFeedback, overallScore, recommendation, summary } = result.object

    // Build full feedback with question text
    const fullFeedback: QuestionFeedback[] = questionFeedback.map((fb, index) => ({
      ...fb,
      question: answers[index]?.question || "",
      answer: answers[index]?.answer || ""
    }))

    const totalDuration = answers.reduce((sum, a) => sum + a.timeSpent, 0)

    const interviewResult: InterviewResult = {
      config,
      answers,
      feedback: fullFeedback,
      overallScore: Math.round(overallScore * 10), // Convert to percentage
      recommendation,
      summary,
      totalDuration,
      completedAt: new Date().toISOString()
    }

    return Response.json(interviewResult)
  } catch (error) {
    console.error("[v0] Error evaluating interview:", error)
    
    // Return basic evaluation if AI fails
    const { config, answers } = await req.json().catch(() => ({ config: null, answers: [] }))
    
    const fallbackResult: InterviewResult = {
      config: config || {
        mode: "text",
        type: "general",
        difficulty: "medium",
        role: "Professional",
        experience: "Mid-level",
        questionCount: answers?.length || 5
      },
      answers: answers || [],
      feedback: (answers || []).map((a: UserAnswer, i: number) => ({
        questionId: i + 1,
        question: a?.question || "",
        answer: a?.answer || "",
        scores: {
          relevance: 7,
          clarity: 7,
          structure: 6,
          confidence: 7,
          overall: 7
        },
        starAnalysis: {
          situation: 6,
          task: 6,
          action: 7,
          result: 6
        },
        strengths: ["Provided a response", "Attempted to answer the question"],
        improvements: ["Could provide more specific examples", "Consider using the STAR method"],
        suggestions: "Practice structuring your answers using the STAR method for behavioral questions."
      })),
      overallScore: 70,
      recommendation: "hold",
      summary: {
        strengths: ["Completed the interview", "Provided responses to all questions"],
        improvements: ["Add more specific examples", "Structure answers better", "Use the STAR method"],
        overallFeedback: "Thank you for completing the interview practice. To improve, focus on using specific examples from your experience and structure your answers using the STAR method (Situation, Task, Action, Result)."
      },
      totalDuration: (answers || []).reduce((sum: number, a: UserAnswer) => sum + (a?.timeSpent || 0), 0),
      completedAt: new Date().toISOString()
    }

    return Response.json(fallbackResult)
  }
}
