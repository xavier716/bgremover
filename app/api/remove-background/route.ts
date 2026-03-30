import { NextRequest, NextResponse } from 'next/server';
import { canUseService, incrementUsage, logUsage } from '@/db/index-prisma';
import { getAnonymousUser } from '@/lib/utils/anonymous';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Check usage limit
    const session = await auth();
    const userId = session?.user?.id;
    let anonymousId: string | undefined;

    if (!userId) {
      const anonymousUser = getAnonymousUser();
      anonymousId = anonymousUser.id || undefined;
    }

    const usageCheck = await canUseService(userId || undefined, anonymousId);

    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Usage limit exceeded',
          remaining: usageCheck.remaining,
          plan: usageCheck.plan,
          requiresAuth: !userId && anonymousId && usageCheck.remaining === 0
        },
        { status: 403 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.REMOVEBG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Remove.bg API key not configured' },
        { status: 500 }
      );
    }

    // Convert file to blob for Remove.bg API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call Remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', new Blob([buffer]), file.name);
    removeBgFormData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', errorText);

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      } else if (response.status === 402) {
        return NextResponse.json(
          { error: 'Insufficient API credits' },
          { status: 402 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to remove background' },
        { status: response.status }
      );
    }

    // Get the processed image
    const processedBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(processedBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Increment usage count
    await incrementUsage(userId || undefined, anonymousId);

    // Log usage
    await logUsage(userId || undefined, anonymousId, 'success', file.size);

    return NextResponse.json({
      success: true,
      image: dataUrl,
      remaining: usageCheck.remaining - 1
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
