import { supabase } from '@/lib/supabase';
import type { Job, Applicant, Database } from '@/types/database';
import { generateSlug, formatSalary } from '@/lib/zod-schemas';

/**
 * Fetch all jobs from the database
 */
export async function getAllJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }

  // Enhance jobs with computed fields
  return (data || []).map(enhanceJob);
}

/**
 * Fetch active jobs only
 */
export async function getActiveJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active jobs:', error);
    throw new Error('Failed to fetch active jobs');
  }

  return (data || []).map(enhanceJob);
}

/**
 * Fetch a single job by ID
 */
export async function getJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching job:', error);
    return null;
  }

  return data ? enhanceJob(data) : null;
}

/**
 * Fetch a single job by slug
 */
export async function getJobBySlug(slug: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching job by slug:', error);
    return null;
  }

  return data ? enhanceJob(data) : null;
}

/**
 * Create a new job
 */
export async function createJob(
  jobData: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'slug'>
): Promise<Job> {
  const slug = generateSlug(jobData.title);
  const started_on = new Date().toISOString().split('T')[0];

  const insertData = {
    ...jobData,
    slug,
    started_on,
  } as Database['public']['Tables']['jobs']['Insert'];

  const { data, error } = await supabase
    .from('jobs')
    // @ts-expect-error - Supabase type inference issue
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw new Error('Failed to create job');
  }

  return enhanceJob(data);
}

/**
 * Update job status only
 */
export async function updateJobStatus(
  id: string,
  status: Job['status']
): Promise<Job> {
  const updateData = { status } as Database['public']['Tables']['jobs']['Update'];

  const { data, error } = await supabase
    .from('jobs')
    // @ts-expect-error - Supabase type inference issue
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating job status:', error);
    throw new Error('Failed to update job status');
  }

  return enhanceJob(data);
}

/**
 * Update an existing job
 */
export async function updateJob(
  id: string,
  updates: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>
): Promise<Job> {
  // If title is updated, regenerate slug
  if (updates.title) {
    updates.slug = generateSlug(updates.title);
  }

  const updateData = updates as Database['public']['Tables']['jobs']['Update'];

  const { data, error } = await supabase
    .from('jobs')
    // @ts-expect-error - Supabase type inference issue
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating job:', error);
    throw new Error('Failed to update job');
  }

  return enhanceJob(data);
}

/**
 * Delete a job
 */
export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from('jobs').delete().eq('id', id);

  if (error) {
    console.error('Error deleting job:', error);
    throw new Error('Failed to delete job');
  }
}

/**
 * Enhance job data with computed fields
 */
function enhanceJob(job: Job): Job {
  return {
    ...job,
    salary_range: {
      min: job.salary_min,
      max: job.salary_max,
      currency: 'IDR',
      display_text: `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`,
    },
  };
}

// ==================== APPLICANT OPERATIONS ====================

/**
 * Fetch all applicants for a specific job
 */
export async function getApplicantsByJobId(jobId: string): Promise<Applicant[]> {
  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applicants:', error);
    throw new Error('Failed to fetch applicants');
  }

  return data || [];
}

/**
 * Fetch a single applicant by ID
 */
export async function getApplicantById(id: string): Promise<Applicant | null> {
  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching applicant:', error);
    return null;
  }

  return data;
}

/**
 * Create a new applicant
 */
export async function createApplicant(
  applicantData: Omit<Applicant, 'id' | 'created_at' | 'updated_at'>
): Promise<Applicant> {
  const insertData = applicantData as Database['public']['Tables']['applicants']['Insert'];

  const { data, error } = await supabase
    .from('applicants')
    // @ts-expect-error - Supabase type inference issue
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating applicant:', error);
    throw new Error('Failed to submit application');
  }

  return data;
}

/**
 * Update an existing applicant
 */
export async function updateApplicant(
  id: string,
  updates: Partial<Omit<Applicant, 'id' | 'created_at' | 'updated_at'>>
): Promise<Applicant> {
  const updateData = updates as Database['public']['Tables']['applicants']['Update'];

  const { data, error } = await supabase
    .from('applicants')
    // @ts-expect-error - Supabase type inference issue
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating applicant:', error);
    throw new Error('Failed to update applicant');
  }

  return data;
}

/**
 * Delete an applicant
 */
export async function deleteApplicant(id: string): Promise<void> {
  const { error } = await supabase.from('applicants').delete().eq('id', id);

  if (error) {
    console.error('Error deleting applicant:', error);
    throw new Error('Failed to delete applicant');
  }
}

/**
 * Get count of applicants for a job
 */
export async function getApplicantCount(jobId: string): Promise<number> {
  const { count, error } = await supabase
    .from('applicants')
    .select('*', { count: 'exact', head: true })
    .eq('job_id', jobId);

  if (error) {
    console.error('Error counting applicants:', error);
    return 0;
  }

  return count || 0;
}
