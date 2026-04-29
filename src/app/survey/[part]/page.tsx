import { notFound } from "next/navigation";
import { SurveyRunner } from "@/components/SurveyRunner";
import type { PartId } from "@/lib/survey-data";

type Props = {
  params: Promise<{ part: string }>;
};

const PART_BY_SLUG: Record<string, PartId> = {
  "part-1": "part-1",
  "part-2": "part-2",
  "part-3": "part-3",
};

export default async function SurveyPartPage({ params }: Props) {
  const { part } = await params;
  const partNumber = PART_BY_SLUG[part];

  if (!partNumber) notFound();

  return <SurveyRunner part={partNumber} />;
}
