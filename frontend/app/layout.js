import "./globals.css";
import { Bagel_Fat_One, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import ConditionalShell from "@/components/ConditionalShell";

const bagelFatOne = Bagel_Fat_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--mono",
  display: "swap",
});

export const metadata = {
  title: "HOOKLINE — Lyrics Marketplace",
  description: "a marketplace for hooks, hurts and the occasional banger. made by writers, for writers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bagelFatOne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
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
