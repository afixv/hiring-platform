"use client";

import PhoneInput, { type PhoneInputValue } from "@/components/ui/phone-input";
import { RadioButton } from "@/components/ui/radio-button";
import { Select, SelectItem } from "@/components/ui/select";
import ProfileUploader from "@/components/feature/gesture/profile-image-uploader";
import { useState } from "react";
import DatePicker from "@/components/ui/calendar/datepicker";
import Chip from "@/components/ui/chip";

export default function Home() {
  const [phone, setPhone] = useState<PhoneInputValue>({
    code: "+62", // Default Indonesia
    number: "",
  });
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi: nomor telepon harus diisi
    if (phone.number.length < 9) {
      setError(true);
    } else {
      setError(false);
      alert(`Nomor telepon yang di-submit: ${phone.code}${phone.number}`);
    }
  };
  const [selectedValue, setSelectedValue] = useState("");
  const [gender, setGender] = useState("female");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 p-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl space-y-6 rounded-lg bg-white p-8">
        <h1 className="text-xl font-bold text-center">Formulir Pendaftaran</h1>
<DatePicker />
        <ProfileUploader />
        <PhoneInput
          label="Phone number"
          value={phone}
          required
          onChange={setPhone}
          error={error}
          helperText={
            error
              ? "Nomor telepon tidak valid, minimal 9 digit."
              : "Masukkan nomor telepon Anda."
          }
        />

        <Chip label="Mandatory" state="active" />
<Chip label="Optional" state="rest" />
<Chip label="Disabled" disabled />

        

        <button
          type="submit"
          className="w-full rounded-lg bg-sky-600 py-2.5 text-white font-semibold transition-colors hover:bg-sky-700">
          Daftar
        </button>
        <Select
          label="Domicile"
          placeholder="Choose your domicile"
          value={selectedValue}
          onValueChange={setSelectedValue}
          required>
          <SelectItem value="full-time">Full-time</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
          <SelectItem value="part-time">Part-time</SelectItem>
          <SelectItem value="internship">Internship</SelectItem>
          <SelectItem value="freelance">Freelance</SelectItem>
        </Select>
        <div className="flex gap-4">
          <RadioButton
            label="She/her (Female)"
            name="gender"
            value="female"
            checked={gender === "female"}
            onChange={(e) => setGender(e.target.value)}
          />
          <RadioButton
            label="He/him (Male)"
            name="gender"
            value="male"
            checked={gender === "male"}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>
      </form>
    </main>
  );
}
