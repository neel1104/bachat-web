import { generateText } from 'ai';
import { createOpenAI as createGroq} from '@ai-sdk/openai';
import { headerRowParserPrompt } from './prompts';

interface Transaction {
  description: string;
  amount: number;
  date?: string;
}

export async function parseTransactionsWithLLM(text: string): Promise<Transaction[]> {
  try {
    const groq = createGroq({
        baseURL: 'http://localhost:11434',
        // apiKey: process.env.GROQ_API_KEY,
      });
      
      const { text } = await generateText({
        model: groq('llama3.2'),
        prompt: 'What is love?',
      });
    const headerRow = text.split('\n')[0];
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        stream: false,
        messages: [
          {
            role: 'system',
            content: headerRowParserPrompt
          },
          {
            role: 'user',
            content: headerRow
          }
        ]
      }),
    });

    const data = await response.json();
    const parsedData = JSON.parse(data.message.content);
    console.log(parsedData);
    // Add date to each transaction
    return parsedData.map((t: Transaction) => ({
      ...t,
      date: new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error parsing with LLM:', error);
    throw new Error('Failed to parse transactions');
  }
} 