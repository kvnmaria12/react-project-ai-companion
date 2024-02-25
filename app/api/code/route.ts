import { auth } from '../../../utils/clerk';
import { openai } from '../../../utils/apiConfig';
import { NextResponse } from 'next/server';
import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

const instructionMessage = {
  role: 'system',
  content:
    'You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.',
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { messages } = body;

    if (!userId) {
      return new NextResponse('UnAuthorized', { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse('OpenAI API Key not configured', { status: 500 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse('Free Trial has expired', { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [instructionMessage, ...messages],
    });

    await increaseApiLimit();

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log('[CONVERSATIONAL_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
