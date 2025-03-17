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

  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error?.message || 'Failed to process the request' },
      { status: 500 }
    );
  }
}
