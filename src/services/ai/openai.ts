import { OPENAI_API_URL } from '@/constants';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: {
    message: ChatMessage;
    finish_reason: string;
  }[];
}

export const openAIService = {
  async chat(
    apiKey: string,
    messages: ChatMessage[],
    model: string = 'gpt-4o-mini'
  ): Promise<string> {
    const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  },

  async generateWorkoutPlan(
    apiKey: string,
    preferences: {
      direction: string;
      experience: string;
      daysPerWeek: number;
      goals: string[];
      equipment?: string[];
    }
  ): Promise<string> {
    const systemPrompt = `You are a professional fitness coach. Generate a personalized workout plan based on the user's preferences.
    Provide the plan in a structured JSON format that includes:
    - Weekly schedule
    - Exercises with sets, reps, and rest times
    - Progression suggestions
    Be specific and practical.`;

    const userPrompt = `Create a workout plan for me with these preferences:
    - Training direction: ${preferences.direction}
    - Experience level: ${preferences.experience}
    - Days per week: ${preferences.daysPerWeek}
    - Goals: ${preferences.goals.join(', ')}
    ${preferences.equipment ? `- Available equipment: ${preferences.equipment.join(', ')}` : ''}`;

    return this.chat(apiKey, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
  },

  async suggestExercise(
    apiKey: string,
    muscleGroup: string,
    equipment: string[],
    currentExercises: string[]
  ): Promise<string> {
    const systemPrompt = `You are a fitness expert. Suggest exercises based on the target muscle group and available equipment.
    Avoid suggesting exercises already in the workout.
    Respond with a JSON array of exercise suggestions with name, description, and difficulty.`;

    const userPrompt = `Suggest 3 exercises for ${muscleGroup}.
    Equipment available: ${equipment.join(', ')}
    Already doing: ${currentExercises.join(', ')}`;

    return this.chat(apiKey, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
  },

  async importChatGPTThread(
    apiKey: string,
    threadId: string
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
      const response = await fetch(`${OPENAI_API_URL}/threads/${threadId}/messages`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error?.message || 'Failed to fetch thread' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
};
