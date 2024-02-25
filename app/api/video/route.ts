import { auth } from '../../../utils/clerk';
import { replicate } from '../../../utils/replicate';
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

    const output = await replicate.run(
      `anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351`,
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
