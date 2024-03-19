// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
 redis: kv,
 // 5 requests from the same IP in 10 seconds
 limiter: Ratelimit.slidingWindow(5, '10 s'),
});

// Adjust the matcher to target specific API routes
export const config = {
 matcher: '/api/transcribe', // Adjust this to match your API routes
};

export default async function middleware(request: NextRequest) {
 const ip = request.ip ?? '127.0.0.1';
 const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);
 return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/blocked', request.url));
}
