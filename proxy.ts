import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const session = await auth.api.getSession({ headers: await headers() })

    // console.log('Session data in middleware:', session?.user.visibility)

    const isAuthenticated = session?.user ? true : false

    const isAuthPath = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')

    const isProtectedPath = request.nextUrl.pathname.startsWith('/home')

    if (isAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL('/home', request.url))
    }

    if (!isProtectedPath) {
        return NextResponse.next()
    }

    if (isProtectedPath && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    runtime: 'nodejs',
    matcher: [
        '/home',
        '/login',
        '/signup',
    ]
}