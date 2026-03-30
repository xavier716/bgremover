import { NextRequest, NextResponse } from 'next/server';
import { getAnonymousUser } from '@/lib/utils/anonymous';
import { canUseService as checkCanUseService, getUsageData } from '@/lib/utils/usage';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    const anonymousUser = getAnonymousUser();

    // If authenticated, use user ID and also pass anonymous ID to preserve usage
    if (session?.user?.id) {
      const result = checkCanUseService(session.user.id, anonymousUser.id);
      return NextResponse.json({
        ...result,
        userId: session.user.id,
        anonymousId: anonymousUser.id
      });
    }

    // Otherwise, use anonymous ID only
    if (!anonymousUser.id) {
      return NextResponse.json({
        allowed: true,
        remaining: 3,
        plan: 'free_anonymous'
      });
    }

    const result = checkCanUseService(undefined, anonymousUser.id);
    return NextResponse.json({
      ...result,
      anonymousId: anonymousUser.id
    });

  } catch (error) {
    console.error('Error checking usage:', error);
    return NextResponse.json(
      { error: 'Failed to check usage' },
      { status: 500 }
    );
  }
}
