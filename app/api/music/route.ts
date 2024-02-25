import { replicate } from '../../../utils/replicate';
import { auth } from '../../../utils/clerk';
import { NextResponse } from 'next/server';
import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { prompt } = body;

    if (!userId) {
      return new NextResponse('UnAuthorized', { status: 401 });
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse('Free Trial has expired', { status: 403 });
    }

    // video generation model
    const output = await replicate.run(
      `meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38`,
      {
        input: {
          prompt,
        },
      }
    );

    await increaseApiLimit();

    return NextResponse.json(output);
  } catch (error) {
    console.log('[MUSIC_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
