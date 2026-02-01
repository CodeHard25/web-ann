import type { Metadata } from "next";
import { Cinzel_Decorative, Fredoka, Inter, Playfair_Display } from "next/font/google";
import { PageTransition } from "@/components/effects/page-transition";
import { SceneFrame } from "@/components/effects/scene-frame";
import { SoundProvider } from "@/components/effects/sound-provider";
import { AnniversaryTimer } from "@/components/effects/anniversary-timer";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
});

const cinzel = Cinzel_Decorative({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-hero",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anniversary Storybook",
  description: "A cinematic, kawaii-pastel interactive anniversary experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${fredoka.variable} ${cinzel.variable} ${playfair.variable} text-ink antialiased`}
      >
        <SoundProvider>
          <PageTransition>
            <SceneFrame>{children}</SceneFrame>
          </PageTransition>
          <AnniversaryTimer />
        </SoundProvider>
      </body>
    </html>
  );
}
