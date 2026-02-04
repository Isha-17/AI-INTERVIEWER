import { generateObject } from "ai"
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
        relevance: z.number().min(1).max(10),
        clarity: z.number().min(1).max(10),
        structure: z.number().min(1).max(10),
        confidence: z.number().min(1).max(10),
        overall: z.number().min(1).max(10)
      }),
      starAnalysis: z.object({
        situation: z.number().min(1).max(10),
        task: z.number().min(1).max(10),
        action: z.number().min(1).max(10),
        result: z.number().min(1).max(10)
      }),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      suggestions: z.string()
    })
  ),
  overallScore: z.number().min(1).max(10),
  recommendation: z.enum(["strong-hire", "hire", "hold", "reject"]),
  summary: z.object({
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    overallFeedback: z.string()
  })
})

// Helper function to detect dummy/low-quality answers
function isLowQualityAnswer(answer: string): boolean {
  const trimmed = answer.trim().toLowerCase()
  
  // Very short answers (less than 20 characters)
  if (trimmed.length < 20) return true
  
  // Single word or very few words
  const wordCount = trimmed.split(/\s+/).length
  if (wordCount < 5) return true
  
  // Common dummy patterns
  const dummyPatterns = [
    /^(test|testing|asdf|qwerty|abc|xyz|dummy|sample|example|lorem|ipsum)/i,
    /^(yes|no|maybe|idk|i don't know|nothing|none|na|n\/a)$/i,
    /^(hello|hi|hey|ok|okay|good|fine|great|nice|cool)$/i,
    /^[\d\s.,!?]+$/, // Only numbers and punctuation
    /^(.)\1{5,}$/, // Repeated characters like "aaaaaaa"
    /^[a-z]{1,3}$/i, // Single short strings
  ]
  
  for (const pattern of dummyPatterns) {
    if (pattern.test(trimmed)) return true
  }
  
  // Check if it's mostly nonsense (random characters)
  const alphaRatio = (trimmed.match(/[a-z]/gi) || []).length / trimmed.length
  if (alphaRatio < 0.5 && trimmed.length > 10) return true
  
  return false
}

// Calculate quality-adjusted score for low-quality answers
function calculateLowQualityScore(answer: string): number {
  const length = answer.trim().length
  const wordCount = answer.trim().split(/\s+/).length
  
  // Base score starts very low for dummy answers
  let score = 1
  
  // Add small amounts based on effort
  if (wordCount >= 3) score += 0.5
  if (wordCount >= 10) score += 0.5
  if (length >= 50) score += 0.5
  if (length >= 100) score += 0.5
  
  return Math.min(score, 3) // Cap at 3 for low-quality answers
}

export async function POST(req: Request) {
  const body = await req.json()
  const { config, answers }: { config: InterviewConfig; answers: UserAnswer[] } = body
  
  // Validate that we have actual answers
  if (!answers || answers.length === 0) {
    return Response.json({ error: "No answers provided" }, { status: 400 })
  }
  
  // Check for low-quality/dummy answers
  const lowQualityAnswers = answers.filter(a => isLowQualityAnswer(a.answer))
  const hasAllLowQuality = lowQualityAnswers.length === answers.length
  const lowQualityRatio = lowQualityAnswers.length / answers.length
  
  // If ALL answers are dummy/low-quality, return immediate low score without AI
  if (hasAllLowQuality) {
    const lowScore = Math.round(calculateLowQualityScore(answers[0]?.answer || "") * 10)
    
    const lowQualityResult: InterviewResult = {
      config,
      answers,
      feedback: answers.map((a, i) => ({
        questionId: i + 1,
        question: a.question,
        answer: a.answer,
        scores: {
          relevance: 1,
          clarity: 1,
          structure: 1,
          confidence: 1,
          overall: 1
        },
        starAnalysis: {
          situation: 1,
          task: 1,
          action: 1,
          result: 1
        },
        strengths: [],
        improvements: [
          "Your answer does not address the question at all",
          "Please provide a genuine, thoughtful response",
          "Include specific examples from your experience",
          "Use the STAR method to structure your answer"
        ],
        suggestions: "This answer appears to be placeholder text or a very minimal response. To succeed in interviews, you need to provide detailed, genuine answers that demonstrate your skills, experience, and thought process. Please try again with a real answer that addresses the question."
      })),
      overallScore: lowScore,
      recommendation: "reject",
      summary: {
        strengths: [],
        improvements: [
          "Provide genuine, thoughtful responses to interview questions",
          "Include specific examples from your real experience",
          "Structure answers using the STAR method (Situation, Task, Action, Result)",
          "Take time to understand each question before answering",
          "Practice articulating your experiences clearly"
        ],
        overallFeedback: "Your responses appear to be placeholder text, test data, or extremely minimal answers. In a real interview, this would result in immediate rejection. To improve, please provide genuine, detailed answers that showcase your actual skills and experience. Each answer should be at least 2-3 sentences and directly address the question asked. Consider practicing with real scenarios from your work or academic experience."
      },
      totalDuration: answers.reduce((sum, a) => sum + a.timeSpent, 0),
      completedAt: new Date().toISOString()
    }
    
    return Response.json(lowQualityResult)
  }
  
  try {
    const prompt = `You are an expert HR interviewer and interview coach. Evaluate the following interview responses STRICTLY and HONESTLY.

CRITICAL EVALUATION RULES:
- Score VERY LOW (1-3) for answers that are: nonsensical, off-topic, too short, generic, or don't demonstrate real experience
- Score MEDIUM (4-6) for answers that: partially address the question but lack depth or specifics
- Score HIGH (7-8) for answers that: clearly address the question with good examples and structure
- Score EXCELLENT (9-10) ONLY for answers that: are exceptional, detailed, well-structured with specific examples

BE STRICT: Most candidates should score between 4-7. Only exceptional answers get 8+. Poor/lazy answers get 1-3.

Interview Configuration:
- Role: ${config.role}
- Interview Type: ${config.type}
- Difficulty: ${config.difficulty}
- Experience Level: ${config.experience}

Candidate Responses:
${answers.map((a, i) => `
Question ${i + 1}: ${a.question}
Answer: "${a.answer}"
Answer Length: ${a.answer.length} characters, ${a.answer.split(/\s+/).length} words
Time Spent: ${a.timeSpent} seconds
`).join("\n")}

EVALUATION CRITERIA:
1. Relevance (1-10): Does the answer actually address the question? (1 = completely off-topic, 10 = perfectly relevant)
2. Clarity (1-10): Is the response clear and understandable? (1 = incomprehensible, 10 = crystal clear)
3. Structure (1-10): Is the answer well-organized? Uses STAR method if applicable? (1 = no structure, 10 = perfect structure)
4. Confidence (1-10): Does the language show confidence? (1 = very uncertain, 10 = highly confident)
5. Overall (1-10): Holistic assessment (1 = unusable answer, 10 = exceptional answer)

STAR Analysis (for behavioral questions, score 1-10 each):
- Situation: Did they set up context? (1 = no context, 10 = excellent context)
- Task: Did they explain their role? (1 = unclear role, 10 = clear responsibility)
- Action: Did they describe actions taken? (1 = no actions, 10 = detailed actions)
- Result: Did they share outcomes? (1 = no results, 10 = quantified results)

IMPORTANT: 
- If an answer is just a few words, random text, or doesn't make sense, give it scores of 1-2
- If an answer is generic without specifics, cap scores at 4-5
- The overall score should reflect the AVERAGE quality, not be inflated

Provide detailed, constructive feedback for each answer with specific suggestions for improvement.`

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      schema: feedbackSchema
    })

    if (!result.object) {
      throw new Error("Failed to get evaluation from AI")
    }

    const { questionFeedback, overallScore, recommendation, summary } = result.object

    // Apply penalty for low-quality answers detected earlier
    let adjustedOverallScore = overallScore
    if (lowQualityRatio > 0) {
      // Reduce score based on percentage of low-quality answers
      adjustedOverallScore = Math.max(1, overallScore * (1 - lowQualityRatio * 0.5))
    }

    // Build full feedback with question text
    const fullFeedback: QuestionFeedback[] = questionFeedback.map((fb, index) => {
      const answer = answers[index]
      const isLowQuality = answer ? isLowQualityAnswer(answer.answer) : false
      
      // If this specific answer was low quality, ensure scores reflect that
      if (isLowQuality) {
        return {
          ...fb,
          question: answer?.question || "",
          answer: answer?.answer || "",
          scores: {
            relevance: Math.min(fb.scores.relevance, 2),
            clarity: Math.min(fb.scores.clarity, 2),
            structure: Math.min(fb.scores.structure, 2),
            confidence: Math.min(fb.scores.confidence, 2),
            overall: Math.min(fb.scores.overall, 2)
          },
          starAnalysis: {
            situation: Math.min(fb.starAnalysis.situation, 2),
            task: Math.min(fb.starAnalysis.task, 2),
            action: Math.min(fb.starAnalysis.action, 2),
            result: Math.min(fb.starAnalysis.result, 2)
          },
          improvements: [
            ...fb.improvements,
            "Your answer appears to be placeholder text - please provide a genuine response"
          ]
        }
      }
      
      return {
        ...fb,
        question: answer?.question || "",
        answer: answer?.answer || ""
      }
    })

    const totalDuration = answers.reduce((sum, a) => sum + a.timeSpent, 0)

    const interviewResult: InterviewResult = {
      config,
      answers,
      feedback: fullFeedback,
      overallScore: Math.round(adjustedOverallScore * 10), // Convert to percentage
      recommendation,
      summary,
      totalDuration,
      completedAt: new Date().toISOString()
    }

    return Response.json(interviewResult)
  } catch (error) {
    console.error("[v0] Error evaluating interview:", error)
    
    // Return error response instead of fake good scores
    return Response.json({ 
      error: "Failed to evaluate interview. Please check your API configuration and try again.",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
