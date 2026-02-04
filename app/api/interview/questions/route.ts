import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"
import type { InterviewConfig, InterviewQuestion } from "@/lib/interview-types"

export const maxDuration = 60

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const questionsSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number(),
      question: z.string(),
      category: z.string()
    })
  )
})

export async function POST(req: Request) {
  try {
    const config: InterviewConfig = await req.json()
    
    const { 
      role, 
      type, 
      difficulty, 
      experience, 
      questionCount, 
      company, 
      industry, 
      resumeText, 
      skills, 
      focusAreas 
    } = config

    const difficultyGuide = {
      entry: "Ask foundational questions that assess basic competencies, potential, and learning agility. Focus on academic projects, internships, and transferable skills.",
      intermediate: "Ask questions that probe deeper into professional experience, decision-making, and impact. Expect specific examples with measurable outcomes.",
      senior: "Ask strategic and complex questions that assess leadership, cross-functional influence, and ability to drive organizational change. Probe for executive-level thinking.",
      executive: "Ask C-suite caliber questions focusing on vision, strategy, stakeholder management, P&L responsibility, and transformational leadership."
    }

    const typeGuide = {
      behavioral: `Focus on STAR-method questions that reveal character, resilience, and professional growth. Ask about:
        - Navigating ambiguity and complex stakeholder dynamics
        - Leading through change and adversity
        - Building and maintaining high-performing teams
        - Demonstrating integrity and ethical decision-making`,
      technical: `Ask role-specific technical questions that assess:
        - Deep domain expertise and problem-solving methodology
        - System design and architectural thinking (if applicable)
        - Technical leadership and mentorship capabilities
        - Staying current with industry trends and best practices`,
      hr: `Focus on cultural fit and alignment with organizational values:
        - Motivation and career aspirations
        - Work style and collaboration preferences
        - Values alignment and professional philosophy
        - Long-term commitment and growth potential`,
      "case-study": `Present business scenarios that test:
        - Analytical thinking and structured problem-solving
        - Business acumen and commercial awareness
        - Ability to synthesize information and make recommendations
        - Communication of complex ideas`,
      management: `Assess leadership capabilities through questions about:
        - Team development and performance management
        - Strategic planning and execution
        - Stakeholder management and influence
        - Change management and organizational development`,
      general: `Mix questions across all categories to provide comprehensive assessment of the candidate's capabilities.`
    }

    const prompt = `You are a senior talent acquisition partner at a Fortune 500 company with 20+ years of experience conducting interviews at top-tier organizations including IBM, McKinsey, Google, and Goldman Sachs.

Generate ${questionCount} exceptional interview questions for the following candidate profile:

CANDIDATE PROFILE:
- Target Role: ${role || "General Professional"}
- Target Company: ${company || "Leading Enterprise"}
- Industry: ${industry || "Technology"}
- Experience Level: ${experience}
- Interview Type: ${type}
- Seniority: ${difficulty}
${skills && skills.length > 0 ? `- Key Skills: ${skills.join(", ")}` : ""}
${focusAreas && focusAreas.length > 0 ? `- Focus Areas: ${focusAreas.join(", ")}` : ""}
${resumeText ? `- Resume Context: ${resumeText.substring(0, 500)}...` : ""}

SENIORITY GUIDELINES:
${difficultyGuide[difficulty as keyof typeof difficultyGuide]}

INTERVIEW TYPE FOCUS:
${typeGuide[type as keyof typeof typeGuide]}

QUESTION REQUIREMENTS:
1. Each question should be thoughtful, probing, and reveal genuine insight about the candidate
2. Questions should be open-ended and encourage detailed, substantive responses
3. Include follow-up context or multi-part questions where appropriate
4. Questions should be realistic - exactly what candidates would face at top companies
5. Vary the complexity and depth across questions
6. Make questions specific to the role and industry where relevant
7. For behavioral questions, frame them to elicit STAR-format responses
8. Avoid generic questions - each should feel tailored and intentional

EXAMPLE OF HIGH-QUALITY QUESTIONS:
- "Walk me through a time when you had to make a critical decision with incomplete information. What framework did you use, and how did you manage the stakeholders who would be affected by your decision?"
- "Describe a situation where you identified a significant business opportunity that others had missed. How did you build the case for it, and what was the outcome?"
- "Tell me about a time when you had to deliver difficult feedback to a senior stakeholder. How did you approach the conversation, and what did you learn from it?"

Generate questions that would impress senior leadership and accurately assess candidates for this role.`

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      schema: questionsSchema
    })

    const questions = result.object?.questions || generateFallbackQuestions(questionCount, type, difficulty)

    return Response.json({ questions })
  } catch (error) {
    console.error("[v0] Error generating questions:", error)
    
    // Return fallback questions if AI fails
    const fallbackConfig = await req.json().catch(() => ({}))
    const questions = generateFallbackQuestions(
      fallbackConfig.questionCount || 5, 
      fallbackConfig.type || "general",
      fallbackConfig.difficulty || "intermediate"
    )
    
    return Response.json({ questions })
  }
}

function generateFallbackQuestions(count: number, type: string, difficulty: string): InterviewQuestion[] {
  const questionBank: Record<string, Record<string, InterviewQuestion[]>> = {
    behavioral: {
      entry: [
        { id: 1, question: "Tell me about a project you worked on during your studies or internship that you're particularly proud of. What was your specific contribution, and what did you learn from the experience?", category: "Achievement" },
        { id: 2, question: "Describe a situation where you had to work with someone whose working style was very different from yours. How did you adapt, and what was the outcome?", category: "Collaboration" },
        { id: 3, question: "Walk me through a time when you received constructive criticism. How did you respond, and how did it change your approach going forward?", category: "Growth Mindset" },
        { id: 4, question: "Tell me about a time when you had to learn something completely new in a short period. What strategies did you use, and how successful were you?", category: "Learning Agility" },
        { id: 5, question: "Describe a situation where you identified an opportunity to improve a process or outcome. What did you do, and what was the result?", category: "Initiative" }
      ],
      intermediate: [
        { id: 1, question: "Describe a time when you had to influence stakeholders who were initially resistant to your proposal. What approach did you take, and how did you measure success?", category: "Influence" },
        { id: 2, question: "Tell me about a project where the requirements changed significantly midway through. How did you adapt your approach, and what did you learn about managing ambiguity?", category: "Adaptability" },
        { id: 3, question: "Walk me through a situation where you had to make a difficult trade-off between competing priorities. What framework did you use to make your decision?", category: "Decision Making" },
        { id: 4, question: "Describe a time when a project or initiative you led didn't achieve the expected results. What happened, what did you learn, and how have you applied those lessons since?", category: "Resilience" },
        { id: 5, question: "Tell me about a time when you had to build relationships and collaborate across different teams or departments to achieve a common goal. What challenges did you face?", category: "Cross-functional Leadership" }
      ],
      senior: [
        { id: 1, question: "Describe a time when you had to lead a significant organizational change. How did you build buy-in, manage resistance, and ensure sustainable adoption?", category: "Change Leadership" },
        { id: 2, question: "Tell me about a situation where you had to balance short-term business pressures with long-term strategic goals. How did you navigate this tension?", category: "Strategic Thinking" },
        { id: 3, question: "Walk me through a time when you had to coach or develop a high-potential employee who was struggling. What was your approach, and what was the outcome?", category: "People Development" },
        { id: 4, question: "Describe a situation where you identified a significant risk to the business that others had overlooked. How did you raise the concern and drive action?", category: "Risk Management" },
        { id: 5, question: "Tell me about a time when you had to make an unpopular decision that you believed was right for the organization. How did you handle the pushback?", category: "Courage & Conviction" }
      ],
      executive: [
        { id: 1, question: "Describe how you've transformed a business unit or function during your career. What was your vision, how did you execute, and what measurable impact did you achieve?", category: "Transformation" },
        { id: 2, question: "Tell me about a time when you had to make a decision that would significantly impact the company's direction with incomplete data. Walk me through your thought process.", category: "Executive Decision Making" },
        { id: 3, question: "How have you built and maintained a high-performing leadership team? Give me a specific example of how you've developed executives.", category: "Leadership Development" },
        { id: 4, question: "Describe a situation where you had to navigate a complex stakeholder environment including board members, investors, or regulators. What was your approach?", category: "Stakeholder Management" },
        { id: 5, question: "Tell me about a time when you had to drive alignment across the organization on a contentious strategic decision. How did you build consensus?", category: "Organizational Alignment" }
      ]
    },
    technical: {
      entry: [
        { id: 1, question: "Walk me through a technical project you've worked on. What technologies did you use, and why did you choose them? What would you do differently if you could start over?", category: "Technical Foundation" },
        { id: 2, question: "Describe your approach to debugging a complex issue. Can you give me a specific example of a challenging bug you solved?", category: "Problem Solving" },
        { id: 3, question: "How do you stay current with new technologies and industry developments? Can you tell me about something new you've learned recently?", category: "Continuous Learning" },
        { id: 4, question: "Explain a technical concept you've worked with to me as if I were a non-technical stakeholder. How would you help them understand its importance?", category: "Communication" },
        { id: 5, question: "Tell me about a time when you had to write code that others would need to maintain. What principles guided your approach?", category: "Code Quality" }
      ],
      intermediate: [
        { id: 1, question: "Describe a system or feature you designed from scratch. Walk me through your architectural decisions and the trade-offs you considered.", category: "System Design" },
        { id: 2, question: "Tell me about a time when you had to significantly improve the performance of a system. What was your methodology, and what results did you achieve?", category: "Performance Optimization" },
        { id: 3, question: "How do you approach technical debt in your projects? Give me an example of how you've balanced new feature development with addressing existing issues.", category: "Technical Leadership" },
        { id: 4, question: "Describe a time when you had to make a technology choice that would have long-term implications for your team or organization. What factors did you consider?", category: "Technical Strategy" },
        { id: 5, question: "Tell me about your experience with code reviews. How do you give and receive feedback effectively?", category: "Collaboration" }
      ],
      senior: [
        { id: 1, question: "Walk me through how you would design a system to handle 10x your current scale. What are the key architectural considerations and potential bottlenecks?", category: "Scalability" },
        { id: 2, question: "Describe a time when you had to drive technical alignment across multiple teams with different priorities. How did you build consensus on the approach?", category: "Technical Leadership" },
        { id: 3, question: "Tell me about a significant technical decision that you later realized was wrong. What did you learn, and how do you make better decisions now?", category: "Technical Judgment" },
        { id: 4, question: "How do you evaluate and adopt new technologies for your organization? Walk me through your decision-making framework.", category: "Technology Strategy" },
        { id: 5, question: "Describe your approach to mentoring junior engineers. Give me a specific example of how you've helped someone grow their technical capabilities.", category: "Mentorship" }
      ],
      executive: [
        { id: 1, question: "How do you balance innovation and stability when setting technical direction for an organization? Give me an example of this trade-off from your experience.", category: "Technical Vision" },
        { id: 2, question: "Describe how you've built and scaled an engineering organization. What were the key challenges, and how did you address them?", category: "Organizational Building" },
        { id: 3, question: "Tell me about a time when you had to communicate technical constraints or risks to the board or C-suite. How did you frame the discussion?", category: "Executive Communication" },
        { id: 4, question: "How do you ensure technical excellence while also meeting business deadlines? Walk me through your approach to this tension.", category: "Business-Tech Alignment" },
        { id: 5, question: "Describe your vision for the future of technology in your industry. How are you positioning your organization to capitalize on these trends?", category: "Industry Vision" }
      ]
    },
    hr: {
      entry: [
        { id: 1, question: "Tell me about yourself and what brought you to apply for this role. What aspects of our company and this position excite you most?", category: "Motivation" },
        { id: 2, question: "Where do you see yourself professionally in 3-5 years? How does this role fit into your career aspirations?", category: "Career Planning" },
        { id: 3, question: "What does an ideal work environment look like for you? Describe the conditions where you do your best work.", category: "Culture Fit" },
        { id: 4, question: "What accomplishment are you most proud of, and why does it matter to you?", category: "Values" },
        { id: 5, question: "How do you handle situations where you disagree with a decision made by your manager or team? Give me an example.", category: "Professionalism" }
      ],
      intermediate: [
        { id: 1, question: "What factors are most important to you when evaluating career opportunities? How does this role align with those factors?", category: "Career Priorities" },
        { id: 2, question: "Describe your ideal relationship with your manager. What type of leadership style brings out your best work?", category: "Management Style" },
        { id: 3, question: "How do you maintain work-life balance while delivering excellent results? What boundaries do you set?", category: "Self-Management" },
        { id: 4, question: "Tell me about a time when your values were tested at work. How did you handle it?", category: "Integrity" },
        { id: 5, question: "What would your colleagues say are your greatest strengths and areas for development? How do their perceptions align with your own?", category: "Self-Awareness" }
      ],
      senior: [
        { id: 1, question: "At this stage of your career, what are you looking for in your next role that you don't have today?", category: "Career Motivation" },
        { id: 2, question: "How do you think about building and maintaining your professional reputation? What do you want to be known for?", category: "Personal Brand" },
        { id: 3, question: "Describe how you've evolved as a leader over your career. What experiences shaped who you are today?", category: "Leadership Journey" },
        { id: 4, question: "What aspects of our company culture appeal to you, and what concerns do you have? How would you contribute to our culture?", category: "Culture Contribution" },
        { id: 5, question: "How do you think about your legacy? What impact do you want to have in your next role?", category: "Impact & Legacy" }
      ],
      executive: [
        { id: 1, question: "What defines your leadership philosophy? How has it evolved throughout your career?", category: "Leadership Philosophy" },
        { id: 2, question: "How do you think about building organizational culture? Give me an example of how you've shaped culture in your previous roles.", category: "Culture Building" },
        { id: 3, question: "What's your approach to building trust with a new board and executive team? How long does it typically take?", category: "Relationship Building" },
        { id: 4, question: "How do you balance the demands of various stakeholders - employees, customers, shareholders, and the community?", category: "Stakeholder Balance" },
        { id: 5, question: "What would you want to accomplish in the first 100 days if you joined us? How would you approach learning our business?", category: "Transition Planning" }
      ]
    },
    "case-study": {
      entry: [
        { id: 1, question: "A key team member just resigned unexpectedly, leaving a critical project with no clear owner. How would you approach this situation?", category: "Problem Solving" },
        { id: 2, question: "You notice that a recurring process in your team is inefficient and causes delays. Walk me through how you would analyze and improve it.", category: "Process Improvement" },
        { id: 3, question: "Your manager asks you to present a recommendation to senior leadership next week on a topic you're not fully familiar with. How do you prepare?", category: "Executive Presence" },
        { id: 4, question: "You receive conflicting instructions from two senior stakeholders. How do you navigate this situation?", category: "Stakeholder Management" },
        { id: 5, question: "A customer is unhappy with a deliverable your team produced. How do you handle the situation while maintaining the relationship?", category: "Customer Relations" }
      ],
      intermediate: [
        { id: 1, question: "Your company is considering entering a new market segment. What framework would you use to evaluate this opportunity, and what data would you need?", category: "Market Analysis" },
        { id: 2, question: "You've been asked to cut your team's budget by 15% while maintaining current output. How would you approach this challenge?", category: "Resource Optimization" },
        { id: 3, question: "A competitor has just launched a product that directly threatens your core business. How would you recommend your company respond?", category: "Competitive Strategy" },
        { id: 4, question: "You're leading a cross-functional project where one team is consistently missing deadlines, affecting everyone else. How do you address this?", category: "Cross-functional Leadership" },
        { id: 5, question: "Your organization is planning a major system migration. What factors would you consider, and how would you structure the project?", category: "Project Planning" }
      ],
      senior: [
        { id: 1, question: "The board is considering acquiring a smaller competitor. What due diligence would you recommend, and what factors would determine if this is a good investment?", category: "M&A Strategy" },
        { id: 2, question: "Your company's market share has been declining for three consecutive quarters. How would you diagnose the problem and develop a turnaround strategy?", category: "Turnaround Strategy" },
        { id: 3, question: "You need to build a new capability in your organization that doesn't exist today. How would you approach this - build, buy, or partner?", category: "Capability Building" },
        { id: 4, question: "A major regulatory change is coming that will significantly impact your business model. How would you prepare the organization?", category: "Regulatory Strategy" },
        { id: 5, question: "You've been asked to present a 5-year strategic plan to the board. What elements would you include, and how would you structure your presentation?", category: "Strategic Planning" }
      ],
      executive: [
        { id: 1, question: "Your company needs to transform its business model to remain competitive. How would you approach this transformation while maintaining business continuity?", category: "Business Transformation" },
        { id: 2, question: "You're considering a major international expansion. What factors would you evaluate, and how would you structure the decision?", category: "Global Strategy" },
        { id: 3, question: "The company is facing a reputational crisis. How would you manage the situation while protecting long-term shareholder value?", category: "Crisis Management" },
        { id: 4, question: "You need to make a significant capital allocation decision between three competing initiatives. Walk me through your decision-making process.", category: "Capital Allocation" },
        { id: 5, question: "How would you approach integrating ESG considerations into your corporate strategy? What metrics would you track?", category: "ESG Strategy" }
      ]
    },
    management: {
      entry: [
        { id: 1, question: "How do you approach building relationships with new team members? What do you do in the first few weeks?", category: "Team Building" },
        { id: 2, question: "Describe how you would handle a situation where you need to give difficult feedback to a peer.", category: "Feedback" },
        { id: 3, question: "How do you prioritize your work when you have multiple competing deadlines? Walk me through your process.", category: "Prioritization" },
        { id: 4, question: "Tell me about a time when you helped a colleague succeed. What did you do, and what was the impact?", category: "Collaboration" },
        { id: 5, question: "How do you stay organized and ensure nothing falls through the cracks?", category: "Organization" }
      ],
      intermediate: [
        { id: 1, question: "How do you approach setting goals and measuring performance for your team? Give me a specific example.", category: "Performance Management" },
        { id: 2, question: "Describe your approach to delegation. How do you decide what to delegate and to whom?", category: "Delegation" },
        { id: 3, question: "How do you handle a situation where a team member is not meeting expectations despite coaching?", category: "Difficult Conversations" },
        { id: 4, question: "Tell me about a time when you had to motivate a team through a challenging period. What approaches did you use?", category: "Team Motivation" },
        { id: 5, question: "How do you balance getting your own work done with supporting your team's development?", category: "Prioritization" }
      ],
      senior: [
        { id: 1, question: "How do you build a high-performing team? What characteristics do you look for, and how do you develop team culture?", category: "Team Development" },
        { id: 2, question: "Describe your approach to succession planning. How do you identify and develop future leaders?", category: "Succession Planning" },
        { id: 3, question: "How do you handle situations where you need to let someone go? Walk me through your process and philosophy.", category: "Difficult Decisions" },
        { id: 4, question: "Tell me about a time when you had to realign your team's priorities based on changing business needs. How did you manage the transition?", category: "Change Management" },
        { id: 5, question: "How do you ensure your team stays connected to the broader organizational strategy and goals?", category: "Strategic Alignment" }
      ],
      executive: [
        { id: 1, question: "How do you build and maintain an executive team? What's your approach to hiring and developing leaders?", category: "Executive Team Building" },
        { id: 2, question: "Describe a time when you had to restructure an organization. What was your approach, and how did you manage the human impact?", category: "Organizational Design" },
        { id: 3, question: "How do you create accountability at scale while maintaining innovation and agility?", category: "Organizational Effectiveness" },
        { id: 4, question: "Tell me about how you've built a culture of high performance. What systems and practices have you put in place?", category: "Culture Building" },
        { id: 5, question: "How do you balance being accessible to your organization while maintaining strategic focus on the most important priorities?", category: "Executive Presence" }
      ]
    },
    general: {
      entry: [
        { id: 1, question: "Tell me about yourself and your professional journey. What experiences have shaped your career interests?", category: "Introduction" },
        { id: 2, question: "What do you know about our company, and why are you interested in this opportunity?", category: "Company Knowledge" },
        { id: 3, question: "Describe a challenging situation you've faced and how you overcame it. What did you learn from the experience?", category: "Problem Solving" },
        { id: 4, question: "What are your greatest strengths, and how would they contribute to success in this role?", category: "Self-Assessment" },
        { id: 5, question: "Where do you see opportunities for growth in your professional development?", category: "Growth Mindset" }
      ],
      intermediate: [
        { id: 1, question: "Walk me through your career progression. What decisions have you made, and what have you learned along the way?", category: "Career Journey" },
        { id: 2, question: "What's the most significant impact you've had in your current or most recent role? How did you measure success?", category: "Impact" },
        { id: 3, question: "Describe your ideal work environment and the type of culture where you thrive.", category: "Culture Fit" },
        { id: 4, question: "Tell me about a time when you had to quickly learn something new to succeed in your role. How did you approach it?", category: "Learning Agility" },
        { id: 5, question: "What questions do you have about our company, team, or this role?", category: "Engagement" }
      ],
      senior: [
        { id: 1, question: "At this stage of your career, what are you looking for in your next opportunity, and why does this role appeal to you?", category: "Career Motivation" },
        { id: 2, question: "What's the most significant leadership challenge you've faced, and how did you navigate it?", category: "Leadership" },
        { id: 3, question: "How do you stay current in your field and continue to grow professionally?", category: "Continuous Learning" },
        { id: 4, question: "Tell me about a time when you had to drive results through influence rather than authority.", category: "Influence" },
        { id: 5, question: "What do you believe sets exceptional leaders apart from good ones?", category: "Leadership Philosophy" }
      ],
      executive: [
        { id: 1, question: "What's your vision for this function/organization, and how would you approach the first 90 days?", category: "Vision" },
        { id: 2, question: "How do you think about building organizational capability for the future?", category: "Organization Building" },
        { id: 3, question: "What's the most difficult decision you've had to make as a leader? How did you approach it?", category: "Decision Making" },
        { id: 4, question: "How do you build trust and credibility with a board of directors and key stakeholders?", category: "Stakeholder Management" },
        { id: 5, question: "What legacy do you want to leave in your next role?", category: "Impact & Legacy" }
      ]
    }
  }

  const typeQuestions = questionBank[type] || questionBank.general
  const levelQuestions = typeQuestions[difficulty] || typeQuestions.intermediate
  
  return levelQuestions.slice(0, count).map((q, index) => ({ ...q, id: index + 1 }))
}
