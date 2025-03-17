import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const apiKey = process.env.AZURE_OPENAI_API_KEY!;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!;
    const apiVersion = "2023-12-01-preview"; // Use stable API version

    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

    const response = await axios.post(
      url,
      {
        model: deploymentName,
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        }
      }
    );

    return NextResponse.json({
      message: response.data.choices[0].message.content || 'No response generated.'
    });

  } catch (error: unknown) {
  let errorMessage = 'Failed to process the request';

  if (error instanceof Error) {
    errorMessage = error.message;
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const apiError = error as { response?: { data?: { error?: { message: string } } } };
      errorMessage = apiError.response?.data?.error?.message || errorMessage;
    }
  }

  console.error('Error:', errorMessage);
  return NextResponse.json(
    { error: errorMessage },
    { status: 500 }
  );
}
}
