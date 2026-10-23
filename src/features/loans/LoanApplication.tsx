import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Upload,
  UserRound,
  BriefcaseBusiness,
  Banknote,
  Home,
  Car,
  GraduationCap,
  Wallet,
  X,
  Moon,
  Sun,
  Languages,
} from "lucide-react";
import { usePreferences } from "../../context/PreferencesContext";

export type LoanType =
  | "Personal Loan"
  | "Home Loan"
  | "Vehicle Loan"
  | "Education Loan";

type ApplicationData = {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  employmentType: string;
  employer: string;
  monthlyIncome: string;
  existingEmi: string;
  loanType: LoanType;
  loanAmount: string;
  tenure: string;
};

const initialData: ApplicationData = {
  fullName: "",
  dob: "",
  email: "",
  phone: "",
  address: "",
  employmentType: "Salaried",
  employer: "",
  monthlyIncome: "",
  existingEmi: "0",
  loanType: "Personal Loan",
  loanAmount: "500000",
  tenure: "36",
};

const loanOptions: {
  name: LoanType;
  rate: number;
  maxAmount: number;
  maxTenure: number;
  icon: typeof Wallet;
}[] = [
  {
    name: "Personal Loan",
    rate: 10.5,
    maxAmount: 2500000,
    maxTenure: 60,
    icon: Wallet,
  },
  {
    name: "Home Loan",
    rate: 8.35,
    maxAmount: 10000000,
    maxTenure: 360,
    icon: Home,
  },
  {
    name: "Vehicle Loan",
    rate: 9.25,
    maxAmount: 3000000,
    maxTenure: 84,
    icon: Car,
  },
  {
    name: "Education Loan",
    rate: 8.75,
    maxAmount: 5000000,
    maxTenure: 180,
    icon: GraduationCap,
  },
];

const steps = [
  { label: "Personal details", icon: UserRound },
  { label: "Employment", icon: BriefcaseBusiness },
  { label: "Loan details", icon: Banknote },
  { label: "Documents", icon: FileText },
  { label: "Review", icon: ClipboardCheck },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "block text-sm font-medium text-slate-700";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className={labelClass}>
      {label}
      {children}
    </label>
  );
}

export default function LoanApplication({
  onBack,
  initialLoanType = "Personal Loan",
}: {
  onBack?: () => void;
  initialLoanType?: LoanType;
}) {
  const { theme, language, setLanguage, toggleTheme } = usePreferences();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ApplicationData>({
    ...initialData,
    loanType: initialLoanType,
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState("");

  const selectedLoan =
    loanOptions.find((loan) => loan.name === data.loanType) ?? loanOptions[0];

  const amount = Number(data.loanAmount) || 0;
  const tenure = Number(data.tenure) || 0;
  const rate = selectedLoan.rate / 1200;

  const emi = useMemo(() => {
    if (amount <= 0 || tenure <= 0) return 0;
    if (rate === 0) return amount / tenure;
    return (
      (amount * rate * Math.pow(1 + rate, tenure)) /
      (Math.pow(1 + rate, tenure) - 1)
    );
  }, [amount, tenure, rate]);

  const update = (field: keyof ApplicationData, value: string) => {
    setData((previous) => ({ ...previous, [field]: value }));
    setError("");
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    const valid = incoming.filter(
      (file) =>
        file.size <= 5 * 1024 * 1024 &&
        /\.(pdf|jpg|jpeg|png)$/i.test(file.name),
    );

    if (valid.length !== incoming.length) {
      setError("Use PDF, JPG or PNG files up to 5 MB each.");
    } else {
      setError("");
    }

    setDocuments((previous) =>
      [...previous, ...valid].filter(
        (file, index, all) =>
          all.findIndex(
            (candidate) =>
              candidate.name === file.name && candidate.size === file.size,
          ) === index,
      ),
    );

    event.target.value = "";
  };

  const validateStep = () => {
    if (step === 0) {
      if (
        !data.fullName.trim() ||
        !data.dob ||
        !data.email.trim() ||
        !data.phone.trim() ||
        !data.address.trim()
      ) {
        setError("Please complete all personal details.");
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        setError("Enter a valid email address.");
        return false;
      }

      if (!/^\d{10}$/.test(data.phone)) {
        setError("Enter a valid 10-digit mobile number.");
        return false;
      }

      const birthDate = new Date(`${data.dob}T00:00:00`);
      const today = new Date();
      const age =
        today.getFullYear() -
        birthDate.getFullYear() -
        (today <
        new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
          ? 1
          : 0);

      if (birthDate > today || age < 18) {
        setError("The applicant must be at least 18 years old.");
        return false;
      }
    }

    if (step === 1) {
      if (
        !data.monthlyIncome ||
        Number(data.monthlyIncome) <= 0 ||
        !data.existingEmi ||
        Number(data.existingEmi) < 0
      ) {
        setError("Enter a valid monthly income and existing EMI.");
        return false;
      }

      if (data.employmentType !== "Self-employed" && !data.employer.trim()) {
        setError("Please enter your employer or organization.");
        return false;
      }
    }

    if (step === 2) {
      if (
        amount <= 0 ||
        amount > selectedLoan.maxAmount ||
        tenure <= 0 ||
        tenure > selectedLoan.maxTenure
      ) {
        setError(
          `Enter a valid loan amount and tenure for this loan. Maximum amount: ${money(
            selectedLoan.maxAmount,
          )}; maximum tenure: ${selectedLoan.maxTenure} months.`,
        );
        return false;
      }
    }

    if (step === 3 && documents.length === 0) {
      setError("Please upload at least one supporting document for this demo.");
      return false;
    }

    setError("");
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((current) => Math.min(current + 1, 4));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep()) return;

    const reference = `KL-${Date.now().toString().slice(-8)}`;
    setApplicationId(reference);
  };

  if (applicationId) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={34} />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Demo submission successful
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Application submitted!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Your mock application has been submitted in this browser session.
            This is a demonstration reference, not a bank-issued application ID
            or a lending decision.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Demo reference ID
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {applicationId}
            </p>
            <div className="mt-4 flex items-start gap-3 text-sm text-slate-600">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-blue-600"
                size={20}
              />
              <p>
                Status: <strong>Submitted for demo review</strong>. No credit
                assessment or approval has taken place.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-4 text-left text-sm text-blue-900">
            <strong>Next step:</strong> Connect this workflow to Spring Boot to
            save applications, store documents securely and retrieve persistent
            application statuses.
          </div>

          <button
            type="button"
            onClick={() => onBack?.()}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <ArrowLeft size={16} /> Back to previous screen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#19477f] text-white">
              <ShieldCheck size={27} strokeWidth={2} />
            </div>

            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-900">
                Kestrel Bank
              </h1>
              <p className="mt-0.5 text-xs font-medium tracking-[0.18em] text-[#19477f]">
                LOANLENS AI
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2">
              <Languages size={17} className="shrink-0 text-slate-500" />
              <select
                aria-label="Language"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as "en" | "hi")
                }
                className="w-[76px] bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </label>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg bg-[#19477f] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123660] sm:px-4"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            CUSTOMER APPLICATION
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Let's get your application started.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Share the required details to prepare your loan application. You can
            review everything before submitting.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
            <div className="mb-8 grid grid-cols-5 gap-2">
              {steps.map((item, index) => {
                const Icon = item.icon;
                const completed = index < step;
                const active = index === step;

                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => {
                      if (index < step) {
                        setStep(index);
                        setError("");
                      }
                    }}
                    className="min-w-0 text-center"
                    aria-current={active ? "step" : undefined}
                    title={item.label}
                  >
                    <div
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl transition sm:h-11 sm:w-11 ${
                        completed
                          ? "bg-emerald-100 text-emerald-700"
                          : active
                            ? "bg-blue-700 text-white"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {completed ? <Check size={18} /> : <Icon size={18} />}
                    </div>
                    <p
                      className={`mt-2 hidden text-xs sm:block ${
                        active
                          ? "font-semibold text-blue-700"
                          : completed
                            ? "font-medium text-slate-700"
                            : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </p>
                    <div
                      className={`mt-2 h-1 rounded-full sm:hidden ${
                        completed || active ? "bg-blue-600" : "bg-slate-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={(event) => {
                if (step < 4) {
                  event.preventDefault();
                  next();
                } else {
                  submit(event);
                }
              }}
            >
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold">Personal information</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter the applicant's basic contact details.
                    </p>
                  </div>

                  <Field label="Full legal name">
                    <input
                      className={inputClass}
                      value={data.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      autoComplete="name"
                      placeholder="Enter your full name"
                      required
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Date of birth">
                      <input
                        className={inputClass}
                        type="date"
                        max={new Date().toISOString().slice(0, 10)}
                        value={data.dob}
                        onChange={(e) => update("dob", e.target.value)}
                        required
                      />
                    </Field>
                    <Field label="Mobile number">
                      <input
                        className={inputClass}
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={data.phone}
                        onChange={(e) =>
                          update("phone", e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="10-digit mobile number"
                        autoComplete="tel-national"
                        required
                      />
                    </Field>
                  </div>

                  <Field label="Email address">
                    <input
                      className={inputClass}
                      type="email"
                      value={data.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </Field>

                  <Field label="Current residential address">
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={data.address}
                      onChange={(e) => update("address", e.target.value)}
                      placeholder="House number, street, city, state and PIN code"
                      autoComplete="street-address"
                      required
                    />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold">Employment and income</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      These details help illustrate your monthly repayment
                      capacity.
                    </p>
                  </div>

                  <Field label="Employment type">
                    <select
                      className={inputClass}
                      value={data.employmentType}
                      onChange={(e) => update("employmentType", e.target.value)}
                    >
                      <option>Salaried</option>
                      <option>Self-employed</option>
                      <option>Business owner</option>
                      <option>Other</option>
                    </select>
                  </Field>

                  {data.employmentType !== "Self-employed" && (
                    <Field label="Employer / organization">
                      <input
                        className={inputClass}
                        value={data.employer}
                        onChange={(e) => update("employer", e.target.value)}
                        placeholder="Enter organization name"
                        required
                      />
                    </Field>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Monthly income (₹)">
                      <input
                        className={inputClass}
                        type="number"
                        min="1"
                        value={data.monthlyIncome}
                        onChange={(e) =>
                          update("monthlyIncome", e.target.value)
                        }
                        placeholder="e.g. 75000"
                        required
                      />
                    </Field>
                    <Field label="Existing monthly EMIs (₹)">
                      <input
                        className={inputClass}
                        type="number"
                        min="0"
                        value={data.existingEmi}
                        onChange={(e) => update("existingEmi", e.target.value)}
                        required
                      />
                    </Field>
                  </div>

                  {Number(data.monthlyIncome) > 0 && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-sm font-semibold text-blue-950">
                        Monthly income overview
                      </p>
                      <div className="mt-3 flex justify-between gap-3 text-sm">
                        <span className="text-slate-600">Income</span>
                        <strong>{money(Number(data.monthlyIncome))}</strong>
                      </div>
                      <div className="mt-2 flex justify-between gap-3 text-sm">
                        <span className="text-slate-600">Existing EMIs</span>
                        <strong>{money(Number(data.existingEmi) || 0)}</strong>
                      </div>
                      <div className="mt-3 border-t border-blue-100 pt-3">
                        <div className="flex justify-between gap-3 text-sm">
                          <span className="text-slate-600">
                            Income after existing EMIs
                          </span>
                          <strong>
                            {money(
                              Number(data.monthlyIncome) -
                                (Number(data.existingEmi) || 0),
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold">Loan requirements</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Choose your loan and adjust the amount and repayment
                      period.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {loanOptions.map((loan) => {
                      const Icon = loan.icon;
                      const selected = data.loanType === loan.name;

                      return (
                        <button
                          type="button"
                          key={loan.name}
                          onClick={() => {
                            update("loanType", loan.name);
                            update(
                              "loanAmount",
                              String(
                                Math.min(amount || 500000, loan.maxAmount),
                              ),
                            );
                            update(
                              "tenure",
                              String(Math.min(tenure || 36, loan.maxTenure)),
                            );
                          }}
                          className={`rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Icon
                              size={21}
                              className={
                                selected ? "text-blue-700" : "text-slate-500"
                              }
                            />
                            {selected && (
                              <CheckCircle2
                                size={18}
                                className="text-blue-700"
                              />
                            )}
                          </div>
                          <p className="mt-3 text-sm font-semibold">
                            {loan.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Indicative rate: {loan.rate}% p.a.
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <Field label="Loan amount (₹)">
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      max={selectedLoan.maxAmount}
                      value={data.loanAmount}
                      onChange={(e) => update("loanAmount", e.target.value)}
                      required
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Maximum for this demo product:{" "}
                      {money(selectedLoan.maxAmount)}
                    </p>
                  </Field>

                  <Field label="Repayment tenure">
                    <select
                      className={inputClass}
                      value={data.tenure}
                      onChange={(e) => update("tenure", e.target.value)}
                    >
                      {[12, 24, 36, 48, 60, 84, 120, 180, 240, 300, 360]
                        .filter((months) => months <= selectedLoan.maxTenure)
                        .map((months) => (
                          <option key={months} value={months}>
                            {months} months
                            {months >= 12 ? ` (${months / 12} years)` : ""}
                          </option>
                        ))}
                    </select>
                  </Field>

                  <div className="rounded-2xl bg-slate-900 p-5 text-white">
                    <p className="text-sm text-slate-300">
                      Estimated monthly EMI
                    </p>
                    <p className="mt-2 text-3xl font-bold">{money(emi)}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/15 pt-4">
                      <div>
                        <p className="text-xs text-slate-400">Interest rate</p>
                        <p className="mt-1 font-semibold">
                          {selectedLoan.rate}% p.a.
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">
                          Total repayment
                        </p>
                        <p className="mt-1 font-semibold">
                          {money(emi * tenure)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold">Supporting documents</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Upload sample documents to complete this demo application.
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <Upload size={23} />
                    </div>
                    <p className="mt-4 font-semibold">Choose your documents</p>
                    <p className="mt-1 text-sm text-slate-500">
                      PDF, JPG or PNG · Maximum 5 MB per file
                    </p>
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
                      <Upload size={16} /> Browse files
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                        onChange={handleFiles}
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Identity proof", "Address proof", "Income proof"].map(
                      (name) => (
                        <div
                          key={name}
                          className="rounded-xl border border-slate-200 p-3"
                        >
                          <FileText size={19} className="text-blue-700" />
                          <p className="mt-2 text-sm font-medium">{name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Suggested document
                          </p>
                        </div>
                      ),
                    )}
                  </div>

                  {documents.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">
                        Selected files ({documents.length})
                      </p>
                      {documents.map((file, index) => (
                        <div
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                        >
                          <FileText
                            size={19}
                            className="shrink-0 text-blue-700"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(file.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setDocuments((previous) =>
                                previous.filter((_, i) => i !== index),
                              )
                            }
                            aria-label={`Remove ${file.name}`}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600"
                          >
                            <X size={17} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                    Demo only: files are held in browser memory and are not
                    uploaded to a server. Use dummy documents, not real identity
                    or financial records. No document verification is performed.
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold">
                      Review your application
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Check the details before submitting the mock application.
                    </p>
                  </div>

                  {[
                    {
                      title: "Personal details",
                      rows: [
                        ["Full name", data.fullName],
                        ["Date of birth", data.dob],
                        ["Email", data.email],
                        ["Mobile", data.phone],
                        ["Address", data.address],
                      ],
                    },
                    {
                      title: "Employment and income",
                      rows: [
                        ["Employment", data.employmentType],
                        ...(data.employer ? [["Employer", data.employer]] : []),
                        ["Monthly income", money(Number(data.monthlyIncome))],
                        ["Existing EMIs", money(Number(data.existingEmi) || 0)],
                      ],
                    },
                    {
                      title: "Loan details",
                      rows: [
                        ["Loan product", data.loanType],
                        ["Requested amount", money(amount)],
                        ["Tenure", `${tenure} months`],
                        ["Indicative interest", `${selectedLoan.rate}% p.a.`],
                        ["Estimated monthly EMI", money(emi)],
                        ["Documents selected", String(documents.length)],
                      ],
                    },
                  ].map((section) => (
                    <div
                      key={section.title}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <h3 className="font-semibold">{section.title}</h3>
                      <dl className="mt-3 space-y-3">
                        {section.rows.map(([label, value]) => (
                          <div
                            key={label}
                            className="flex flex-col justify-between gap-1 text-sm sm:flex-row sm:gap-4"
                          >
                            <dt className="text-slate-500">{label}</dt>
                            <dd className="break-words font-medium text-slate-800 sm:max-w-[60%] sm:text-right">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}

                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-600">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 accent-blue-700"
                    />
                    I confirm that I have reviewed the information entered for
                    this demonstration application.
                  </label>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => {
                    setStep((current) => Math.max(current - 1, 0));
                    setError("");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
                >
                  {step === 4 ? "Submit demo application" : "Continue"}
                  {step === 4 ? <Check size={17} /> : <ArrowRight size={17} />}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <ClipboardCheck size={19} className="text-blue-700" />
                <h2 className="font-semibold">Application progress</h2>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-700 transition-all"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Step {step + 1} of {steps.length} · {steps[step].label}
              </p>
              <div className="mt-5 space-y-3">
                {steps.map((item, index) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        index < step
                          ? "bg-emerald-100 text-emerald-700"
                          : index === step
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {index < step ? <Check size={14} /> : index + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        index === step
                          ? "font-semibold text-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-sm font-semibold">Your loan summary</p>
              <p className="mt-4 text-xs text-slate-400">Selected product</p>
              <p className="mt-1 text-lg font-semibold">{data.loanType}</p>
              <p className="mt-4 text-xs text-slate-400">Requested amount</p>
              <p className="mt-1 text-xl font-bold">{money(amount)}</p>
              <div className="mt-4 border-t border-white/15 pt-4">
                <p className="text-xs text-slate-400">Estimated monthly EMI</p>
                <p className="mt-1 text-2xl font-bold">{money(emi)}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {tenure} months · {selectedLoan.rate}% indicative annual rate
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-center gap-2 text-blue-900">
                <ShieldCheck size={20} />
                <h3 className="font-semibold">Demo environment</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-blue-900/80">
                This screen uses local frontend state and illustrative loan
                rates. It does not send data to Kestrel Bank or make a credit
                decision.
              </p>
            </div>
          </aside>
        </div>

        <footer className="mt-8 text-center text-xs leading-5 text-slate-400">
          LoanLens AI · Kestrel Bank demo · Illustrative rates and EMI estimates
          only. Actual lending terms are subject to bank policy and assessment.
        </footer>
      </main>
    </div>
  );
}
