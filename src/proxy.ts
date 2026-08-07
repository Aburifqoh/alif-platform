import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/portal", "/hostel/portal", "/admin", "/executive"];

// Routes only for admins
const ADMIN_ROUTES = ["/admin"];

// Routes that require specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  "/executive": ["executive", "admin", "super_admin"],
  "/admin": ["admin", "super_admin"],
  "/portal/hostel": ["hostel_resident", "hostel_manager", "admin", "super_admin"],
  "/portal/teacher": ["teacher", "admin", "super_admin"],
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Check if route requires auth
  const requiresAuth = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (requiresAuth && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and trying to access auth pages, redirect to portal
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
