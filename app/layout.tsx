import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DJ ESTRE — Music / Events / Experience",
  description: "DJ ESTRE — event DJ. Музыкальные сеты, выступления, видео, фотогалерея и бронирование для корпоративных и частных мероприятий.",
  openGraph: {
    title: "DJ ESTRE — Music / Events / Experience",
    description: "Музыка, которая задаёт атмосферу. DJ ESTRE — портфолио, музыка, видео и контакты.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
