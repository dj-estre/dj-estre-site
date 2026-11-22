import { content as fallback, type SiteContent } from "./content";
import { client } from "@/sanity/client";

const query = `{
 "settings": *[_type == "siteSettings"] | order(_updatedAt desc)[0]{brand,location,tagline,intro,telegram,instagram,whatsapp,email,videoArchive,navigation,heroDim,heroTopline,heroEyebrow,heroTitleFirst,heroTitleAccent,heroSubline,headerBookingText,heroScrollText,heroBookingText,aboutSectionLabel,aboutKicker,aboutTitleFirst,aboutTitleAccent,aboutLinkText,aboutFooterLeft,aboutFooterRight,musicSectionLabel,musicTitleFirst,musicTitleAccent,musicDescription,musicArchiveButton,videoSectionLabel,videoTitleFirst,videoTitleAccent,videoDescription,videoFeatureTitle,videoFeatureSubtitle,videoArchiveButton,videoNote,photoSectionLabel,photoTitleFirst,photoTitleAccent,photoDescription,portfolioSectionLabel,portfolioTitleFirst,portfolioTitleAccent,portfolioDescription,clientLabel,contactSectionLabel,contactKicker,contactTitleFirst,contactTitleAccent,contactDescription,telegramButtonText,instagramButtonText,whatsappButtonText,emailButtonText,footerLocation,footerBackText,"heroImage":heroImage.asset->url},
 "music": *[_type == "musicTrack"] | order(order asc, _createdAt asc){title,category,length,url,"audio":audio.asset->url},
 "videos": *[_type == "videoItem"] | order(order asc, _createdAt asc){title,url,featured,"videoFile":videoFile.asset->url,"poster":poster.asset->url},
 "photos": *[_type == "photoItem"] | order(order asc, _createdAt asc){name,category,alt,"src":image.asset->url},
 "achievements": *[_type == "achievement"] | order(order asc, _createdAt asc){title,detail,year},
 "clients": *[_type == "client"] | order(order asc, _createdAt asc){name}
}`;

type Result = {
 settings?: Partial<SiteContent> | null;
 music?: Array<{title:string;category?:string;length?:string;url?:string;audio?:string}>;
 videos?: Array<{title:string;url?:string;videoFile?:string;poster?:string;featured?:boolean}>;
 photos?: Array<{src:string;name:string;category?:string;alt?:string}>;
 achievements?: Array<{title:string;year?:string;detail?:string}>;
 clients?: Array<{name:string}>;
};
export async function getSiteContent(): Promise<SiteContent> {
 if (!client) return fallback;
 try {
  const data = await client.fetch<Result>(query);
  const settings = Object.fromEntries(Object.entries(data.settings || {}).filter(([,value]) => value !== null && value !== undefined && value !== ""));
  // Treat an empty menu as "use the default", not "hide the whole navigation".
  if (!Array.isArray(settings.navigation) || !settings.navigation.length) delete settings.navigation;
  const validMusic = (data.music || []).filter(t => t.title && (t.audio || t.url));
  return {
   ...fallback, ...settings,
   music: validMusic.length ? validMusic.map((t,i)=>({number:String(i+1).padStart(2,"0"),title:t.title,category:t.category || "DJ MIX",length:t.length || (t.audio ? "AUDIO" : "LINK"),audio:t.audio || "",url:t.url || "",isDemo:false})) : fallback.music,
   videos: (data.videos || []).filter(v=>v.title && (v.url || v.videoFile)),
   photos: (data.photos || []).filter(p=>p.src).length ? (data.photos || []).filter(p=>p.src).map(p=>({src:p.src,alt:p.alt || p.name,category:p.category || "EVENTS",name:p.name})) : fallback.photos,
   achievements: data.achievements?.length ? data.achievements.map(a=>({year:a.year || "",title:a.title,detail:a.detail || ""})) : fallback.achievements,
   clients: data.clients?.length ? data.clients.map(c=>c.name) : fallback.clients,
  } as SiteContent;
 } catch (err) {
  console.error("Sanity content fetch failed; serving fallback",err);
  return fallback;
 }
}
