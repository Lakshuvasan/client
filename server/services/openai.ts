import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-test-key"
});

export interface CertificationRecommendation {
  id: number;
  relevanceScore: number;
  reasoning: string;
}

export interface ChatResponse {
  message: string;
  recommendations: CertificationRecommendation[];
  category?: string;
}

export async function generateChatResponse(
  userMessage: string,
  availableCertifications: any[],
  chatHistory: any[] = []
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are CERTI-BOT, an intelligent certification assistant. Your role is to help users find the perfect certification programs based on their interests, skills, and career goals.

IMPORTANT GUIDELINES:
1. Provide helpful, accurate, and personalized certification recommendations
2. Always be encouraging and supportive
3. Ask follow-up questions when needed to better understand user needs
4. Focus on practical advice about prep time, costs, and career benefits
5. Consider user's experience level (beginner, intermediate, advanced)
6. Recommend 2-4 most relevant certifications per response
7. Provide specific reasoning for each recommendation

AVAILABLE CERTIFICATIONS:
${JSON.stringify(availableCertifications, null, 2)}

RESPONSE FORMAT:
Respond with JSON in this exact format:
{
  "message": "Your helpful response message here",
  "recommendations": [
    {
      "id": certification_id_number,
      "relevanceScore": score_from_1_to_10,
      "reasoning": "Why this certification is recommended"
    }
  ],
  "category": "relevant_category_if_applicable"
}

CHAT HISTORY:
${chatHistory.map(msg => `${msg.sender}: ${msg.content}`).join('\n')}

Current user message: "${userMessage}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      message: result.message || "I'd be happy to help you find the right certification programs!",
      recommendations: result.recommendations || [],
      category: result.category
    };

  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback response if OpenAI fails
    return {
      message: "I'm having trouble connecting right now, but I'd love to help you find the perfect certification! Could you tell me more about your interests or the field you'd like to explore?",
      recommendations: [],
    };
  }
}

export async function generateWelcomeMessage(): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are CERTI-BOT, a friendly certification assistant. Generate a brief, welcoming message for new users. Keep it under 50 words and encouraging."
        },
        {
          role: "user",
          content: "Generate a welcome message"
        }
      ],
      temperature: 0.8,
      max_tokens: 100
    });

    return response.choices[0].message.content || "Welcome to CERTI-BOT! I'm here to help you discover the perfect certification programs for your career goals.";
  } catch (error) {
    return "Welcome to CERTI-BOT! I'm here to help you discover the perfect certification programs for your career goals.";
  }
}
