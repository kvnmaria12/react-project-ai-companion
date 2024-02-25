import { auth } from '../utils/clerk';
import { prismadb } from '@/lib/prismadb';
import { MAX_FREE_COUNTS } from '@/constants';

export const increaseApiLimit = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      return;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId,
      },
    });

    if (userApiLimit) {
      await prismadb.userApiLimit.update({
        where: {
          userId: userId,
        },
        data: { count: userApiLimit.count + 1 },
      });
    } else {
      await prismadb.userApiLimit.create({
        data: { userId: userId, count: 1 },
      });
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const checkApiLimit = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      return false;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getApiLimitCount = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      return 0;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userApiLimit) {
      return 0;
    }

    return userApiLimit.count;
  } catch (error: any) {
    throw new Error(error);
  }
};
