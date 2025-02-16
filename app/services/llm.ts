import { headerRowParserPrompt } from './prompts';

interface Transaction {
  description: string;
  amount: number;
  date?: string;
}

export async function parseTransactionsWithLLM(text: string): Promise<Transaction[]> {
  try {
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