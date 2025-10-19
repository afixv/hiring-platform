"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getJobById, getApplicantsByJobId } from "@/services/database";
import type { Job, Applicant } from "@/types/database";
import Image from "next/image";
import CandidatesTable from "@/components/feature/admin/candidates-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserAvatarDropdown } from "@/components/feature/admin/user-avatar-dropdown";

interface CandidatesPageProps {
  params: Promise<{ jobId: string }>;
}

export default function CandidatesPage({ params }: CandidatesPageProps) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ jobId }) => {
      fetchData(jobId);
    });
  }, [params]);

  async function fetchData(id: string) {
    try {
      setLoading(true);
      const [jobData, applicantsData] = await Promise.all([
        getJobById(id),
        getApplicantsByJobId(id),
      ]);
      setJob(jobData);
      setApplicants(applicantsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-20 p-6">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-base mt-4 text-neutral-70">
                Loading candidates...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-neutral-20 p-6">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-base text-neutral-70">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-10">
      <header className="border-b border-neutral-40 px-6 py-4">
        <div className="flex items-center justify-between gap-2 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => router.push("/admin/jobs")}>
              Job list
            </Button>
            <ChevronRight className="size-4 text-neutral-90" />
            <Button
              variant="outline"
              size="md"
              className="!text-neutral-100 !border-neutral-50 !bg-neutral-30">
              Manage Candidate
            </Button>
          </div>
          <UserAvatarDropdown />
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] p-6">
        <h1 className="heading-md-bold mb-6 text-neutral-100">{job.title}</h1>

        {applicants.length === 0 ? (
          <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-neutral-40 bg-neutral-10 p-12">
            <Image
              src="/img/no-candidate.found.svg"
              alt="No candidates found"
              width={300}
              height={300}
              className="mb-6"
            />
            <h2 className="heading-sm-bold mb-2 text-neutral-100">
              No candidates found
            </h2>
            <p className="text-base text-center text-neutral-70">
              Share your job vacancies so that more candidates will apply.
            </p>
          </div>
        ) : (
          <CandidatesTable data={applicants} />
        )}
      </div>
    </div>
  );
}
