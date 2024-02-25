import { NextResponse } from 'next/server';
import { openai } from '../../../utils/apiConfig';
import { auth } from '../../../utils/clerk';
import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { prompt, amount = 1, resolution = '512x512' } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse('OpenAI API Key not configured.', {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    if (!amount) {
      return new NextResponse('Amount is required', { status: 400 });
    }

    if (!resolution) {
      return new NextResponse('Resolution is required', { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse('Free Trial has expired', { status: 403 });
    }

    // openai config for image generation
    const image = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    await increaseApiLimit();

    // response data
    return NextResponse.json(image.data);
  } catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
