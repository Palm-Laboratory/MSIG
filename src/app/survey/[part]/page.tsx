import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ part: string }>;
};

const PART_BY_SLUG: Record<string, string> = {
  "part-1": "1",
  "part-2": "2",
  "part-3": "3",
};

export default async function SurveyPartPage({ params }: Props) {
  const { part } = await params;
  const partNumber = PART_BY_SLUG[part];

  if (!partNumber) notFound();

  redirect(`/diagnosis/part/${partNumber}`);
}
