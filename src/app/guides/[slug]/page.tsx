import type { Metadata } from "next";
import { GuideView, guideMetadata } from "@/components/GuideView";
import { guides } from "@/lib/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return guideMetadata(slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GuideView slug={slug} />;
}
