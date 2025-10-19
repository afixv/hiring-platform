# 📚 Dokumentasi Hiring Platform

Dokumentasi lengkap tentang komponen, design system, package dependencies, dan assets yang digunakan dalam project Hiring Platform.

---

## 📦 Package Dependencies

### Production Dependencies

| Package | Version | Deskripsi |
|---------|---------|-----------|
| `next` | 15.5.6 | React framework untuk production-ready web applications |
| `react` | 19.1.0 | JavaScript library untuk membangun user interfaces |
| `react-dom` | 19.1.0 | React package untuk DOM rendering |
| `@radix-ui/react-dialog` | ^1.1.15 | Dialog/Modal component primitive dari Radix UI |
| `@radix-ui/react-popover` | ^1.1.15 | Popover component primitive dari Radix UI |
| `@radix-ui/react-select` | ^2.2.6 | Select dropdown component primitive dari Radix UI |
| `@radix-ui/react-slot` | ^1.2.3 | Slot merging component dari Radix UI |
| `class-variance-authority` | ^0.7.1 | Type-safe CSS class management untuk component variants |
| `clsx` | ^2.1.1 | Utility untuk conditional class names |
| `tailwind-merge` | ^3.3.1 | Merge Tailwind CSS classes intelligently |
| `fingerpose` | ^0.1.0 | Hand gesture recognition library untuk pose detection |
| `lucide-react` | ^0.546.0 | Beautiful icon library untuk React |
| `react-icons` | ^5.5.0 | Popular icon sets sebagai React components |
| `react-webcam` | ^7.2.0 | Webcam component untuk React |

### Development Dependencies

| Package | Version | Deskripsi |
|---------|---------|-----------|
| `typescript` | ^5 | TypeScript compiler |
| `tailwindcss` | ^4 | Utility-first CSS framework |
| `@tailwindcss/postcss` | ^4 | Tailwind CSS PostCSS plugin |
| `postcss` | (via @tailwindcss/postcss) | Tool untuk transformasi CSS |
| `eslint` | ^9 | JavaScript linter |
| `eslint-config-next` | 15.5.6 | ESLint config khusus Next.js |
| `@eslint/eslintrc` | ^3 | ESLint config module |
| `@types/react` | ^19 | TypeScript types untuk React |
| `@types/react-dom` | ^19 | TypeScript types untuk React DOM |
| `@types/node` | ^20 | TypeScript types untuk Node.js |
| `tw-animate-css` | ^1.4.0 | Tailwind CSS animation utilities |

---

## 🎨 Design System

### Tipografi

#### Font Family
```
Family: Nunito Sans
Weight: 400 (Regular), 700 (Bold)
Source: Google Fonts
```

#### Heading Styles

| Class | Font Size | Font Weight | Line Height | Penggunaan |
|-------|-----------|------------|------------|-----------|
| `.heading-lg` | 32px | 400 | 44px | Large headings |
| `.heading-lg-bold` | 32px | 700 | 44px | Large bold headings |
| `.heading-md` | 24px | 400 | 36px | Medium headings |
| `.heading-md-bold` | 24px | 700 | 36px | Medium bold headings |
| `.heading-sm` | 20px | 400 | 32px | Small headings |
| `.heading-sm-bold` | 20px | 700 | 32px | Small bold headings |

#### Body Text Styles

| Class | Font Size | Font Weight | Line Height |
|-------|-----------|------------|------------|
| `.text-display` | 48px | 700 | 64px |
| `.text-lg` | 16px | 400 | 28px |
| `.text-lg-bold` | 16px | 700 | 28px |
| `.text-base` | 14px | 400 | 24px |
| `.text-base-bold` | 14px | 700 | 24px |
| `.text-sm` | 14px | 400 | 24px |
| `.text-sm-bold` | 14px | 700 | 24px |
| `.text-xs` | 12px | 400 | 20px |
| `.text-xs-bold` | 12px | 700 | 20px |

### Color Palette

#### Neutral Colors (Grayscale)

| Variable | Hex | Nama |
|----------|-----|------|
| `--color-neutral-100` | #1d1f20 | Darkest (Almost Black) |
| `--color-neutral-90` | #404040 | Dark Gray |
| `--color-neutral-80` | #616161 | Gray |
| `--color-neutral-70` | #757575 | Medium Gray |
| `--color-neutral-60` | #9e9e9e | Light Gray |
| `--color-neutral-50` | #c2c2c2 | Lighter Gray |
| `--color-neutral-40` | #e0e0e0 | Very Light Gray |
| `--color-neutral-30` | #ededed | Almost White |
| `--color-neutral-20` | #fafafa | Very Very Light |
| `--color-neutral-10` | #ffffff | White |

#### Primary Color (Teal)

| Variable | Hex | Penggunaan |
|----------|-----|-----------|
| `--color-primary` | #01959f | Main color |
| `--color-primary-surface` | #f7feff | Light background |
| `--color-primary-border` | #4db5bc | Border color |
| `--color-primary-hover` | #01777f | Hover state |
| `--color-primary-pressed` | #146166 | Active/Pressed state |
| `--color-primary-focus` | rgba(1, 149, 159, 0.2) | Focus ring color |

#### Secondary Color (Yellow/Gold)

| Variable | Hex | Penggunaan |
|----------|-----|-----------|
| `--color-secondary` | #fbc037 | Main secondary color |
| `--color-secondary-surface` | #fffcf5 | Light background |
| `--color-secondary-border` | #feeabc | Border color |
| `--color-secondary-hover` | #f8a92f | Hover state |
| `--color-secondary-pressed` | #fa9810 | Active/Pressed state |
| `--color-secondary-focus` | rgba(251, 192, 55, 0.2) | Focus ring color |

#### Semantic Colors

##### Danger (Red)
```
--color-danger: #e11428
--color-danger-surface: #fffafa
--color-danger-border: #f5b1b7
--color-danger-hover: #bc1121
--color-danger-pressed: #710a14
--color-danger-focus: rgba(225, 20, 40, 0.2)
```

##### Warning (Orange)
```
--color-warning: #ca7336
--color-warning-surface: #fcf7f3
--color-warning-border: #feb17b
--color-warning-hover: #b1652f
--color-warning-pressed: #985628
--color-warning-focus: rgba(202, 115, 54, 0.2)
```

##### Success (Green)
```
--color-success: #43936c
--color-success-surface: #f8fbf9
--color-success-border: #b8dbca
--color-success-hover: #367a59
--color-success-pressed: #20573d
--color-success-focus: rgba(67, 147, 108, 0.2)
```

### Spacing

```
Base Unit: 0.25rem (4px)
Multiples: 0.5rem (2x), 0.75rem (3x), 1rem (4x), dst...
```

### Shadow Utilities

| Class | Deskripsi |
|-------|-----------|
| `.shadow-input` | `inset 1px 2px 2px rgba(0, 0, 0, 0.12)` - Input shadow |
| `.shadow-button` | `0px 1px 2px rgba(0, 0, 0, 0.12)` - Button shadow |
| `.shadow-modal` | `0px 4px 8px rgba(0, 0, 0, 0.1)` - Modal/Dropdown shadow |

### Gradient Utilities

| Class | Deskripsi |
|-------|-----------|
| `.bg-gradient-primary` | Linear gradient: #fbc037 → #ffe76b |
| `.bg-gradient-secondary` | Linear gradient: transparent → #fffcf5 |

---

## 🧩 UI Components

### Button Component
**File:** `src/components/ui/button.tsx`

#### Props Interface
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}
```

#### Variants
- **primary**: Background primary color dengan text white, hover dan active states
- **secondary**: Background secondary (yellow) dengan text dark gray
- **outline**: Bordered style dengan transparent background

#### Sizes
- **sm**: Height 7, padding-x 4, font-size text-sm-bold
- **md**: Height 8, padding-x 4, font-size text-base-bold (default)
- **lg**: Height 10, padding-x 4, font-size text-lg-bold

#### Features
- Accessible dengan Radix Slot integration
- Support leading dan trailing icons
- Shadow dan transition effects
- Disabled state styling
- Focus-visible outline

#### Cara Pakai

```tsx
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";

// Basic button
<Button>Click me</Button>

// Dengan variant dan size
<Button variant="primary" size="lg">
  Large Primary Button
</Button>

<Button variant="secondary" size="md">
  Secondary Button
</Button>

<Button variant="outline" size="sm">
  Outline Button
</Button>

// Dengan leading icon
<Button variant="primary" leadingIcon={<Plus className="size-4" />}>
  Add New
</Button>

// Dengan trailing icon
<Button variant="primary" trailingIcon={<ArrowRight className="size-4" />}>
  Next
</Button>

// Dengan disabled state
<Button disabled>Disabled Button</Button>

// Dengan onClick handler
<Button onClick={() => console.log("Clicked!")}>
  Click Handler
</Button>

// Sebagai link dengan asChild
import Link from "next/link";
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

---

### Input Component
**File:** `src/components/ui/input.tsx`

#### Props Interface
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  helperText?: string;
  label?: string;
  maxLength?: number;
  showCounter?: boolean;
  error?: boolean;
  success?: boolean;
  required?: boolean;
}
```

#### Features
- Label support dengan required indicator (*)
- Helper text dengan dynamic color (error, success, default)
- Character counter (optional)
- Leading dan trailing icon support
- Error dan success state styling
- Input shadow effect
- Disabled state support
- Caret color primary

#### Cara Pakai

```tsx
import { Input } from "@/components/ui/input";
import { Mail, Eye } from "lucide-react";
import { useState } from "react";

// Basic input
const [email, setEmail] = useState("");
<Input
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Dengan label
<Input
  label="Email Address"
  placeholder="your@email.com"
  required
/>

// Dengan leading icon
<Input
  label="Email"
  leadingIcon={<Mail className="size-4" />}
  placeholder="user@example.com"
/>

// Dengan trailing icon
<Input
  type="password"
  label="Password"
  trailingIcon={<Eye className="size-4" />}
  placeholder="Enter password"
/>

// Dengan helper text
<Input
  label="Username"
  placeholder="username"
  helperText="3-20 characters, alphanumeric only"
/>

// Dengan character counter
<Input
  label="Bio"
  placeholder="Tell us about yourself"
  maxLength={100}
  showCounter={true}
/>

// Error state
<Input
  label="Username"
  error={true}
  helperText="Username already taken"
/>

// Success state
<Input
  label="Username"
  success={true}
  value="john_doe"
  helperText="Username available!"
/>

// Disabled state
<Input
  label="Account ID"
  value="ACC-12345"
  disabled
/>

// Semua kombinasi
<Input
  type="text"
  label="Full Name"
  placeholder="Enter full name"
  leadingIcon={<User className="size-4" />}
  maxLength={50}
  showCounter={true}
  helperText="First and last name"
  required
/>
```

---

### Textarea Component
**File:** `src/components/ui/textarea.tsx`

#### Props Interface
```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  helperText?: string;
  label?: string;
  maxLength?: number;
  showCounter?: boolean;
  error?: boolean;
  success?: boolean;
  required?: boolean;
}
```

#### Features
- Similar to Input component
- No resize (resize-none)
- Minimum height: min-h-22
- Multi-line text support
- Same validation styling

#### Cara Pakai

```tsx
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// Basic textarea
const [message, setMessage] = useState("");
<Textarea
  placeholder="Enter your message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>

// Dengan label
<Textarea
  label="Description"
  placeholder="Describe the issue..."
  required
/>

// Dengan helper text
<Textarea
  label="Feedback"
  placeholder="Your feedback is valuable"
  helperText="Please be specific and constructive"
/>

// Dengan character counter
<Textarea
  label="Comment"
  placeholder="Write your comment here"
  maxLength={500}
  showCounter={true}
/>

// Error state
<Textarea
  label="Message"
  error={true}
  helperText="Message must be at least 10 characters"
/>

// Success state
<Textarea
  label="Application Text"
  success={true}
  value="Thank you for considering my application..."
  helperText="Application text is complete"
/>

// Disabled state
<Textarea
  label="Previous Response"
  value="This was your previous response..."
  disabled
/>

// Kombinasi lengkap
<Textarea
  label="Biography"
  placeholder="Tell us about yourself..."
  maxLength={1000}
  showCounter={true}
  helperText="Maximum 1000 characters"
  required
/>
```

---

### Select Component
**File:** `src/components/ui/select.tsx`

#### Props Interface
```typescript
interface SelectProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  required?: boolean;
  leadingIcon?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}
```

#### Features
- Built on Radix UI Select primitive
- Custom trigger dengan leading icon support
- Animated dropdown (fade in/zoom in)
- Chevron icon dengan rotation animation
- Error dan success states
- Disabled state
- Portal untuk dropdown content
- Helper text support

#### Cara Pakai

```tsx
import { Select } from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

// Basic select
const [education, setEducation] = useState("");
<Select
  placeholder="Select education level"
  value={education}
  onValueChange={setEducation}
>
  <SelectPrimitive.Item value="highschool">
    <SelectPrimitive.ItemText>High School</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
  <SelectPrimitive.Item value="bachelor">
    <SelectPrimitive.ItemText>Bachelor's Degree</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
  <SelectPrimitive.Item value="master">
    <SelectPrimitive.ItemText>Master's Degree</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
</Select>

// Dengan label
<Select
  label="Position"
  placeholder="Choose position"
  value={position}
  onValueChange={setPosition}
>
  <SelectPrimitive.Item value="dev">
    <SelectPrimitive.ItemText>Developer</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
  <SelectPrimitive.Item value="designer">
    <SelectPrimitive.ItemText>Designer</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
</Select>

// Dengan leading icon
<Select
  label="Education"
  placeholder="Select level"
  leadingIcon={<GraduationCap className="size-4" />}
  value={level}
  onValueChange={setLevel}
>
  {/* options */}
</Select>

// Dengan helper text
<Select
  label="Country"
  placeholder="Select your country"
  helperText="Required for tax purposes"
  required
  value={country}
  onValueChange={setCountry}
>
  {/* country options */}
</Select>

// Error state
<Select
  label="Department"
  error={true}
  helperText="Please select a department"
  placeholder="Select department"
  value={dept}
  onValueChange={setDept}
>
  {/* options */}
</Select>

// Success state
<Select
  label="Department"
  success={true}
  value="engineering"
  placeholder="Select department"
>
  <SelectPrimitive.Item value="engineering">
    <SelectPrimitive.ItemText>Engineering</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
</Select>

// Disabled state
<Select
  label="Region"
  disabled
  placeholder="Select region"
  value="asia"
>
  <SelectPrimitive.Item value="asia">
    <SelectPrimitive.ItemText>Asia</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
</Select>

// Kombinasi lengkap
<Select
  label="Employment Type"
  placeholder="Choose employment type"
  leadingIcon={<Briefcase className="size-4" />}
  helperText="Select your preferred employment type"
  required
  value={empType}
  onValueChange={setEmpType}
>
  <SelectPrimitive.Item value="fulltime">
    <SelectPrimitive.ItemText>Full-time</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
  <SelectPrimitive.Item value="parttime">
    <SelectPrimitive.ItemText>Part-time</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
  <SelectPrimitive.Item value="contract">
    <SelectPrimitive.ItemText>Contract</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
</Select>
```

---

### Label Component
**File:** `src/components/ui/label.tsx`

#### Props Interface
```typescript
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}
```

#### Features
- Text size: text-xs (12px)
- Font weight: normal (400)
- Color: text-neutral-90
- Required indicator: red asterisk (*)

#### Cara Pakai

```tsx
import { Label } from "@/components/ui/label";

// Basic label
<Label htmlFor="username">Username</Label>

// Dengan required indicator
<Label htmlFor="email" required>Email Address</Label>

// Standalone label dengan custom className
<Label className="text-primary font-bold">Special Label</Label>

// Biasanya digunakan dengan input
<div className="flex flex-col gap-2">
  <Label htmlFor="name" required>Full Name</Label>
  <input id="name" type="text" placeholder="Enter your name" />
</div>

// Note: Biasanya Label digunakan via Input, Textarea, Select components
// yang mana mereka sudah menyediakan label prop
```

---

### Dialog/Modal Component
**File:** `src/components/ui/dialog.tsx`

#### Components
```typescript
Dialog // Root component
DialogTrigger // Trigger element
DialogPortal // Portal container
DialogClose // Close button
DialogOverlay // Dark overlay
DialogContent // Main content area
DialogHeader // Header section
DialogFooter // Footer section
DialogTitle // Title element
DialogDescription // Description element
```

#### Features
- Built on Radix UI Dialog primitive
- Animated overlay (fade in/out)
- Animated content (slide in/out)
- Close button dengan X icon
- Backdrop click to close
- Keyboard escape support
- Focus management

#### Cara Pakai

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Basic dialog
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>This is a dialog description</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      Dialog content goes here
    </div>
  </DialogContent>
</Dialog>

// Dialog dengan controlled state
const [open, setOpen] = useState(false);
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Confirmation</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure you want to proceed?</DialogDescription>
    </DialogHeader>
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => {
        // Handle confirmation
        setOpen(false);
      }}>
        Confirm
      </Button>
    </div>
  </DialogContent>
</Dialog>

// Dialog dengan form
<Dialog>
  <DialogTrigger asChild>
    <Button>Create User</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New User</DialogTitle>
    </DialogHeader>
    <form onSubmit={(e) => {
      e.preventDefault();
      // Handle form submission
    }}>
      <Input label="Name" placeholder="Enter name" />
      <Input label="Email" type="email" placeholder="Enter email" />
      <div className="flex gap-2 justify-end mt-4">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Create</Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

// Dialog dengan custom close button
<Dialog>
  <DialogTrigger asChild>
    <Button>Info</Button>
  </DialogTrigger>
  <DialogContent>
    <div className="flex justify-between items-start">
      <DialogHeader>
        <DialogTitle>Information</DialogTitle>
      </DialogHeader>
      <DialogClose asChild>
        <Button variant="outline" size="sm">
          ✕
        </Button>
      </DialogClose>
    </div>
    <p>Your information here</p>
  </DialogContent>
</Dialog>
```

---

### Chip Component
**File:** `src/components/ui/chip.tsx`

#### Props Interface
```typescript
interface ChipProps {
  label: string;
  state?: "active" | "rest";
  disabled?: boolean;
  className?: string;
}
```

#### States
- **rest**: White background, border neutral-40, text neutral-90
- **active**: White background, border primary, text primary
- **disabled**: Neutral-30 background, text neutral-60, opacity 60%

#### Features
- Inline-flex display
- Padding: px-3 py-1
- Height: 8
- Border radius: full
- Text truncate support

#### Cara Pakai

```tsx
import { Chip } from "@/components/ui/chip";
import { useState } from "react";

// Basic chip
<Chip label="React" />

// Active state
<Chip label="TypeScript" state="active" />

// Disabled state
<Chip label="Disabled" disabled />

// Multiple chips (tag-like usage)
const [selectedSkills, setSelectedSkills] = useState(["React", "TypeScript"]);
<div className="flex flex-wrap gap-2">
  {["React", "TypeScript", "Next.js", "Tailwind"].map((skill) => (
    <Chip
      key={skill}
      label={skill}
      state={selectedSkills.includes(skill) ? "active" : "rest"}
    />
  ))}
</div>

// Chip dengan onClick handler (wrapper element)
const [selected, setSelected] = useState(false);
<div 
  onClick={() => setSelected(!selected)}
  className="cursor-pointer"
>
  <Chip 
    label="Click me" 
    state={selected ? "active" : "rest"}
  />
</div>

// Chip dengan custom className
<Chip 
  label="Custom Styled" 
  state="active"
  className="text-lg"
/>

// Filter tags
const [filters, setFilters] = useState<string[]>([]);
const tags = ["Frontend", "Backend", "Mobile", "DevOps"];
<div className="space-y-4">
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <div
        key={tag}
        onClick={() => {
          setFilters(prev =>
            prev.includes(tag)
              ? prev.filter(t => t !== tag)
              : [...prev, tag]
          );
        }}
        className="cursor-pointer"
      >
        <Chip
          label={tag}
          state={filters.includes(tag) ? "active" : "rest"}
        />
      </div>
    ))}
  </div>
  <p>Selected: {filters.join(", ")}</p>
</div>
```

---

### Radio Button Component
**File:** `src/components/ui/radio-button.tsx`

#### Props Interface
```typescript
interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
}
```

#### Features
- Custom radio circle styling
- Border: 2px solid #404040
- Inner circle saat checked
- Smooth transitions
- Flex layout dengan gap

#### Cara Pakai

```tsx
import { RadioButton } from "@/components/ui/radio-button";
import { useState } from "react";

// Basic radio button
<RadioButton label="Option 1" />

// Radio group untuk mutually exclusive options
const [selectedOption, setSelectedOption] = useState("option1");
<div className="flex flex-col gap-3">
  <label className="flex items-center gap-2 cursor-pointer">
    <RadioButton
      id="opt1"
      name="options"
      value="option1"
      checked={selectedOption === "option1"}
      onChange={(e) => setSelectedOption(e.target.value)}
    />
    <span>Option 1</span>
  </label>
  <label className="flex items-center gap-2 cursor-pointer">
    <RadioButton
      id="opt2"
      name="options"
      value="option2"
      checked={selectedOption === "option2"}
      onChange={(e) => setSelectedOption(e.target.value)}
    />
    <span>Option 2</span>
  </label>
  <label className="flex items-center gap-2 cursor-pointer">
    <RadioButton
      id="opt3"
      name="options"
      value="option3"
      checked={selectedOption === "option3"}
      onChange={(e) => setSelectedOption(e.target.value)}
    />
    <span>Option 3</span>
  </label>
</div>

// Employment type selection
const [empType, setEmpType] = useState("fulltime");
<fieldset className="border border-neutral-40 p-4 rounded-lg">
  <legend className="text-sm-bold text-neutral-100">Employment Type</legend>
  <div className="flex flex-col gap-3 mt-3">
    {["fulltime", "parttime", "contract"].map((type) => (
      <label key={type} className="flex items-center gap-2 cursor-pointer">
        <RadioButton
          name="employment"
          value={type}
          checked={empType === type}
          onChange={(e) => setEmpType(e.target.value)}
        />
        <span>{type.replace(/([a-z])([A-Z])/g, "$1 $2")}</span>
      </label>
    ))}
  </div>
</fieldset>

// Gender selection
const [gender, setGender] = useState("not-specified");
<div className="space-y-2">
  <p className="text-xs text-neutral-90">Gender</p>
  <div className="flex gap-4">
    {["male", "female", "not-specified"].map((opt) => (
      <label key={opt} className="flex items-center gap-2 cursor-pointer">
        <RadioButton
          name="gender"
          value={opt}
          checked={gender === opt}
          onChange={(e) => setGender(e.target.value)}
        />
        <span className="capitalize">{opt.replace("-", " ")}</span>
      </label>
    ))}
  </div>
</div>

// Disabled state
<label className="flex items-center gap-2 cursor-not-allowed opacity-50">
  <RadioButton
    disabled
    checked={true}
  />
  <span>This option is not available</span>
</label>
```

---

### Phone Input Component
**File:** `src/components/ui/phone-input.tsx`

#### Props Interface
```typescript
interface PhoneInputProps {
  value: { code: string; number: string };
  onChange: (value: PhoneInputValue) => void;
  label?: string;
  error?: boolean;
  success?: boolean;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}
```

#### Features
- Country code selector dengan Radix Popover
- Search functionality untuk countries
- Dynamic country data loading
- Flag images untuk countries
- Phone number input
- Helper text dan validation states
- Error dan success styling

#### Cara Pakai

```tsx
import { PhoneInput } from "@/components/ui/phone-input";
import { useState } from "react";

// Basic phone input
const [phone, setPhone] = useState({ code: "+62", number: "" });
<PhoneInput
  value={phone}
  onChange={setPhone}
  label="Phone Number"
/>

// Dengan placeholder
<PhoneInput
  value={phone}
  onChange={setPhone}
  label="Contact Phone"
  placeholder="Enter phone number"
/>

// Dengan helper text
<PhoneInput
  value={phone}
  onChange={setPhone}
  label="Mobile Number"
  helperText="Gunakan format tanpa spasi atau dash"
  required
/>

// Error state (validation failed)
const [phoneError, setPhoneError] = useState(false);
<PhoneInput
  value={phone}
  onChange={setPhone}
  label="Emergency Contact"
  error={phoneError}
  helperText={phoneError ? "Please enter a valid phone number" : ""}
  onBlur={() => {
    // Validate phone number
    if (phone.number.length < 9) {
      setPhoneError(true);
    }
  }}
/>

// Success state (validated)
<PhoneInput
  value={{ code: "+62", number: "812345678" }}
  onChange={setPhone}
  label="Phone"
  success={true}
/>

// Disabled state
<PhoneInput
  value={{ code: "+62", number: "800000000" }}
  onChange={setPhone}
  label="Account Phone"
  disabled
/>

// Kombinasi lengkap dengan form handling
const [phoneData, setPhoneData] = useState({ code: "+62", number: "" });
const [phoneValid, setPhoneValid] = useState(false);

<form onSubmit={(e) => {
  e.preventDefault();
  // Handle form submission
}}>
  <PhoneInput
    value={phoneData}
    onChange={(newPhone) => {
      setPhoneData(newPhone);
      // Validate: code + number should be at least 10 chars
      const isValid = newPhone.code.length > 0 && newPhone.number.length >= 9;
      setPhoneValid(!isValid);
    }}
    label="Phone Number"
    required
    error={phoneValid}
    helperText={phoneValid ? "Please enter a valid phone number" : ""}
  />
  <button type="submit" className="mt-4">Submit</button>
</form>
```

---

### Table Component
**File:** `src/components/ui/table.tsx`

#### Props Interface
```typescript
interface TableColumn<T> {
  key: keyof T;
  label: string;
  width?: string | number;
  render?: (value: T[keyof T], row: T, rowIndex: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  isFixed?: boolean; // First column only
}

interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T;
  containerClassName?: string;
  rowClassName?: string;
  hoverable?: boolean;
  onRowClick?: (row: T, rowIndex: number) => void;
  emptyMessage?: string;
  loading?: boolean;
  loadingRows?: number;
}
```

#### Features
- Fixed first column saat horizontal scroll
- Custom column rendering
- Hover effects
- Striped rows
- Empty state handling
- Loading skeleton support
- Row click handling
- Full responsiveness

#### Cara Pakai

```tsx
import { Table, type TableColumn } from "@/components/ui/table";
import { useState } from "react";

// Define table type
interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  joinDate: string;
}

// Define columns
const columns: TableColumn<User>[] = [
  {
    key: "name",
    label: "Name",
    width: "200px",
    isFixed: true,
  },
  {
    key: "email",
    label: "Email",
    width: "250px",
  },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`px-3 py-1 rounded-full text-xs-bold ${
          value === "active"
            ? "bg-success/20 text-success"
            : "bg-danger/20 text-danger"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    key: "joinDate",
    label: "Join Date",
  },
];

// Sample data
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "inactive",
    joinDate: "2024-03-10",
  },
];

// Basic table
<Table
  columns={columns}
  data={users}
  rowKey="id"
/>

// Table dengan row click handler
const [selectedUser, setSelectedUser] = useState<User | null>(null);
<Table
  columns={columns}
  data={users}
  rowKey="id"
  onRowClick={(user) => setSelectedUser(user)}
/>

// Table dengan empty message
<Table
  columns={columns}
  data={[]}
  rowKey="id"
  emptyMessage="No users found"
/>

// Table dengan loading state
const [isLoading, setIsLoading] = useState(false);
<Table
  columns={columns}
  data={users}
  rowKey="id"
  loading={isLoading}
  loadingRows={5}
/>

// Table dengan custom row styling
<Table
  columns={columns}
  data={users}
  rowKey="id"
  rowClassName="hover:bg-primary/5"
/>

// Table dengan actions column
const actionsColumn: TableColumn<User> = {
  key: "id",
  label: "Actions",
  render: (value, row) => (
    <div className="flex gap-2">
      <button
        className="text-primary hover:underline"
        onClick={() => console.log("Edit", row)}
      >
        Edit
      </button>
      <button
        className="text-danger hover:underline"
        onClick={() => console.log("Delete", row)}
      >
        Delete
      </button>
    </div>
  ),
};

const columnsWithActions: TableColumn<User>[] = [...columns, actionsColumn];
<Table
  columns={columnsWithActions}
  data={users}
  rowKey="id"
/>

// Table dengan custom cell rendering
const customColumns: TableColumn<User>[] = [
  {
    key: "name",
    label: "Name",
    width: "200px",
    isFixed: true,
    render: (value) => <span className="font-bold">{value}</span>,
  },
  {
    key: "email",
    label: "Email",
    width: "250px",
    render: (value) => (
      <a href={`mailto:${value}`} className="text-primary hover:underline">
        {value}
      </a>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span className={value === "active" ? "text-success" : "text-warning"}>
        {value.toUpperCase()}
      </span>
    ),
  },
];

<Table
  columns={customColumns}
  data={users}
  rowKey="id"
/>
```

---

### Calendar Component
**File:** `src/components/ui/calendar/calendar.tsx`

#### Props Interface
```typescript
interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  isOpen?: boolean;
}
```

#### Views
- **day**: Daily calendar view
- **month**: Month selection
- **year**: Year selection
- **decade**: Decade selection

#### Features
- Smart positioning (bottom/top based on viewport space)
- Navigation controls:
  - Double chevron: Change decade/year/decade
  - Single chevron: Change month/year/decade
- Responsive design
- Custom styling via calendar.css

#### Cara Pakai

```tsx
import { Calendar } from "@/components/ui/calendar/calendar";
import { useState } from "react";

// Basic calendar
const [date, setDate] = useState<Date | null>(null);
<Calendar
  selectedDate={date}
  onDateChange={setDate}
/>

// Calendar dengan display
<div className="flex gap-4">
  <Calendar
    selectedDate={date}
    onDateChange={setDate}
    isOpen={true}
  />
  {date && <p>Selected: {date.toLocaleDateString()}</p>}
</div>
```

---

### Datepicker Component
**File:** `src/components/ui/calendar/datepicker.tsx`

Wrapper component yang menggunakan Calendar untuk date selection.

#### Cara Pakai

```tsx
import { Datepicker } from "@/components/ui/calendar/datepicker";
import { useState } from "react";

// Datepicker (implementation tergantung dari datepicker.tsx)
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
<Datepicker
  value={selectedDate}
  onChange={setSelectedDate}
/>
```

---

## 🎭 Feature Components
---

### Profile Image Uploader
**File:** `src/components/feature/gesture/profile-image-uploader.tsx`

Component untuk upload profil image dengan gesture capture alternative.

#### Cara Pakai (Expected Usage)

```tsx
import { ProfileImageUploader } from "@/components/feature/gesture/profile-image-uploader";

// Basic usage
<ProfileImageUploader
  onImageUpload={(image) => {
    console.log("Image uploaded:", image);
    // Handle uploaded image
  }}
/>

// Dalam form/profile page
<form>
  <ProfileImageUploader
    onImageUpload={(imageData) => {
      // Save to state or send to backend
    }}
  />
  <button type="submit">Save Profile</button>
</form>
```

---

## 🎯 Custom Hooks

### useGestureCapture
**File:** `src/hooks/useGestureCapture.ts`

#### State Interface
```typescript
interface GestureCaptureState {
  scriptsLoaded: boolean;
  status: string;
  isLoading: boolean;
  error: string | null;
  model: any;
  gestureEstimator: any;
  boundingBox: any;
  currentPose: string | null;
  countdown: number;
  capturedImage: string | null;
  isDelaying: boolean;
}
```

#### Actions Interface
```typescript
interface GestureCaptureActions {
  onScriptsLoaded: () => void;
  handleRetake: () => void;
  handleSubmit: (onSubmit: (image: string) => void) => void;
}
```

#### Features
- TensorFlow Handpose model loading
- Hand pose detection
- FingerPose gesture estimation
- Webcam stream management
- Image capture logic
- Countdown management
- Error handling

#### Cara Pakai

```tsx
import { useGestureCapture } from "@/hooks/useGestureCapture";

// Dalam GestureCaptureModal
export default function GestureCaptureModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (image: string) => void;
}) {
  const { state, actions, refs } = useGestureCapture();

  return (
    <div>
      {/* Video element */}
      <video
        ref={refs.videoRef}
        style={{ display: "none" }}
        autoPlay
        playsInline
      />

      {/* Canvas for capture */}
      <canvas
        ref={refs.canvasRef}
        style={{ display: "none" }}
      />

      {/* Drawing canvas for pose visualization */}
      <canvas
        ref={refs.drawingCanvasRef}
        className="w-full"
      />

      {/* Display current state */}
      <div>
        <p>Status: {state.status}</p>
        <p>Current Pose: {state.currentPose}</p>
        {state.countdown > 0 && <p>Countdown: {state.countdown}</p>}
        {state.error && <p className="text-danger">{state.error}</p>}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={actions.handleRetake}>
          Retake
        </button>
        <button onClick={() => actions.handleSubmit(onSubmit)}>
          Confirm
        </button>
      </div>
    </div>
  );
}
```

---

## 📸 Assets (Gambar)

### Gesture Pose Images
**Location:** `public/img/pose/`

| File | Penggunaan |
|------|-----------|
| `1.svg` | One finger pose (inactive state) |
| `1-success.svg` | One finger pose (success/active state) |
| `2.svg` | Victory/two fingers pose (inactive) |
| `2-success.svg` | Victory pose (success/active) |
| `3.svg` | Three fingers pose (inactive) |
| `3-success.svg` | Three fingers pose (success/active) |

#### Format
- SVG format untuk scalability
- Responsive sizing (w-16 h-16)
- Transition animations pada state change

---

## 🔧 Utilities

### cn() Function
**File:** `src/lib/utils.ts`

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### Purpose
- Merge Tailwind CSS classes intelligently
- Prevent class conflicts
- Handle conditional classes dengan clsx
- Merge overlapping utilities dengan tailwind-merge

#### Usage
```typescript
cn(
  "px-4 py-2 bg-primary",
  condition && "bg-secondary",
  "px-6" // akan merge dengan px-4 (px-6 wins)
)
```

---

## 🌐 Services

### useGetCountry
**File:** `src/service/useGetCountry.ts`

Hook/service untuk fetch country data dengan dial codes untuk PhoneInput component.

```typescript
interface Country {
  name: string;
  dial_code: string;
  // ... other properties
}

export function getCountries(): Promise<Country[]>
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css (Design system & theme definitions)
│   ├── layout.tsx
│   ├── page.tsx
│   └── tes/
│       └── page.tsx (Testing page)
├── components/
│   ├── feature/
│   │   └── gesture/
│   │       ├── gesture-capture-modal.tsx
│   │       ├── gesture-overlay.tsx
│   │       ├── pose-sequence.tsx
│   │       └── profile-image-uploader.tsx
│   └── ui/
│       ├── button.tsx
│       ├── chip.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── phone-input.tsx
│       ├── radio-button.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── textarea.tsx
│       └── calendar/
│           ├── calendar.css
│           ├── calendar.tsx
│           └── datepicker.tsx
├── hooks/
│   └── useGestureCapture.ts
├── lib/
│   └── utils.ts
├── service/
│   └── useGetCountry.ts
└── types/

public/
└── img/
    └── pose/
        ├── 1.svg
        ├── 1-success.svg
        ├── 2.svg
        ├── 2-success.svg
        ├── 3.svg
        └── 3-success.svg
```

---

## 🎯 Component Usage Guidelines

### State Management
- Gunakan `useState` untuk local component state
- Utilize custom hooks untuk reusable logic
- Keep state as close to where it's used as possible

### Styling
- Use Tailwind CSS utilities sebagai first choice
- Apply custom classes melalui `cn()` utility
- Combine variants menggunakan `class-variance-authority` (CVA)
- Maintain consistency dengan design system colors

### Accessibility
- Gunakan semantic HTML elements
- Add proper ARIA attributes
- Test dengan keyboard navigation
- Ensure color contrast compliance

### Performance
- Memoize expensive computations dengan `useMemo`
- Use `React.forwardRef` untuk component composition
- Lazy load external scripts (gesture models)
- Optimize image assets (SVG untuk icons/poses)

---

## 📝 Notes for AI Agents

Ketika AI agents membaca dokumentasi ini, mereka dapat:
1. ✅ Memahami structure lengkap dari semua components yang tersedia
2. ✅ Mengikuti design system yang sudah established
3. ✅ Menggunakan imported assets dengan path yang benar
4. ✅ Mengetahui dependencies mana yang tersedia
5. ✅ Menjaga consistency dalam styling dan component API
6. ✅ Mengoptimalkan performance menggunakan best practices yang sudah diterapkan

---

**Last Updated:** October 2025  
**Framework:** Next.js 15.5.6 + React 19.1.0 + TypeScript 5
