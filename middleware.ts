import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "fr",
});

export async function middleware(request: NextRequest) {
  // Récupère le token pour toutes les routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const locale = request.nextUrl.pathname.split("/")[1] || "fr";
  
  // Vérifie si c'est la page d'accueil
  const isHomePage = /^\/(en|fr)?$/.test(request.nextUrl.pathname);
  
  // Vérifie si c'est une route d'authentification (signin, signup, forgot-password)
  const isAuthRoute = /^\/(en|fr)\/(signin|signup|forgot-password)/.test(
    request.nextUrl.pathname
  );

  // Vérifie si c'est une route protégée (dashboard)
  const isProtectedRoute = /^\/(en|fr)\/dashboard/.test(
    request.nextUrl.pathname
  );

  // Si l'utilisateur est connecté et essaie d'accéder à la page d'accueil ou une route d'authentification
  if (token && (isHomePage || isAuthRoute)) {
    // Redirige vers le dashboard en préservant la locale
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!token && isProtectedRoute) {
    // Redirige vers la page de connexion en préservant la locale
    const loginUrl = new URL(`/${locale}/signin`, request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Applique le middleware i18n pour toutes les routes
  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    // Routes protégées
    "/(en|fr)/dashboard/:path*",
    // Routes d'authentification et page d'accueil
    "/(en|fr)/(signin|signup|forgot-password)",
    "/(en|fr)?",
    // Routes i18n (exclut les fichiers statiques et les API)
    "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)",
    "/dashboard/:path*",
  ],
};
