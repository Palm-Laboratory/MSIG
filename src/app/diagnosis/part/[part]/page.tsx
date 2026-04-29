import { notFound } from "next/navigation";
import { SurveyRunner } from "@/components/SurveyRunner";
import type { PartId } from "@/lib/survey-data";

type Props = {
  params: Promise<{ part: string }>;
};

const PART_BY_NUMBER: Record<string, PartId> = {
  "1": "part-1",
  "2": "part-2",
  "3": "part-3",
};

export default async function DiagnosisPartPage({ params }: Props) {
  const { part } = await params;
  const partId = PART_BY_NUMBER[part];

  if (!partId) notFound();

  return <SurveyRunner part={partId} />;
}
