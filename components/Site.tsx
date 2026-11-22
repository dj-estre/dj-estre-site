"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";

type Photo = SiteContent["photos"][number];
const defaultNav: {
  href: string;
  label: string;
  visible?: boolean;
}[] = [
  { href: "#about", label: "ABOUT" },
  { href: "#music", label: "MUSIC" },
  { href: "#video", label: "VIDEO" },
  { href: "#photo", label: "PHOTO" },
  { href: "#portfolio", label: "PORTFOLIO" },
  { href: "#contact", label: "CONTACT" },
];

function videoPlayerSource(raw?: string): {kind:"iframe"|"file";src:string} | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return null;
    const host = u.hostname.toLowerCase();
    if (host === "youtu.be") {
      const id = u.pathname.split("/")[1];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? {kind:"iframe",src:`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} : null;
    }
    if (["youtube.com","www.youtube.com","m.youtube.com","www.youtube-nocookie.com"].includes(host)) {
      const id = u.searchParams.get("v") || u.pathname.match(/\/(?:shorts|embed|live)\/([a-zA-Z0-9_-]{11})/)?.[1];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? {kind:"iframe",src:`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} : null;
    }
    if (["vimeo.com","www.vimeo.com","player.vimeo.com"].includes(host)) {
      const id = u.pathname.match(/\/(?:video\/)?(\d+)/)?.[1];
      return id ? {kind:"iframe",src:`https://player.vimeo.com/video/${id}?autoplay=1`} : null;
    }
    if (host === "drive.google.com") {
      const id = u.pathname.match(/\/file\/d\/([A-Za-z0-9_-]+)/)?.[1];
      return id ? {kind:"iframe",src:`https://drive.google.com/file/d/${id}/preview`} : null;
    }
    if (/\.(mp4|webm)(?:$|\?)/i.test(u.pathname + u.search)) return {kind:"file",src:raw};
  } catch {}
  return null;
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}
const nav = (
  content.navigation?.length
    ? content.navigation
    : defaultNav
).filter(item => item.visible !== false);

function Label({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

export default function Site({ content }: { content: SiteContent }) {
  const nav = (content.navigation?.length ? content.navigation : defaultNav).filter(item => !("visible" in item) || item.visible !== false)
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<NonNullable<SiteContent["videos"]>[number] | null>(null);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [photoFilter, setPhotoFilter] = useState("ALL");
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(24);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const firstAudio = content.music.find(track => track.audio);
  const featuredVideo = content.videos?.find(v => v.featured) || content.videos?.[0];
  const videoSource = activeVideo ? videoPlayerSource(activeVideo.videoFile || activeVideo.url) : null;
  const visiblePhotos = content.photos.map((photo, originalIndex) => ({ ...photo, originalIndex })).filter(photo => photoFilter === "ALL" || photo.category === photoFilter);

  useEffect(() => {
    document.body.style.overflow = (activePhoto !== null || activeVideo !== null) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activePhoto, activeVideo]);

  useEffect(() => {
    if (activePhoto === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setActivePhoto(null); setActiveVideo(null); }
      if (e.key === "ArrowRight") setActivePhoto(v => v === null ? null : (v + 1) % content.photos.length);
      if (e.key === "ArrowLeft") setActivePhoto(v => v === null ? null : (v - 1 + content.photos.length) % content.photos.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activePhoto]);

  useEffect(() => {
    if (!activeVideo) return;
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveVideo(null); };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [activeVideo]);

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
      <a className="logo" href="#top" aria-label="DJ ESTRE — наверх">{content.brand.replace(/^DJ\s*/i, "")}<span className="logo-point">®</span></a>
      <nav className="desktop-nav" aria-label="Основная навигация">{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
      <a className="header-book" href="#contact">{content.headerBookingText} <Arrow diagonal /></a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen(x => !x)}>{menuOpen ? "CLOSE ×" : "MENU ☰"}</button>
    </header>
    {menuOpen && <nav className="mobile-menu" aria-label="Мобильная навигация">{nav.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label} <Arrow diagonal /></a>)}</nav>}

    <main id="top">
      <section className="hero" aria-labelledby="hero-title" style={content.heroImage ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,${(content.heroDim ?? 60)/100}),rgba(0,0,0,${(content.heroDim ?? 60)/100})),url("${content.heroImage}")`,
        backgroundPosition: "center", backgroundSize: "cover"
      } : undefined}>
        <div className="hero-grid" aria-hidden="true" />
        {!content.heroImage && <><div className="hero-orb orb-1" aria-hidden="true" /><div className="hero-orb orb-2" aria-hidden="true" /></>}
        <div className="hero-top"><span>{content.heroTopline}</span><span>{content.location}</span></div>
        <div className="hero-center">
          <p className="eyebrow">{content.heroEyebrow}</p>
          <h1 id="hero-title">{content.heroTitleFirst} <em>{content.heroTitleAccent}</em><span className="hero-star">✳</span></h1>
          <p className="hero-sub multiline">{content.heroSubline}</p>
        </div>
        <div className="hero-bottom"><a className="round-link" href="#music" aria-label="К музыке">↓</a><span>{content.heroScrollText}</span><a className="text-link" href="#contact">{content.heroBookingText} <Arrow diagonal /></a></div>
      </section>

      <section className="statement-section" id="about">
        <Label index="01 / 06">{content.aboutSectionLabel}</Label>
        <div className="statement-layout"><div className="tiny-kicker multiline">{content.aboutKicker}</div><div><h2 className="statement">{content.aboutTitleFirst}<br /><span>{content.aboutTitleAccent}</span></h2><div className="statement-copy"><p>{content.intro}</p><a href="#portfolio" className="underlink">{content.aboutLinkText} <Arrow diagonal /></a></div></div></div>
        <div className="about-bottom"><span>{content.aboutFooterLeft}</span><span>{content.aboutFooterRight}</span></div>
      </section>

      <section className="music-section section-pad" id="music">
        <Label index="02 / 06">{content.musicSectionLabel}</Label>
        <div className="section-heading"><h2>{content.musicTitleFirst}<br /><em>{content.musicTitleAccent}</em></h2><p className="multiline">{content.musicDescription}</p></div>
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
            <a className="pill-button" href={content.telegram} target="_blank" rel="noopener noreferrer">{content.musicArchiveButton} <Arrow diagonal /></a>
          </div>
        </div>
      </section>

      <section className="video-section section-pad" id="video">
        <Label index="03 / 06">{content.videoSectionLabel}</Label>
        <div className="section-heading"><h2>{content.videoTitleFirst}<br /><em>{content.videoTitleAccent}</em></h2><p className="multiline">{content.videoDescription}</p></div>
        {featuredVideo ? (
          <button className="video-feature video-feature-button" onClick={() => setActiveVideo(featuredVideo)} aria-label={`Смотреть ${featuredVideo.title}`}>
            {featuredVideo.poster ? <img className="video-feature-poster" src={featuredVideo.poster} alt="" /> : <div className="video-graphic"><div className="video-bars" aria-hidden="true">{Array.from({ length: 29 }, (_, i) => <i key={i} style={{ height: `${14 + ((i * 37 + 23) % 79)}%` }} />)}</div><span className="video-oversize">LIVE</span></div>}
            <div className="video-play">▶</div>
            <div className="video-feature-bottom"><div><strong>{featuredVideo.title || content.videoFeatureTitle}</strong><span>{content.videoFeatureSubtitle}</span></div><span>WATCH VIDEO ↗</span></div>
          </button>
        ) : (
          <a className="video-feature" href={content.videoArchive} target="_blank" rel="noopener noreferrer" aria-label="Открыть видеоархив DJ ESTRE"><div className="video-graphic"><div className="video-bars" aria-hidden="true">{Array.from({ length: 29 }, (_, i) => <i key={i} style={{ height: `${14 + ((i * 37 + 23) % 79)}%` }} />)}</div><span className="video-oversize">LIVE</span></div><div className="video-play">↗</div><div className="video-feature-bottom"><div><strong>{content.videoFeatureTitle}</strong><span>{content.videoFeatureSubtitle}</span></div><span>{content.videoArchiveButton} <Arrow diagonal /></span></div></a>
        )}
        {content.videos?.length ? <div className="cms-videos">{content.videos.map((v,i) => <button key={`${v.title}-${i}`} className="cms-video-card cms-video-button" onClick={() => setActiveVideo(v)}><span className="cms-video-index">{String(i+1).padStart(2,"0")}</span>{v.poster && <img src={v.poster} alt="" className="cms-video-thumb" />}<strong>{v.title}</strong><span>WATCH ▶</span></button>)}</div> : null}
        <p className="video-footnote"><span>{content.videoNote}</span>{content.videoArchive && <a href={content.videoArchive} target="_blank" rel="noopener noreferrer">{content.videoArchiveButton} ↗</a>}</p>
      </section>

      <section className="photo-section section-pad" id="photo">
        <Label index="04 / 06">{content.photoSectionLabel}</Label>
        <div className="section-heading"><h2>{content.photoTitleFirst}<br /><em>{content.photoTitleAccent}</em></h2><p className="multiline">{content.photoDescription}</p></div>
        <div className="filter-row" role="group" aria-label="Фильтр фотогалереи">{["ALL", "EVENTS", "BACKSTAGE", "DETAILS"].map(filter => <button key={filter} className={filter === photoFilter ? "selected" : ""} onClick={() => setPhotoFilter(filter)}>{filter}</button>)}</div>
        <div className="photo-grid">{visiblePhotos.map((item, i) => <button className={`photo-tile photo-tile-${i % 6}`} key={item.src} onClick={() => setActivePhoto(item.originalIndex)} aria-label={`Открыть ${item.name}`}><img src={item.src} alt={item.alt} loading="lazy"/><span className="photo-overlay"><span>{item.category} / {item.name}</span><b>↗</b></span></button>)}</div>
        <p className="small-note">Фотографии и категории редактируются через Sanity Studio.</p>
      </section>

      <section className="portfolio-section section-pad" id="portfolio">
        <Label index="05 / 06">{content.portfolioSectionLabel}</Label>
        <div className="section-heading"><h2>{content.portfolioTitleFirst}<br /><em>{content.portfolioTitleAccent}</em></h2><p className="multiline">{content.portfolioDescription}</p></div>
        <div className="achievements">{content.achievements.map((item, i) => <div className="achievement" key={item.title}><span className="achievement-index">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div><span className="achievement-year">{item.year}</span></div>)}</div>
        <div className="client-zone"><div className="client-label">{content.clientLabel}</div><div className="client-list">{content.clients.map(client => <div key={client}>{client}</div>)}</div><p className="small-note">Текстовые названия клиентов; логотипы можно добавить после согласования материалов.</p></div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <Label index="06 / 06">{content.contactSectionLabel}</Label>
        <div className="contact-body"><p className="contact-pre">{content.contactKicker}</p><h2>{content.contactTitleFirst}<br /><em>{content.contactTitleAccent}</em></h2><p className="contact-copy multiline">{content.contactDescription}</p><div className="contact-actions">
          {content.telegram && <a href={content.telegram} target="_blank" rel="noopener noreferrer" className="contact-primary">{content.telegramButtonText} <Arrow diagonal /></a>}
          {content.instagram && <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="contact-secondary">{content.instagramButtonText} <Arrow diagonal /></a>}
          {content.whatsapp && <a href={content.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-secondary">{content.whatsappButtonText} <Arrow diagonal /></a>}
          {content.email && <a href={`mailto:${content.email}`} className="contact-secondary">{content.emailButtonText} <Arrow diagonal /></a>}
        </div></div>
        <footer><a href="#top" className="footer-logo">{content.brand.replace(/^DJ\s*/i, "")}®</a><span>© {new Date().getFullYear()} DJ ESTRE</span><span>{content.footerLocation}</span><a href="#top">{content.footerBackText} ↑</a></footer>
      </section>
    </main>

    {activeVideo && <div className="video-modal" role="dialog" aria-modal="true" aria-label={`Видео: ${activeVideo.title}`} onClick={() => setActiveVideo(null)}>
      <div className="video-modal-content" onClick={e => e.stopPropagation()}>
        <div className="video-modal-header"><strong>{activeVideo.title}</strong><button type="button" onClick={() => setActiveVideo(null)} aria-label="Закрыть видео">CLOSE ×</button></div>
        {videoSource?.kind === "iframe" ? <iframe src={videoSource.src} title={activeVideo.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : videoSource?.kind === "file" ? <video controls autoPlay playsInline poster={activeVideo.poster} src={videoSource.src} /> : <div className="video-modal-fallback">Этот адрес не поддерживает встроенное воспроизведение. {activeVideo.url && <a href={activeVideo.url} target="_blank" rel="noopener noreferrer">Открыть видео ↗</a>}</div>}
      </div>
    </div>}
    {photo && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={() => setActivePhoto(null)}><button className="lightbox-close" aria-label="Закрыть" onClick={() => setActivePhoto(null)}>CLOSE ×</button><button className="lightbox-prev" aria-label="Предыдущее фото" onClick={e => { e.stopPropagation(); setActivePhoto(v => v === null ? null : (v - 1 + content.photos.length) % content.photos.length); }}>←</button><img src={photo.src} alt={photo.alt} onClick={e => e.stopPropagation()}/><button className="lightbox-next" aria-label="Следующее фото" onClick={e => { e.stopPropagation(); setActivePhoto(v => v === null ? null : (v + 1) % content.photos.length); }}>→</button><div className="lightbox-meta">{photo.name} / {(activePhoto ?? 0) + 1} OF {content.photos.length}</div></div>}
  </>;
}
