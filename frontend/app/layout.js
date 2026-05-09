import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import ConditionalShell from "@/components/ConditionalShell";

export const metadata = {
  title: "HOOKLINE — Lyrics Marketplace",
  description: "a marketplace for hooks, hurts and the occasional banger. made by writers, for writers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ConditionalShell>
              {children}
            </ConditionalShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
