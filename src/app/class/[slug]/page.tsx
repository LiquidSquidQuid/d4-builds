import { notFound } from "next/navigation";
import ClassSection from "@/components/class/ClassSection";
import { classData } from "@/lib/constants/classes";
import type { D4Class } from "@/lib/types/classes";

const validSlugs: D4Class[] = [
  'barbarian',
  'warlock',
  'paladin',
  'rogue',
  'sorcerer',
  'druid',
  'necromancer',
  'spiritborn',
];

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export default async function ClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!validSlugs.includes(slug as D4Class)) {
    notFound();
  }

  const data = classData[slug as D4Class];
  if (!data) notFound();

  return <ClassSection data={data} />;
}
