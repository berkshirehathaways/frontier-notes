import { InterviewWriterForm } from "@/components/interview-writer-form";

export const metadata = {
  title: "Interview Writer Studio",
  description: "Internal tool for transcription and interview markdown drafting.",
};

export default function InterviewWriterPage() {
  return <InterviewWriterForm />;
}
