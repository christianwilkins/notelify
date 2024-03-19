// pages/_middleware/api.ts
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
 redis: kv,
 limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export const config = {
 matcher: '/API/*', // This matches all routes under /api
};

export default async function middleware(request: NextRequest) {
 const ip = request.ip ?? '127.0.0.1';
 const { success } = await ratelimit.limit(ip);
 return success ? NextResponse.next() : NextResponse.redirect(new URL('/blocked', request.url));
}
