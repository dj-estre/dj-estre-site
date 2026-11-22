/** Меняйте тексты и ссылки здесь, не затрагивая дизайн. */
export const content = {
  brand: "DJ ESTRE",
  location: "ASTANA · KAZAKHSTAN",
  tagline: "Музыка — это то, что остаётся после события.",
  intro: "DJ ESTRE — диджей для событий, в которых важны настроение, энергия и внимание к деталям. От атмосферного welcome до танцпола, который не хочется покидать.",
  email: "", // Вставьте публичный email для бронирований, например booking@example.com
  telegram: "https://t.me/deejayestre",
  whatsapp: "", // Вставьте ссылку https://wa.me/7XXXXXXXXXX
  videoArchive: "https://drive.google.com/drive/folders/1_rquLJ3-WH7i3XE8CNp--v2_BCOMgHDE?usp=sharing",
  // Замените эти заглушки названиями и ссылками на реальные миксы.
  music: [
    { number: "01", title: "ESTRE / SELECTED SOUNDS", category: "DJ MIX / PREVIEW", length: "00:24", audio: "/media/estre-demo-loop.wav", isDemo: true },
    { number: "02", title: "LIVE SETS", category: "MIX ARCHIVE", length: "TELEGRAM", url: "https://t.me/deejayestre", isDemo: false },
    { number: "03", title: "NEW DROPS", category: "UPDATES", length: "TELEGRAM", url: "https://t.me/deejayestre", isDemo: false },
  ],
  achievements: [
    { year: "2024—2026", title: "DAEB COMM.", detail: "Финалист DJ-баттла · победитель отборочных этапов в Астане" },
    { year: "2026", title: "ELEVATION", detail: "Финалист DJ-конкурса" },
    { year: "2026", title: "DMC KAZAKHSTAN", detail: "Участник чемпионата" },
  ],
  clients: ["EUROPEAN UNION", "COVENTRY UNIVERSITY", "CARDIFF UNIVERSITY"],
  photos: [
    { src: "/photos/editorial-01.svg", alt: "Демонстрационная обложка — заменить фото с выступления", category: "EVENTS", name: "LIVE ENERGY" },
    { src: "/photos/editorial-02.svg", alt: "Демонстрационная обложка — заменить фотографией", category: "BACKSTAGE", name: "BEHIND THE SET" },
    { src: "/photos/editorial-03.svg", alt: "Демонстрационная обложка — заменить фотографией", category: "EVENTS", name: "NIGHT MOVES" },
    { src: "/photos/editorial-04.svg", alt: "Демонстрационная обложка — заменить фотографией", category: "DETAILS", name: "THE MOMENT" },
    { src: "/photos/editorial-05.svg", alt: "Демонстрационная обложка — заменить фотографией", category: "BACKSTAGE", name: "ON THE DECKS" },
    { src: "/photos/editorial-06.svg", alt: "Демонстрационная обложка — заменить фотографией", category: "DETAILS", name: "AFTER DARK" },
  ],
};

export type SiteContent = typeof content & { videos?: Array<{title: string; url: string}> };
