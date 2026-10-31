import { notFound } from "next/navigation";
import { getCommercialPageBySlug } from "@/lib/commercial-pages";
import {
  CommercialLandingTemplate,
  generateCommercialPageMetadata,
} from "@/components/home/CommercialLandingTemplate";

const SLUG = "carte-restaurant-digitale";

export async function generateMetadata() {
  return generateCommercialPageMetadata(SLUG);
}

export default function Page() {
  const page = getCommercialPageBySlug(SLUG);
  if (!page) notFound();
  return <CommercialLandingTemplate page={page} />;
}

