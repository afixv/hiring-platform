"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Wallet, ArrowLeft } from "lucide-react";
import { getActiveJobs } from "@/services/database";
import type { Job } from "@/types/database";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserAvatarDropdown } from "@/components/feature/admin/user-avatar-dropdown";

function JobListContent() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const data = await getActiveJobs();
        setJobs(data);
        if (data.length > 0 && window.innerWidth >= 768) {
          setSelectedJob(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-base text-neutral-70">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6">
        <div className="text-center">
          <Image
            src="/img/no-job-opening.svg"
            alt="No job openings"
            width={300}
            height={300}
            className="mx-auto mb-6"
          />
          <h2 className="text-xl font-bold text-neutral-100 mb-2">
            No job openings available
          </h2>
          <p className="text-base text-neutral-70">
            Please wait for the next batch of openings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="border-b border-neutral-40 shadow-modal">
        <div className="flex items-center justify-end py-3 px-4 md:px-6 lg:px-6 max-w-[1440px] mx-auto w-full">
          <UserAvatarDropdown  />
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-10 sm:px-8 md:px-[104px] flex-1 w-full">
        <aside
          className={`
            w-full flex-col md:flex md:w-[384px] md:shrink-0
            ${selectedJob ? "hidden" : "flex"}
          `}>
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`w-full rounded-lg p-0 text-left transition-all ${
                  selectedJob?.id === job.id
                    ? "border-2 border-[#01777F] bg-[#F7FEFF]"
                    : " border-[#E0E0E0] bg-white hover:border-[#01777F] border-2 hover:bg-[#F7FEFF]"
                }`}>
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-[#E0E0E0] bg-white">
                      <span className="text-2xl font-bold text-[#01959F]">
                        {job.title.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sans text-base !font-bold leading-7 text-[#404040]">
                        {job.title}
                      </h3>
                      <p className="font-sans text-sm font-normal leading-6 text-[#404040]">
                        PT XYZ Indonesia Tbk.
                      </p>
                    </div>
                  </div>
                  <div className="my-1 h-px w-full border-t border-dashed border-[#E0E0E0]" />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 text-xs font-normal text-[#616161]">
                      <MapPin className="size-4" />
                      <span>Jakarta Selatan</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-normal text-[#616161]">
                      <Wallet className="size-4" />
                      <span>{job.salary_range?.display_text}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>
        <main
          className={`
            w-full flex-1 overflow-y-auto
            md:block
            ${selectedJob ? "block" : "hidden"}
          `}>
          {selectedJob ? (
            <div className="rounded-lg border border-[#E0E0E0] p-6">
              <button
                onClick={() => setSelectedJob(null)}
                className="mb-4 flex items-center gap-2 text-sm font-bold text-[#01959F] md:hidden">
                <ArrowLeft className="size-5" />
                All Jobs
              </button>
              <div className="flex items-start justify-between gap-6 border-b border-[#E0E0E0] pb-6">
                <div className="flex flex-1 items-start gap-6">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-[#E0E0E0] bg-white">
                    <span className="text-2xl font-bold text-[#01959F]">
                      {selectedJob.title.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex w-fit items-center justify-center rounded bg-[#43936C] px-2 py-0.5">
                      <span className="font-sans text-xs font-bold text-white">
                        Full-Time
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="font-sans text-lg font-bold leading-7 text-[#404040]">
                        {selectedJob.title}
                      </h1>
                      <p className="font-sans text-sm font-normal leading-6 text-[#757575]">
                        PT XYZ Indonesia Tbk.
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => router.push(`/jobs/${selectedJob.id}/apply`)}
                  variant={"secondary"}
                  className="hidden md:block">
                  Apply
                </Button>
              </div>

              <div className="prose prose-sm max-w-none pt-6 font-sans text-sm font-normal leading-6 text-[#404040] prose-li:my-0 prose-ul:space-y-1">
                {/* Using dangerouslySetInnerHTML to render HTML content from the database */}
                <div
                  dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                />
              </div>
              <Button
                onClick={() => router.push(`/jobs/${selectedJob.id}/apply`)}
                variant={"secondary"}
                className="w-full mt-4 block md:hidden">
                Apply
              </Button>
            </div>
          ) : (
            <div className="hidden h-full items-center justify-center rounded-lg border border-[#E0E0E0] p-8 md:flex">
              <p className="text-base text-neutral-70">
                Select a job to view details
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function JobListPage() {
  return (
    <ProtectedRoute requiredRole="jobseeker">
      <JobListContent />
    </ProtectedRoute>
  );
}
