// middleware.ts
import { type NextRequest, NextResponse } from 'next/server'

// We remove the 'export const config' block completely

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get('host')!
  const pathname = url.pathname

  // --- START: NEW LOGIC TO IGNORE STATIC FILES/API ROUTES ---
  // If the path matches these patterns, we do nothing.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }
  // --- END: NEW LOGIC ---

  const mainDomain = process.env.NODE_ENV === 'production' 
    ? 'my-saas-theta.vercel.app' // Your Vercel domain
    : 'localhost:3000'

  if (hostname === mainDomain) {
    return NextResponse.next()
  }

  const subdomain = hostname.replace(`.${mainDomain}`, '')
  url.pathname = `/domain/${subdomain}`
  
  return NextResponse.rewrite(url)
}