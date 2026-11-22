
import HomePage from "@/components/HomePage";
import { getSiteContent } from "@/lib/sanity";

export default async function Page() {
  const content = await getSiteContent();

  return <HomePage content={content} />;
}
