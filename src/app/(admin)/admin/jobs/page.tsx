"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { getAllJobs, updateJobStatus } from "@/services/database";
import type { Job } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import Image from "next/image";
import CreateJobModal from "@/components/feature/admin/create-job-modal";
import { JobCard } from "@/components/feature/admin/job-card";
import { DropdownProvider } from "@/context/DropdownContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserAvatarDropdown } from "@/components/feature/admin/user-avatar-dropdown";

function AdminJobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter] = useState<"all" | "active" | "inactive" | "draft">(
    "all"
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const filterJobs = useCallback(() => {
    let filtered = [...jobs];

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.job_type.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, statusFilter]);

  useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  async function fetchJobs() {
    try {
      setLoading(true);
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(jobId: string, newStatus: Job["status"]) {
    try {
      await updateJobStatus(jobId, newStatus);

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error("Failed to update job status:", error);
      fetchJobs();
    }
  }

  function handleJobCreated() {
    fetchJobs();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-20 p-6">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-base mt-4 text-neutral-70">Loading jobs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DropdownProvider>
      <div className="h-screen bg-neutral-10 relative overflow-hidden flex flex-col">
        <div className="w-full flex flex-col flex-1">
          <div className="border-b border-neutral-40">
            <div className="flex items-center justify-between py-4 px-4 md:px-6 lg:px-6 max-w-[1440px] mx-auto">
              <h1 className="heading-md-bold text-neutral-100 text-xl md:text-2xl">
                Job List
              </h1>
              <UserAvatarDropdown />
            </div>
          </div>

          <div className="flex flex-col-reverse max-w-[1440px] mx-auto my-auto lg:flex-row items-start gap-4 lg:gap-6 overflow-y-auto relative w-full h-[calc(100vh-96px)] py-4 md:py-6 px-4 md:px-6">
            <div className="flex-1 w-full space-y-6">
              <Input
                placeholder="Search by job details"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                trailingIcon={<Search className="size-5 md:size-6 text-primary" />}
              />

              {filteredJobs.length === 0 ? (
                <div className="flex min-h-[400px] md:min-h-[500px] flex-col items-center justify-center rounded-2xl bg-neutral-10 p-6 md:p-12">
                  <Image
                    src="/img/no-job-opening.svg"
                    alt="No job openings"
                    width={200}
                    height={200}
                    className="mb-6"
                  />
                  <h2 className="heading-sm-bold mb-2 text-neutral-100 text-lg md:text-xl">
                    No job openings available
                  </h2>
                  <p className="text-sm md:text-base mb-6 text-center text-neutral-70">
                    Create a job opening now and start the candidate process.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setShowCreateModal(true)}>
                    Create a new job
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3 md:gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="w-full lg:w-[300px] rounded-2xl p-4 md:p-6 text-neutral-10 shadow-modal relative overflow-hidden bg-cover bg-center bg-[url('/img/bg.png')] flex-shrink-0">
              <div className="absolute inset-0 bg-black/70 rounded-2xl" />
              <div className="relative z-10">
                <h3 className="text-lg-bold mb-1 text-neutral-40 text-base md:text-lg">
                  Recruit the best candidates
                </h3>
                <p className="text-sm mb-6">
                  Create jobs, invite, and hire with ease
                </p>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full text-sm md:text-base"
                  onClick={() => setShowCreateModal(true)}>
                  Create a new job
                </Button>
              </div>
            </div>
          </div>

          <CreateJobModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleJobCreated}
          />
          {showSuccessToast && (
            <Toast
              message="Job vacancy successfully created"
              onClose={() => setShowSuccessToast(false)}
              duration={5000}
            />
          )}
        </div>
      </div>
    </DropdownProvider>
  );
}

export default function AdminJobsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminJobsContent />
    </ProtectedRoute>
  );
}
