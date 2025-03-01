import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	const session = await auth();
	const url = new URL("/", req.url);

	// Check for admin route
	if (isAdminRoute(req)) {
		if (session.sessionClaims?.metadata?.role !== "admin") {
			return NextResponse.redirect(url);
		}
	}

	// Check for protected route
	if (isProtectedRoute(req)) {
		await auth.protect();
	}

	// Add the pathname to the headers for use in the layout
	const response = NextResponse.next();
	response.headers.set("x-pathname", req.nextUrl.pathname);
	return response;
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};