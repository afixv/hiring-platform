"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getJobById, createApplicant } from "@/services/database";
import type { Job } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioButton } from "@/components/ui/radio-button";
import DatePicker from "@/components/ui/calendar/datepicker";
import PhoneInput from "@/components/ui/phone-input";
import ProfileImageUploader from "@/components/feature/gesture/profile-image-uploader";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { DOMICILE_OPTIONS } from "@/lib/domicile-options";
import {
  buildApplicationFormSchema,
  PROFILE_FIELD_KEYS,
} from "@/lib/zod-schemas";
import { z } from "zod";
import Image from "next/image";

interface ApplyJobPageProps {
  params: Promise<{ id: string }>;
}

export default function ApplyJobPage({ params }: ApplyJobPageProps) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneValue, setPhoneValue] = useState<{
    code: string;
    number: string;
  }>({
    code: "+62",
    number: "",
  });
  const [gender, setGender] = useState("");
  const [domicile, setDomicile] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [isLinkedinUrlValid, setIsLinkedinUrlValid] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [photoProfile, setPhotoProfile] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      fetchJob(id);
    });
  }, [params]);

  // Validate LinkedIn URL
  const validateLinkedinUrl = (url: string) => {
    if (!url) {
      setIsLinkedinUrlValid(false);
      return;
    }
    const linkedinUrlPattern =
      /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    setIsLinkedinUrlValid(linkedinUrlPattern.test(url));
  };

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLinkedinLink(value);
    validateLinkedinUrl(value);
  };

  async function fetchJob(id: string) {
    try {
      setLoading(true);
      const data = await getJobById(id);
      setJob(data);
    } catch (error) {
      console.error("Failed to fetch job:", error);
    } finally {
      setLoading(false);
    }
  }

  // Get required fields from job config
  const requiredFields = useMemo(() => {
    if (!job?.application_form_config?.sections?.[0]?.fields) return [];
    return job.application_form_config.sections[0].fields;
  }, [job]);

  // Check if field is visible and required
  const isFieldVisible = (key: string) => {
    return requiredFields.some((field) => field.key === key);
  };

  const isFieldRequired = (key: string) => {
    const field = requiredFields.find((f) => f.key === key);
    return field?.validation?.required ?? false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setSubmitting(true);

      // Build dynamic validation schema
      const schema = buildApplicationFormSchema(requiredFields);

      // Prepare form data (only include visible fields)
      const formData: Record<string, unknown> = {};

      if (isFieldVisible(PROFILE_FIELD_KEYS.FULL_NAME))
        formData.full_name = fullName;
      if (isFieldVisible(PROFILE_FIELD_KEYS.EMAIL)) formData.email = email;
      if (isFieldVisible(PROFILE_FIELD_KEYS.PHONE_NUMBER))
        formData.phone_number = `${phoneValue.code}${phoneValue.number}`;
      if (isFieldVisible(PROFILE_FIELD_KEYS.GENDER)) formData.gender = gender;
      if (isFieldVisible(PROFILE_FIELD_KEYS.DOMICILE))
        formData.domicile = domicile;
      if (isFieldVisible(PROFILE_FIELD_KEYS.LINKEDIN_LINK))
        formData.linkedin_link = linkedinLink;
      if (isFieldVisible(PROFILE_FIELD_KEYS.DATE_OF_BIRTH)) {
        formData.date_of_birth = dateOfBirth
          ? `${dateOfBirth.getDate()} ${dateOfBirth.toLocaleString("default", {
              month: "long",
            })} ${dateOfBirth.getFullYear()}`
          : "";
      }
      if (isFieldVisible(PROFILE_FIELD_KEYS.PHOTO_PROFILE))
        formData.photo_profile = photoProfile;

      // Validate with Zod
      const validated = schema.parse(formData);

      // Submit to database
      await createApplicant({
        job_id: job!.id,
        full_name: validated.full_name as string | undefined,
        email: validated.email as string | undefined,
        phone_number: validated.phone_number as string | undefined,
        gender: validated.gender as "male" | "female" | undefined,
        domicile: validated.domicile as string | undefined,
        linkedin_link: validated.linkedin_link as string | undefined,
        date_of_birth: validated.date_of_birth as string | undefined,
        photo_profile: validated.photo_profile as string | undefined,
      });

      // Show success message
      setShowSuccess(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);

        // Scroll to first error
        const firstErrorField = Object.keys(fieldErrors)[0];
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        console.error("Failed to submit application:", error);
        setErrors({
          general: "Failed to submit application. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-20">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-base mt-4 text-neutral-70">
            Loading application form...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-20 p-6">
        <div className="text-center">
          <h2 className="heading-sm-bold mb-2 text-neutral-100">
            Job not found
          </h2>
          <p className="text-base mb-4 text-neutral-70">
            The job you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={() => router.push("/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-20 p-6">
        <div className="max-w-[606px] text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/img/application-sent.svg"
              alt="Success"
              width={214}
              height={214}
            />
          </div>
          <h2 className="heading-md-bold mb-3 text-neutral-90">
            🎉 Your application was sent!
          </h2>
          <p className="text-base mb-6 text-neutral-90">
            Congratulations! You&apos;ve taken the first step towards a
            rewarding career at PT XYZ Tbk. We look forward to learning more
            about you during the application process.
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={() => router.push("/jobs")}>
            Back to Job List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-20 md:p-6 md:!pb-0">
      <div className="mx-auto max-w-2xl">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl bg-neutral-10 shadow-sm flex flex-col min-h-screen md:min-h-auto">
          <div className="p-4 md:p-10 md:!pb-0 flex-1">
            <div className="flex flex-col gap-2 md:flex-row md:justify-between w-full">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  leadingIcon={<ArrowLeft size={20} />}
                  className="w-7"
                />
                <p className="text-lg !font-bold text-neutral-100">
                  Apply {job.title} at PT XYZ Tbk.
                </p>
              </div>
              <span className="text-sm text-neutral-90">
                ℹ️ This field required to fill
              </span>
            </div>
            <div className="space-y-6 pt-4 md:p-6">
              <p className="text-danger text-xs-bold">* Required</p>
              {isFieldVisible(PROFILE_FIELD_KEYS.PHOTO_PROFILE) && (
                <div id="photo_profile">
                  <ProfileImageUploader onImageChange={setPhotoProfile} />
                  {errors.photo_profile && (
                    <p className="text-xs mt-1 text-danger">
                      {errors.photo_profile}
                    </p>
                  )}
                </div>
              )}

              {/* Full Name */}
              {isFieldVisible(PROFILE_FIELD_KEYS.FULL_NAME) && (
                <div id="full_name">
                  <Input
                    label="Full name"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isFieldRequired(PROFILE_FIELD_KEYS.FULL_NAME)}
                    error={!!errors.full_name}
                    helperText={errors.full_name}
                  />
                </div>
              )}

              {/* Date of Birth */}
              {isFieldVisible(PROFILE_FIELD_KEYS.DATE_OF_BIRTH) && (
                <div id="date_of_birth">
                  <DatePicker
                    label="Date of birth"
                    required={isFieldRequired(PROFILE_FIELD_KEYS.DATE_OF_BIRTH)}
                    onDateChange={setDateOfBirth}
                  />
                  {errors.date_of_birth && (
                    <p className="text-xs mt-1 text-danger">
                      {errors.date_of_birth}
                    </p>
                  )}
                </div>
              )}

              {/* Gender */}
              {isFieldVisible(PROFILE_FIELD_KEYS.GENDER) && (
                <div id="gender">
                  <label className="text-base-bold mb-2 block text-neutral-100">
                    Pronoun (gender){" "}
                    {isFieldRequired(PROFILE_FIELD_KEYS.GENDER) && (
                      <span className="text-danger">*</span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <RadioButton
                      label="She/her (Female)"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    <RadioButton
                      label="He/him (Male)"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                  </div>
                  {errors.gender && (
                    <p className="text-xs mt-1 text-danger">{errors.gender}</p>
                  )}
                </div>
              )}

              {/* Domicile */}
              {isFieldVisible(PROFILE_FIELD_KEYS.DOMICILE) && (
                <div id="domicile">
                  <SearchableDropdown
                    label="Domicile"
                    placeholder="Choose your domicile"
                    value={domicile}
                    onValueChange={setDomicile}
                    required={isFieldRequired(PROFILE_FIELD_KEYS.DOMICILE)}
                    error={!!errors.domicile}
                    helperText={errors.domicile}
                    options={DOMICILE_OPTIONS}
                    emptyText="No domicile found"
                  />
                </div>
              )}

              {/* Phone Number */}
              {isFieldVisible(PROFILE_FIELD_KEYS.PHONE_NUMBER) && (
                <div id="phone_number">
                  <PhoneInput
                    label="Phone number"
                    value={phoneValue}
                    onChange={setPhoneValue}
                    required={isFieldRequired(PROFILE_FIELD_KEYS.PHONE_NUMBER)}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                  />
                </div>
              )}

              {/* Email */}
              {isFieldVisible(PROFILE_FIELD_KEYS.EMAIL) && (
                <div id="email">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={isFieldRequired(PROFILE_FIELD_KEYS.EMAIL)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </div>
              )}

              {/* LinkedIn Link */}
              {isFieldVisible(PROFILE_FIELD_KEYS.LINKEDIN_LINK) && (
                <div id="linkedin_link">
                  <Input
                    label="Link Linkedin"
                    type="url"
                    placeholder="https://www.linkedin.com/in/username"
                    value={linkedinLink}
                    onChange={handleLinkedinChange}
                    required={isFieldRequired(PROFILE_FIELD_KEYS.LINKEDIN_LINK)}
                    error={!!errors.linkedin_link}
                    success={isLinkedinUrlValid && !!linkedinLink}
                    helperText={
                      errors.linkedin_link ||
                      (isLinkedinUrlValid && linkedinLink
                        ? "URL address found"
                        : "")
                    }
                    helperIcon={
                      isLinkedinUrlValid && linkedinLink ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_1448_30343)">
                            <path
                              d="M9.5399e-08 8C1.48086e-07 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 4.27116e-08 8 9.5399e-08C3.58172 1.48086e-07 4.27116e-08 3.58172 9.5399e-08 8Z"
                              fill="#01959F"
                            />
                            <path
                              d="M5.7085 7.89134L7.3085 9.49134L10.3995 6.40039"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1448_30343">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      ) : undefined
                    }
                  />
                </div>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="rounded-lg bg-danger-surface border border-danger-border p-4">
                  <p className="text-sm text-danger">{errors.general}</p>
                </div>
              )}
            </div>
          </div>
          <div className="sticky bottom-0 bg-neutral-10 border-t border-neutral-40 p-4 md:p-6 flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
