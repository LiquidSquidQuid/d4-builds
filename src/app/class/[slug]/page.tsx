import { notFound } from "next/navigation";
import ClassSection from "@/components/class/ClassSection";
import JumpRail from "@/components/ui/JumpRail";
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

const RAIL_SECTIONS = [
  { id: 'overview', label: 'I · Overview' },
  { id: 'rotation', label: 'II · Rotation' },
  { id: 'phases', label: 'III · Phases' },
  { id: 'gear', label: 'IV · Gear' },
  { id: 'stats', label: 'V · Priority' },
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

  return (
    <>
      <JumpRail sections={RAIL_SECTIONS} />
      <ClassSection data={data} />
    </>
  );
}
