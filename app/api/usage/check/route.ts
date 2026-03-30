import { NextRequest, NextResponse } from 'next/server';
import { getAnonymousUser } from '@/lib/utils/anonymous';
import { canUseService } from '@/db/index-prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();

    // If authenticated, use user ID
    if (session?.user?.id) {
      const result = await canUseService(session.user.id);
      return NextResponse.json(result);
    }

    // Otherwise, use anonymous ID
    const anonymousUser = getAnonymousUser();

    if (!anonymousUser.id) {
      return NextResponse.json({
        allowed: true,
        remaining: 3,
        plan: 'free_anonymous'
      });
    }

    const result = await canUseService(undefined, anonymousUser.id);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error checking usage:', error);
    return NextResponse.json(
      { error: 'Failed to check usage' },
      { status: 500 }
    );
  }
}
