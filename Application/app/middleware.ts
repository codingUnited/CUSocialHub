import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/polls")) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/polls", req.url));
}

export const config = {
    matcher: [
        "/((?!_next|favicon.ico|.*\\..*|api).*)"
    ]
};




// middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // The specific route you want to redirect everyone TO
//   const targetRoute = '/maintenance';

//   // 1. SAFETY CHECK: If they are already on the target page, let them through
//   if (pathname === targetRoute) {
//     return NextResponse.next();
//   }

//   // 2. TARGET CHECK: If the path is exactly /polls or starts with /polls/
//   if (pathname === '/polls' || pathname.startsWith('/polls/')) {
//     return NextResponse.redirect(new URL(targetRoute, request.url));
//   }

//   // Fallback: Let all other non-matched site traffic pass through normally
//   return NextResponse.next();
// }

// export const config = {
//   // 3. MATCHER: Only invoke this middleware for /polls and any nested routes underneath it
//   // The :path* syntax captures zero or more sub-paths (e.g., /polls, /polls/abc, /polls/abc/edit)
//   matcher: [
//     '/polls/:path*'
//   ],
// };