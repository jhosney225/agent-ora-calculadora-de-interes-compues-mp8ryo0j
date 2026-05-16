import Anthropic from '@anthropic-ai/sdk';
import * as readline from 'readline';

const client = new Anthropic();
const conversationHistory = [];

const systemPrompt = `You are a financial advisor AI specialist in compound interest calculations for long-term investments. Your role is to:

1. Help users understand compound interest concepts
2. Calculate compound interest for their investments
3. Analyze different investment scenarios
4. Provide recommendations based on their financial goals

When a user asks about compound interest, you should:
- Ask clarifying questions if needed (principal amount, annual rate, compounding frequency, time period)
- Perform accurate calculations
- Explain the results in a clear, understandable way
- Suggest ways to maximize returns
- Discuss the impact of different compounding frequencies

For calculations, use the compound interest formula: A = P(1 + r/n)^(nt)
Where:
- A = Final amount
- P = Principal (initial investment)
- r = Annual interest rate (as a decimal)
- n = Number of times interest is compounded per year
- t = Time in years

Always provide detailed breakdowns and comparisons when relevant.`;

async function chat(userMessage) {
  conversationHistory.push({
    role: 'user',
    content: userMessage,
  });

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 8096,
    system: systemPrompt,
    messages: conversationHistory,
  });

  const assistantMessage = response.content[0].text;
  conversationHistory.push({
    role: 'assistant',
    content: assistantMessage,
  });

  return assistantMessage;
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('=== Compound Interest Calculator for Long-Term Investments ===');
  console.log('This calculator helps you understand and analyze compound interest.');
  console.log('Type "exit" to quit.\n');

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      const userInput = input.trim();

      if (userInput.toLowerCase() === 'exit') {
        console.log('Thank you for using the Compound Interest Calculator!');
        rl.close();
        return;
      }

      if (!userInput) {
        askQuestion();
        return;
      }

      try {
        const response = await chat(userInput);
        console.log(`\nAdvisor: ${response}\n`);
      } catch (error) {
        console.error('Error:', error.message);
      }

      askQuestion();
    });
  };

  // Start with an initial greeting
  try {
    const greeting = await chat(
      'Hello! I want to learn about compound interest and plan my long-term investments. Can you help me get started?'
    );
    console.log(`Advisor: ${greeting}\n`);
  } catch (error) {
    console.error('Error getting initial greeting:', error.message);
  }

  askQuestion();
}

main();