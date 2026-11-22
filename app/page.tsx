
import Site from "@/components/Site";
import { getSiteContent } from "@/lib/sanity-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  return <Site content={content} />;
}
