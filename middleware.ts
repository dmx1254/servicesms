import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "fr",
});

export async function middleware(request: NextRequest) {
  // Vérifie si c'est une route protégée (profile)
    const isProtectedProfileRoute = /^\/(en|fr)\/dashboard/.test(
      request.nextUrl.pathname
    );

    if (isProtectedProfileRoute) {
      // Utilise getToken de next-auth pour vérifier l'authentification
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        // Redirige vers la page de connexion en préservant la locale
        const locale = request.nextUrl.pathname.split("/")[1] || "fr";
        const loginUrl = new URL(`/${locale}/signin`, request.url);
        // Ajoute l'URL de callback pour rediriger après la connexion
        loginUrl.searchParams.set("callbackUrl", request.url);
        return NextResponse.redirect(loginUrl);
      }

      if (token && request.nextUrl.pathname.includes("forgot-password")) {
        return NextResponse.redirect("/");
      }
    }

  // Applique le middleware i18n pour toutes les routes
  return I18nMiddleware(request);
}

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Matcher mis à jour pour inclure toutes les routes localisées et protégées
  matcher: [
    // Routes protégées
    "/(en|fr)/dashboard/:path*",
    // Routes i18n (exclut les fichiers statiques et les API)
    "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)",
    "/dashboard/:path*",
    // "/api/sms/:path*",
    // "/api/payments/:path*",
  ],
};
