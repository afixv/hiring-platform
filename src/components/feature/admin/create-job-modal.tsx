'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { Chip } from '@/components/ui/chip';
import { createJob } from '@/services/database';
import {
  createJobSchema,
  type CreateJobFormData,
  JOB_TYPES,
  buildApplicationFormConfig,
  PROFILE_FIELD_KEYS,
} from '@/lib/zod-schemas';
import { formatRupiah, parseRupiah } from '@/lib/currency';
import { z } from 'zod';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ProfileFieldState = 'mandatory' | 'optional' | 'off';

interface ProfileFieldConfig {
  key: string;
  label: string;
}

interface ProfileFieldConfig {
  key: string;
  label: string;
  isLocked?: boolean; // Jika true, tidak bisa diubah
}

const PROFILE_FIELDS: ProfileFieldConfig[] = [
  { key: PROFILE_FIELD_KEYS.FULL_NAME, label: 'Full name', isLocked: true },
  { key: PROFILE_FIELD_KEYS.PHOTO_PROFILE, label: 'Photo Profile', isLocked: true },
  { key: PROFILE_FIELD_KEYS.GENDER, label: 'Gender' },
  { key: PROFILE_FIELD_KEYS.DOMICILE, label: 'Domicile' },
  { key: PROFILE_FIELD_KEYS.EMAIL, label: 'Email', isLocked: true },
  { key: PROFILE_FIELD_KEYS.PHONE_NUMBER, label: 'Phone number' },
  { key: PROFILE_FIELD_KEYS.LINKEDIN_LINK, label: 'Linkedin link' },
  { key: PROFILE_FIELD_KEYS.DATE_OF_BIRTH, label: 'Date of birth' },
];

function ProfileFieldSelector({
  label,
  value,
  onChange,
  isLocked,
}: {
  label: string;
  value: ProfileFieldState;
  onChange: (value: ProfileFieldState) => void;
  isLocked?: boolean;
}) {
  const options: ProfileFieldState[] = ['mandatory', 'optional', 'off'];

  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-base text-neutral-100">{label}</span>
      <div className="flex gap-2">
        {options.map((option) => {
          const isActive = value === option;
          // Jika locked, hanya mandatory yang bisa diklik, sisanya disabled
          // Jika tidak locked, semua bisa diklik
          const shouldDisable = isLocked && option !== 'mandatory';

          return (
            <button
              key={option}
              type="button"
              onClick={() => !shouldDisable && onChange(option)}
              disabled={shouldDisable}
              className={`p-0 bg-transparent border-none focus:outline-none ${
                shouldDisable ? 'cursor-not-allowed' : ''
              }`}
            >
              <Chip
                label={option.charAt(0).toUpperCase() + option.slice(1)}
                state={isActive ? 'active' : 'rest'}
                disabled={shouldDisable}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CreateJobModal({ isOpen, onClose, onSuccess }: CreateJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState('');
  const [jobType, setJobType] = useState('');
  const [description, setDescription] = useState('');
  const [numberOfCandidates, setNumberOfCandidates] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  // Profile fields state
  const [profileFields, setProfileFields] = useState<Record<string, ProfileFieldState>>({
    [PROFILE_FIELD_KEYS.FULL_NAME]: 'mandatory',
    [PROFILE_FIELD_KEYS.PHOTO_PROFILE]: 'mandatory',
    [PROFILE_FIELD_KEYS.GENDER]: 'mandatory',
    [PROFILE_FIELD_KEYS.DOMICILE]: 'mandatory',
    [PROFILE_FIELD_KEYS.EMAIL]: 'mandatory',
    [PROFILE_FIELD_KEYS.PHONE_NUMBER]: 'mandatory',
    [PROFILE_FIELD_KEYS.LINKEDIN_LINK]: 'mandatory',
    [PROFILE_FIELD_KEYS.DATE_OF_BIRTH]: 'mandatory',
  });

  const handleProfileFieldChange = (key: string, value: ProfileFieldState) => {
    setProfileFields((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setTitle('');
    setJobType('');
    setDescription('');
    setNumberOfCandidates('');
    setSalaryMin('');
    setSalaryMax('');
    setProfileFields({
      [PROFILE_FIELD_KEYS.FULL_NAME]: 'mandatory',
      [PROFILE_FIELD_KEYS.PHOTO_PROFILE]: 'mandatory',
      [PROFILE_FIELD_KEYS.GENDER]: 'mandatory',
      [PROFILE_FIELD_KEYS.DOMICILE]: 'mandatory',
      [PROFILE_FIELD_KEYS.EMAIL]: 'mandatory',
      [PROFILE_FIELD_KEYS.PHONE_NUMBER]: 'mandatory',
      [PROFILE_FIELD_KEYS.LINKEDIN_LINK]: 'mandatory',
      [PROFILE_FIELD_KEYS.DATE_OF_BIRTH]: 'mandatory',
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetForm();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setLoading(true);

      // Parse rupiah values back to plain numbers
      const salaryMinParsed = parseRupiah(salaryMin);
      const salaryMaxParsed = parseRupiah(salaryMax);

      // Prepare form data
      const formData: CreateJobFormData = {
        title,
        job_type: jobType,
        description,
        number_of_candidates: parseInt(numberOfCandidates, 10),
        salary_min: parseInt(salaryMinParsed, 10),
        salary_max: parseInt(salaryMaxParsed, 10),
        profile_fields: profileFields as CreateJobFormData['profile_fields'],
      };

      // Validate with Zod
      const validated = createJobSchema.parse(formData);

      // Build application form config
      const application_form_config = buildApplicationFormConfig(validated.profile_fields);

      // Create job
      await createJob({
        title: validated.title,
        job_type: validated.job_type,
        description: validated.description,
        number_of_candidates: Number(validated.number_of_candidates),
        salary_min: Number(validated.salary_min),
        salary_max: Number(validated.salary_max),
        status: 'draft',
        application_form_config,
      });

      // Success!
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Failed to create job:', error);
        setErrors({ general: 'Failed to create job. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-100/50"
          onClick={handleClose}
        />
      )}

      {/* Modal Container */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl bg-neutral-10 shadow-modal flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-40 bg-neutral-10 px-6 py-4 rounded-t-2xl flex-shrink-0">
              <h2 className="heading-sm-bold text-neutral-100">Job Opening</h2>
              <button
                onClick={handleClose}
                className="rounded-full p-1 hover:bg-neutral-30 transition-colors"
                type="button"
              >
                <X className="size-5 text-neutral-70" />
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Name */}
                <Input
                  label="Job Name"
                  placeholder="Ex. Front End Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />

                {/* Job Type */}
                <Select
                  label="Job Type"
                  placeholder="Select job type"
                  value={jobType}
                  onValueChange={setJobType}
                  error={!!errors.job_type}
                  helperText={errors.job_type}
                  required
                >
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select>

                {/* Job Description */}
                <Textarea
                  label="Job Description"
                  placeholder="Ex."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                  maxLength={1000}
                  showCounter
                  required
                />

                {/* Number of Candidates */}
                <Input
                  label="Number of Candidate Needed"
                  placeholder="Ex. 2"
                  type="number"
                  value={numberOfCandidates}
                  onChange={(e) => setNumberOfCandidates(e.target.value)}
                  error={!!errors.number_of_candidates}
                  helperText={errors.number_of_candidates}
                  required
                />

                {/* Job Salary */}
                <div>
                  <label className="text-base-bold mb-2 block text-neutral-100">
                    Job Salary <span className="text-danger">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Minimum Estimated Salary"
                      placeholder="7.000.000"
                      type="text"
                      prefixText="Rp"
                      value={salaryMin}
                      onChange={(e) => {
                        const parsed = parseRupiah(e.target.value);
                        const formatted = formatRupiah(parsed);
                        setSalaryMin(formatted);
                      }}
                      error={!!errors.salary_min}
                      helperText={errors.salary_min}
                    />
                    <Input
                      label="Maximum Estimated Salary"
                      placeholder="8.000.000"
                      type="text"
                      prefixText="Rp"
                      value={salaryMax}
                      onChange={(e) => {
                        const parsed = parseRupiah(e.target.value);
                        const formatted = formatRupiah(parsed);
                        setSalaryMax(formatted);
                      }}
                      error={!!errors.salary_max}
                      helperText={errors.salary_max}
                    />
                  </div>
                </div>

                {/* Minimum Profile Information Required */}
                <div>
                  <h3 className="text-base-bold mb-4 text-neutral-100">
                    Minimum Profile Information Required
                  </h3>
                  <div className="divide-y divide-neutral-40 rounded-lg border border-neutral-40 bg-neutral-10 px-4">
                    {PROFILE_FIELDS.map((field) => (
                      <ProfileFieldSelector
                        key={field.key}
                        label={field.label}
                        value={profileFields[field.key] || 'mandatory'}
                        onChange={(value) => handleProfileFieldChange(field.key, value)}
                        isLocked={field.isLocked}
                      />
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {errors.general && (
                  <div className="rounded-lg bg-danger-surface border border-danger-border p-4">
                    <p className="text-sm text-danger">{errors.general}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Footer - Fixed */}
            <div className="border-t border-neutral-40 bg-neutral-10 px-6 py-4 rounded-b-2xl flex justify-end flex-shrink-0">
              <Button type="submit" variant="primary" size="md" disabled={loading} onClick={handleSubmit}>
                {loading ? 'Publishing...' : 'Publish Job'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
