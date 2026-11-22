"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";

type Photo = SiteContent["photos"][number];
const nav = [
  { href: "#about", label: "ABOUT" }, { href: "#music", label: "MUSIC" },
  { href: "#video", label: "VIDEO" }, { href: "#photo", label: "PHOTO" },
  { href: "#portfolio", label: "PORTFOLIO" }, { href: "#contact", label: "CONTACT" },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}

function Label({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

export default function Site({ content }: { content: SiteContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [photoFilter, setPhotoFilter] = useState("ALL");
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(24);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const firstAudio = content.music.find(track => track.audio);
  const visiblePhotos = content.photos.map((photo, originalIndex) => ({ ...photo, originalIndex })).filter(photo => photoFilter === "ALL" || photo.category === photoFilter);

  useEffect(() => {
    document.body.style.overflow = activePhoto !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activePhoto]);

  useEffect(() => {
    if (activePhoto === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePhoto(null);
      if (e.key === "ArrowRight") setActivePhoto(v => v === null ? null : (v + 1) % content.photos.length);
      if (e.key === "ArrowLeft") setActivePhoto(v => v === null ? null : (v - 1 + content.photos.length) % content.photos.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activePhoto]);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try { await audio.play(); setPlaying(true); } catch { setPlaying(false); }
    } else { audio.pause(); setPlaying(false); }
  };

  const formatTime = (n: number) => `${Math.floor(n / 60).toString().padStart(2, "0")}:${Math.floor(n % 60).toString().padStart(2, "0")}`;
  const photo: Photo | null = activePhoto === null ? null : content.photos[activePhoto];

  return <>
    <header className="header">
      <a className="logo" href="#top" aria-label="DJ ESTRE — наверх">ESTRE<span className="logo-point">®</span></a>
      <nav className="desktop-nav" aria-label="Основная навигация">{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
      <a className="header-book" href="#contact">BOOK ME <Arrow diagonal /></a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen(x => !x)}>{menuOpen ? "CLOSE ×" : "MENU ☰"}</button>
    </header>
    {menuOpen && <nav className="mobile-menu" aria-label="Мобильная навигация">{nav.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label} <Arrow diagonal /></a>)}</nav>}

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb orb-1" aria-hidden="true" /><div className="hero-orb orb-2" aria-hidden="true" />
        <div className="hero-top"><span>INDEPENDENT DJ / EVENT SOUND</span><span>{content.location}</span></div>
        <div className="hero-center">
          <p className="eyebrow">SELECTED WORKS & MUSIC / 2026</p>
          <h1 id="hero-title">DJ <em>ESTRE</em><span className="hero-star">✳</span></h1>
          <p className="hero-sub">SOUND THAT<br />BECOMES A MEMORY.</p>
        </div>
        <div className="hero-bottom"><a className="round-link" href="#music" aria-label="К музыке">↓</a><span>SCROLL TO EXPLORE</span><a className="text-link" href="#contact">AVAILABLE FOR BOOKINGS <Arrow diagonal /></a></div>
      </section>

      <section className="statement-section" id="about">
        <Label index="01 / 06">THE ARTIST</Label>
        <div className="statement-layout"><div className="tiny-kicker">NOT JUST<br />A PLAYLIST.</div><div><h2 className="statement">I CREATE<br /><span>THE FEELING.</span></h2><div className="statement-copy"><p>{content.intro}</p><a href="#portfolio" className="underlink">МОЙ ОПЫТ <Arrow diagonal /></a></div></div></div>
        <div className="about-bottom"><span>THE RIGHT TRACK. THE RIGHT MOMENT.</span><span>ASTANA / WORLDWIDE</span></div>
      </section>

      <section className="music-section section-pad" id="music">
        <Label index="02 / 06">LISTEN / MUSIC</Label>
        <div className="section-heading"><h2>PRESS<br /><em>PLAY.</em></h2><p>Музыка — в центре всего.<br />Выбери настроение и почувствуй звук.</p></div>
        <div className="music-area">
          <div className="record-art" aria-hidden="true"><div className="record-ring"><div className="record-inner">ESTRE <span>33⅓</span></div></div><span className="record-caption">FREQUENCIES / EMOTIONS / ENERGY</span></div>
          <div className="track-list">
            {content.music.map((track, idx) => <div className="track" key={track.number}>
              <div className="track-number">{track.number}</div><div className="track-copy"><strong>{track.title}</strong><small>{track.category}{track.isDemo ? " · ДЕМО-ЗВУК" : ""}</small></div>
              <span className="track-length">{track.length}</span>
              {track.audio && track.audio === firstAudio?.audio ? <button className="track-action" onClick={toggleAudio} aria-label={playing ? "Пауза" : "Воспроизвести демо"}>{playing ? "Ⅱ" : "▶"}</button> : <a className="track-action" href={track.url || content.telegram} target="_blank" rel="noopener noreferrer" aria-label={`Открыть ${track.title}`}><Arrow diagonal /></a>}
            </div>)}
            <div className="player-progress"><span>{formatTime(currentTime)}</span><input aria-label="Позиция воспроизведения демо" type="range" min="0" max={duration || 24} value={Math.min(currentTime, duration || 24)} onChange={e => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} /><span>{formatTime(duration)}</span></div>
            <audio ref={audioRef} src={firstAudio?.audio || ""} preload="metadata" onLoadedMetadata={e => setDuration(e.currentTarget.duration || 24)} onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)} onEnded={() => setPlaying(false)} />
            <p className="small-note">Добавляй новые миксы через Sanity Studio.</p>
            <a className="pill-button" href={content.telegram} target="_blank" rel="noopener noreferrer">ВСЕ МИКСЫ В TELEGRAM <Arrow diagonal /></a>
          </div>
        </div>
      </section>

      <section className="video-section section-pad" id="video">
        <Label index="03 / 06">WATCH / VIDEO</Label>
        <div className="section-heading"><h2>ON THE<br /><em>MOVE.</em></h2><p>Моменты, которые невозможно передать словами. Выступления, события, энергия зала.</p></div>
        <a className="video-feature" href={content.videoArchive} target="_blank" rel="noopener noreferrer" aria-label="Открыть видеоархив DJ ESTRE"><div className="video-graphic"><div className="video-bars" aria-hidden="true">{Array.from({ length: 29 }, (_, i) => <i key={i} style={{ height: `${14 + ((i * 37 + 23) % 79)}%` }} />)}</div><span className="video-oversize">LIVE</span></div><div className="video-play">↗</div><div className="video-feature-bottom"><div><strong>SELECTED PERFORMANCES</strong><span>ВИДЕОПОРТФОЛИО / GOOGLE DRIVE</span></div><span>EXPLORE VIDEOS <Arrow diagonal /></span></div></a>
        {content.videos?.length ? <div className="cms-videos">{content.videos.map((v, i) => <a key={`${v.url}-${i}`} className="cms-video-card" href={v.url} target="_blank" rel="noopener noreferrer"><span className="cms-video-index">{String(i+1).padStart(2,"0")}</span><strong>{v.title}</strong><span>WATCH ↗</span></a>)}</div> : null}
        <div className="video-footnote"><span>01 / SHOWREEL</span><span>02 / CORPORATE EVENTS</span><span>03 / LIVE MOMENTS</span></div>
      </section>

      <section className="photo-section section-pad" id="photo">
        <Label index="04 / 06">VIEW / PHOTO</Label>
        <div className="section-heading"><h2>IN THE<br /><em>FRAME.</em></h2><p>Каждый сет — своя история.<br />Каждый кадр — момент.</p></div>
        <div className="filter-row" role="group" aria-label="Фильтр фотогалереи">{["ALL", "EVENTS", "BACKSTAGE", "DETAILS"].map(filter => <button key={filter} className={filter === photoFilter ? "selected" : ""} onClick={() => setPhotoFilter(filter)}>{filter}</button>)}</div>
        <div className="photo-grid">{visiblePhotos.map((item, i) => <button className={`photo-tile photo-tile-${i % 6}`} key={item.src} onClick={() => setActivePhoto(item.originalIndex)} aria-label={`Открыть ${item.name}`}><img src={item.src} alt={item.alt} loading="lazy"/><span className="photo-overlay"><span>{item.category} / {item.name}</span><b>↗</b></span></button>)}</div>
        <p className="small-note">Фотографии и категории редактируются через Sanity Studio.</p>
      </section>

      <section className="portfolio-section section-pad" id="portfolio">
        <Label index="05 / 06">EXPERIENCE / PORTFOLIO</Label>
        <div className="section-heading"><h2>BUILT ON<br /><em>EXPERIENCE.</em></h2><p>Сцена, практика, соревнования и проекты, за которыми стоят реальные эмоции.</p></div>
        <div className="achievements">{content.achievements.map((item, i) => <div className="achievement" key={item.title}><span className="achievement-index">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div><span className="achievement-year">{item.year}</span></div>)}</div>
        <div className="client-zone"><div className="client-label">SELECTED CLIENTS / ЗАКАЗЧИКИ</div><div className="client-list">{content.clients.map(client => <div key={client}>{client}</div>)}</div><p className="small-note">Текстовые названия клиентов; логотипы можно добавить после согласования материалов.</p></div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <Label index="06 / 06">LET'S CONNECT</Label>
        <div className="contact-body"><p className="contact-pre">GOT AN EVENT IN MIND?</p><h2>LET'S MAKE<br /><em>IT LOUD.</em></h2><p className="contact-copy">Корпоратив, частная вечеринка или особенное событие — напиши, обсудим идею и музыкальный формат.</p><div className="contact-actions"><a href={content.telegram} target="_blank" rel="noopener noreferrer" className="contact-primary">НАПИСАТЬ В TELEGRAM <Arrow diagonal /></a>{content.whatsapp && <a href={content.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-secondary">WHATSAPP <Arrow diagonal /></a>}{content.email && <a href={`mailto:${content.email}`} className="contact-secondary">EMAIL <Arrow diagonal /></a>}</div></div>
        <footer><a href="#top" className="footer-logo">ESTRE®</a><span>© {new Date().getFullYear()} DJ ESTRE</span><span>ASTANA · KAZAKHSTAN</span><a href="#top">BACK TO TOP ↑</a></footer>
      </section>
    </main>

    {photo && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={() => setActivePhoto(null)}><button className="lightbox-close" aria-label="Закрыть" onClick={() => setActivePhoto(null)}>CLOSE ×</button><button className="lightbox-prev" aria-label="Предыдущее фото" onClick={e => { e.stopPropagation(); setActivePhoto(v => v === null ? null : (v - 1 + content.photos.length) % content.photos.length); }}>←</button><img src={photo.src} alt={photo.alt} onClick={e => e.stopPropagation()}/><button className="lightbox-next" aria-label="Следующее фото" onClick={e => { e.stopPropagation(); setActivePhoto(v => v === null ? null : (v + 1) % content.photos.length); }}>→</button><div className="lightbox-meta">{photo.name} / {(activePhoto ?? 0) + 1} OF {content.photos.length}</div></div>}
  </>;
}
