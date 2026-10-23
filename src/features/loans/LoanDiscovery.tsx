import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Calculator,
  Check,
  ChevronDown,
  GraduationCap,
  House,
  Info,
  Languages,
  MessageCircle,
  Moon,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Wallet,
  CarFront,
} from "lucide-react";

import { usePreferences } from "../../context/PreferencesContext";

type LoanCategory = "All loans" | "Personal" | "Home" | "Vehicle" | "Education";
type LoanType =
  | "Personal Loan"
  | "Home Loan"
  | "Vehicle Loan"
  | "Education Loan";

type LoanProduct = {
  id: string;
  name: LoanType;
  category: Exclude<LoanCategory, "All loans">;
  description: string;
  rate: number;
  maxAmount: number;
  maxTenure: number;
  icon: typeof Wallet;
  accent: string;
  features: string[];
};

type Recommendation = {
  productId: string;
  productName: string;
  indicativeInterestRate: number;
  tenureMonths: number;
  estimatedEmi: number;
  reason: string;
  eligibilityIndicator:
    | "LIKELY_ELIGIBLE"
    | "NEEDS_REVIEW"
    | "MORE_INFORMATION_REQUIRED";
};

const products: LoanProduct[] = [
  {
    id: "PL-001",
    name: "Personal Loan",
    category: "Personal",
    description: "For life's planned and unexpected expenses.",
    rate: 10.5,
    maxAmount: 2500000,
    maxTenure: 60,
    icon: Wallet,
    accent: "blue",
    features: ["No collateral", "Flexible repayment", "Quick application"],
  },
  {
    id: "HL-001",
    name: "Home Loan",
    category: "Home",
    description: "Make your home ownership plans a reality.",
    rate: 8.35,
    maxAmount: 10000000,
    maxTenure: 360,
    icon: House,
    accent: "teal",
    features: ["Long repayment terms", "Property purchase", "Balance transfer"],
  },
  {
    id: "VL-001",
    name: "Vehicle Loan",
    category: "Vehicle",
    description: "Finance your next car or two-wheeler.",
    rate: 9.25,
    maxAmount: 3000000,
    maxTenure: 84,
    icon: CarFront,
    accent: "violet",
    features: [
      "New and used vehicles",
      "Flexible tenure",
      "Simple application",
    ],
  },
  {
    id: "EL-001",
    name: "Education Loan",
    category: "Education",
    description: "Invest in your education and future.",
    rate: 8.75,
    maxAmount: 5000000,
    maxTenure: 180,
    icon: GraduationCap,
    accent: "amber",
    features: [
      "Study-related expenses",
      "Flexible repayment",
      "Co-applicant support",
    ],
  },
];

const accentStyles: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700",
  teal: "bg-teal-50 text-teal-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
};

function formatINR(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function calculateEmi(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;

  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / months;

  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function getRecommendations(
  amount: number,
  income: number,
  maxEmi: number,
): Recommendation[] {
  return products
    .filter(
      (product) =>
        product.category === "Personal" || product.category === "Vehicle",
    )
    .map((product) => {
      const tenure = Math.min(product.maxTenure, 60);
      const emi = calculateEmi(amount, product.rate, tenure);
      const incomeRatio = income > 0 ? emi / income : Infinity;

      let eligibilityIndicator: Recommendation["eligibilityIndicator"] =
        "NEEDS_REVIEW";
      let reason =
        "Review income, existing obligations, product terms, and eligibility criteria.";

      if (income <= 0) {
        eligibilityIndicator = "MORE_INFORMATION_REQUIRED";
        reason = "Share your monthly income so affordability can be assessed.";
      } else if (amount > product.maxAmount) {
        eligibilityIndicator = "NEEDS_REVIEW";
        reason =
          "The requested amount exceeds this product's illustrative maximum.";
      } else if (emi <= maxEmi && incomeRatio <= 0.4) {
        eligibilityIndicator = "LIKELY_ELIGIBLE";
        reason =
          "The estimated EMI fits your stated budget. Other eligibility checks still apply.";
      } else {
        reason =
          "The estimated EMI or income ratio is above the stated affordability target.";
      }

      return {
        productId: product.id,
        productName: product.name,
        indicativeInterestRate: product.rate,
        tenureMonths: tenure,
        estimatedEmi: emi,
        reason,
        eligibilityIndicator,
      };
    });
}

export default function LoanDiscovery({
  onApply,
}: {
  onApply?: (loanType: LoanType) => void;
}) {
  const { theme, language, setLanguage, toggleTheme, t } = usePreferences();

  const [category, setCategory] = useState<LoanCategory>("All loans");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rate");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const [principal, setPrincipal] = useState(500000);
  const [annualRate, setAnnualRate] = useState(10.5);
  const [tenureYears, setTenureYears] = useState(5);

  const [advisorInput] = useState(
    "I need ₹5 lakh for a used car, earn ₹60,000/month, and want an EMI below ₹12,000.",
  );
  const [advisorAmount, setAdvisorAmount] = useState("500000");
  const [monthlyIncome, setMonthlyIncome] = useState("60000");
  const [maxEmi, setMaxEmi] = useState("12000");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [advisorError, setAdvisorError] = useState("");
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [, setClarifyingQuestion] = useState("");

  const emi = calculateEmi(principal, annualRate, tenureYears * 12);
  const totalPayment = emi * tenureYears * 12;
  const totalInterest = totalPayment - principal;

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesCategory =
          category === "All loans" || product.category === category;
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.features.some((feature) =>
            feature.toLowerCase().includes(query),
          );

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "rate") return a.rate - b.rate;
        if (sortBy === "amount") return b.maxAmount - a.maxAmount;
        return a.name.localeCompare(b.name);
      });
  }, [category, search, sortBy]);

  const comparedProducts = products.filter((product) =>
    compareIds.includes(product.id),
  );

  function toggleCompare(id: string) {
    setCompareIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 3
          ? [...current, id]
          : current,
    );
  }

  function runAdvisor() {
    const amount = Number(advisorAmount);
    const income = Number(monthlyIncome);
    const budget = Number(maxEmi);

    if (!advisorInput.trim() || !Number.isFinite(amount) || amount <= 0) {
      setAdvisorError(
        "Enter your borrowing requirement and a valid loan amount.",
      );
      return;
    }

    if (
      !Number.isFinite(income) ||
      income <= 0 ||
      !Number.isFinite(budget) ||
      budget <= 0
    ) {
      setAdvisorError(
        "Enter a valid monthly income and preferred maximum EMI.",
      );
      return;
    }

    setAdvisorError("");
    setAdvisorLoading(true);
    setClarifyingQuestion("");

    // Temporary local simulation. Replace this function with the Spring Boot
    // AI Loan Advisor API when the backend endpoint is ready.
    window.setTimeout(() => {
      setRecommendations(getRecommendations(amount, income, budget));
      setClarifyingQuestion("");
      setAdvisorLoading(false);
    }, 500);
  }

  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-text)]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#153b72] text-white">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">Kestrel Bank</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                LoanLens AI
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#loans" className="text-sm font-medium text-[#19477f]">
              Explore loans
            </a>
            <a
              href="#calculator"
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              EMI calculator
            </a>
            <a
              href="#advisor"
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Loan advisor
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={theme === "dark" ? t("lightMode") : t("darkMode")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <label className="flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2">
              <Languages size={16} className="shrink-0 text-slate-500" />
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
              onClick={() =>
                document.getElementById("loans")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="rounded-lg bg-[#19477f] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123660] sm:px-4"
            >
              {t("exploreLoans")}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-2xl bg-[#153b72] px-6 py-8 text-white sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-14 h-52 w-52 rounded-full border border-white/10" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
                <Sparkles size={14} /> Smarter borrowing starts here
              </span>
              <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Find the right loan.
                <br />
                Plan with confidence.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">
                Explore lending options, understand your monthly repayments, and
                get guidance tailored to your borrowing needs.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("loans")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#153b72] hover:bg-blue-50"
                >
                  Explore loan products <ArrowRight size={16} />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("advisor")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Ask advisor
                </button>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-blue-100">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} /> Transparent estimates
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} /> Clear repayment planning
                </span>
              </div>
            </div>

            <div className="hidden justify-center lg:flex">
              <div className="w-full max-w-[340px] rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-100">
                    Plan your monthly EMI
                  </span>
                  <Calculator size={19} className="text-blue-200" />
                </div>
                <p className="mt-5 text-xs text-blue-200">
                  Example loan amount
                </p>
                <p className="mt-1 text-3xl font-semibold">₹5,00,000</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-xs text-blue-200">Illustrative rate</p>
                    <p className="mt-1 text-lg font-semibold">10.5%</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-xs text-blue-200">Tenure</p>
                    <p className="mt-1 text-lg font-semibold">5 years</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    document
                      .getElementById("calculator")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#153b72]"
                >
                  Calculate my EMI <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="loans" className="scroll-mt-24 pt-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#386db0]">
                Loan catalogue
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Explore loan products
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Compare indicative rates and find a product for your needs.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              {filteredProducts.length} products shown
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "All loans",
                  "Personal",
                  "Home",
                  "Vehicle",
                  "Education",
                ] as LoanCategory[]
              ).map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    category === item
                      ? "bg-[#19477f] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search loan products..."
                  aria-label="Search loan products"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
                <SlidersHorizontal size={15} className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort loan products"
                  className="bg-transparent text-sm text-slate-600 outline-none"
                >
                  <option value="rate">Lowest rate</option>
                  <option value="amount">Highest amount</option>
                  <option value="name">Name A–Z</option>
                </select>
                <ChevronDown size={13} className="text-slate-400" />
              </label>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const Icon = product.icon;
              const selected = compareIds.includes(product.id);

              return (
                <article
                  key={product.id}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentStyles[product.accent]}`}
                    >
                      <Icon size={21} />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">{product.name}</h3>
                  <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                    {product.description}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-500">
                      Indicative interest rate
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                      {product.rate.toFixed(2)}%
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        p.a.
                      </span>
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[11px] text-slate-400">
                          Loan amount up to
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {formatINR(product.maxAmount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-slate-400">
                          Tenure up to
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {product.maxTenure >= 12
                            ? `${product.maxTenure / 12} years`
                            : `${product.maxTenure} months`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-slate-500"
                      >
                        <Check
                          size={13}
                          className="shrink-0 text-emerald-600"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                    <button
                      onClick={() => {
                        setPrincipal(Math.min(10000000, product.maxAmount));
                        setAnnualRate(product.rate);
                        setTenureYears(
                          Math.min(
                            30,
                            Math.max(1, Math.floor(product.maxTenure / 12)),
                          ),
                        );
                        document
                          .getElementById("calculator")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-sm font-semibold text-[#19477f] hover:underline"
                    >
                      Calculate EMI
                    </button>
                    <button
                      onClick={() => toggleCompare(product.id)}
                      aria-pressed={selected}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                        selected
                          ? "border-[#19477f] bg-[#edf3fc] text-[#19477f]"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {selected ? "Selected" : "Compare"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onApply?.(product.name)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#19477f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123660]"
                  >
                    Apply Now
                    <ArrowRight size={16} />
                  </button>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center">
              <Search size={25} className="mx-auto text-slate-300" />
              <p className="mt-3 font-semibold">No loan products found</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All loans");
                }}
                className="mt-2 text-sm font-semibold text-[#19477f]"
              >
                Clear search and filters
              </button>
            </div>
          )}

          {compareIds.length > 0 && (
            <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center">
              <p className="text-sm text-blue-900">
                <strong>{compareIds.length} of 3</strong> products selected for
                comparison.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCompareIds([])}
                  className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-800"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowComparison((value) => !value)}
                  className="rounded-lg bg-[#19477f] px-4 py-2 text-xs font-semibold text-white"
                >
                  {showComparison ? "Hide comparison" : "Compare selected"}
                </button>
              </div>
            </div>
          )}

          {showComparison && comparedProducts.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                      Feature
                    </th>
                    {comparedProducts.map((product) => (
                      <th key={product.id} className="px-4 py-3 font-semibold">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3 text-slate-500">
                      Indicative rate
                    </td>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="px-4 py-3 font-semibold">
                        {product.rate.toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-500">Maximum amount</td>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="px-4 py-3">
                        {formatINR(product.maxAmount)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-500">Maximum tenure</td>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="px-4 py-3">
                        {product.maxTenure} months
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="calculator" className="scroll-mt-24 pt-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#386db0]">
              Plan your repayments
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              EMI calculator
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Adjust the amount, rate, and tenure to estimate your monthly
              repayment.
            </p>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="space-y-7">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="loan-amount"
                      className="text-sm font-medium text-slate-700"
                    >
                      Loan amount
                    </label>
                    <span className="text-lg font-bold">
                      {formatINR(principal)}
                    </span>
                  </div>
                  <input
                    id="loan-amount"
                    type="range"
                    min={50000}
                    max={10000000}
                    step={50000}
                    value={principal}
                    onChange={(event) =>
                      setPrincipal(Number(event.target.value))
                    }
                    className="mt-4 w-full accent-[#19477f]"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-400">
                    <span>₹50,000</span>
                    <span>₹1 Cr</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="interest-rate"
                      className="text-sm font-medium text-slate-700"
                    >
                      Interest rate (per annum)
                    </label>
                    <span className="text-lg font-bold">
                      {annualRate.toFixed(2)}%
                    </span>
                  </div>
                  <input
                    id="interest-rate"
                    type="range"
                    min={5}
                    max={24}
                    step={0.25}
                    value={annualRate}
                    onChange={(event) =>
                      setAnnualRate(Number(event.target.value))
                    }
                    className="mt-4 w-full accent-[#19477f]"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-400">
                    <span>5%</span>
                    <span>24%</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="loan-tenure"
                      className="text-sm font-medium text-slate-700"
                    >
                      Loan tenure
                    </label>
                    <span className="text-lg font-bold">
                      {tenureYears} {tenureYears === 1 ? "year" : "years"}
                    </span>
                  </div>
                  <input
                    id="loan-tenure"
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={tenureYears}
                    onChange={(event) =>
                      setTenureYears(Number(event.target.value))
                    }
                    className="mt-4 w-full accent-[#19477f]"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-400">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#153b72] p-6 text-white sm:p-7">
              <p className="text-sm text-blue-100">Estimated monthly EMI</p>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                {formatINR(emi)}
              </p>
              <p className="mt-2 text-xs text-blue-200">
                For {tenureYears * 12} monthly instalments
              </p>

              <div className="mt-7 space-y-4 border-t border-white/15 pt-5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-blue-100">Principal amount</span>
                  <span className="font-semibold">{formatINR(principal)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-blue-100">Total interest</span>
                  <span className="font-semibold">
                    {formatINR(totalInterest)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-white/15 pt-4 text-sm">
                  <span className="text-blue-100">Total repayment</span>
                  <span className="font-semibold">
                    {formatINR(totalPayment)}
                  </span>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-2 rounded-full bg-teal-300"
                  style={{
                    width: `${Math.max(0, Math.min(100, (principal / Math.max(totalPayment, 1)) * 100))}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-blue-200">
                <span>Principal</span>
                <span>Interest included</span>
              </div>
              <p className="mt-5 text-xs leading-5 text-blue-100">
                This estimate assumes a fixed interest rate and regular monthly
                repayments. Actual terms may differ.
              </p>
            </div>
          </div>
        </section>

        <section id="advisor" className="scroll-mt-24 pt-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#386db0]">
              Personalized guidance
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Meet your Loan Advisor
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Describe what you need, and explore indicative loan options.
            </p>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3fc] text-[#19477f]">
                  <Bot size={23} />
                </span>
                <div>
                  <h3 className="font-semibold">Tell us what you need</h3>
                  <p className="mt-1 text-xs text-slate-500">
                  </p>
                </div>
              </div>

              {/* <label
                htmlFor="advisor-prompt"
                className="mt-5 block text-sm font-medium text-slate-700"
              >
                Your borrowing requirement
              </label>
              <textarea
                id="advisor-prompt"
                value={advisorInput}
                onChange={(event) => setAdvisorInput(event.target.value)}
                rows={4}
                placeholder="For example, I need ₹5 lakh for a used car..."
                className="mt-2 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              /> */}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="advisor-amount"
                    className="text-xs font-medium text-slate-600"
                  >
                    Requested loan (₹)
                  </label>
                  <input
                    id="advisor-amount"
                    type="number"
                    min="1"
                    value={advisorAmount}
                    onChange={(event) => setAdvisorAmount(event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="advisor-income"
                    className="text-xs font-medium text-slate-600"
                  >
                    Monthly income (₹)
                  </label>
                  <input
                    id="advisor-income"
                    type="number"
                    min="1"
                    value={monthlyIncome}
                    onChange={(event) => setMonthlyIncome(event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="advisor-max-emi"
                    className="text-xs font-medium text-slate-600"
                  >
                    Preferred maximum EMI (₹/month)
                  </label>
                  <input
                    id="advisor-max-emi"
                    type="number"
                    min="1"
                    value={maxEmi}
                    onChange={(event) => setMaxEmi(event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {advisorError && (
                <p role="alert" className="mt-3 text-sm text-rose-600">
                  {advisorError}
                </p>
              )}

              <button
                onClick={runAdvisor}
                disabled={advisorLoading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#19477f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#123660] disabled:cursor-wait disabled:opacity-70"
              >
                <Sparkles size={16} />
                {advisorLoading
                  ? "Preparing recommendations..."
                  : "Get recommendations"}
                {!advisorLoading && <ArrowRight size={16} />}
              </button>

              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
                <Info size={15} className="mt-0.5 shrink-0" />
                Demo mode: recommendations are calculated locally and are not
                generated by the bank's AI backend.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Sparkles size={20} />
                </span>
                <div>
                  <h3 className="font-semibold">Your recommendations</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Illustrative options based on the details provided
                  </p>
                </div>
              </div>

              {recommendations.length === 0 && !advisorLoading && (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-4 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <MessageCircle size={25} />
                  </span>
                  <p className="mt-4 font-semibold">Let's find your options</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Share your borrowing requirement and financial details, then
                    select “Get recommendations” to view illustrative options.
                  </p>
                </div>
              )}

              {advisorLoading && (
                <div role="status" className="space-y-3 py-6">
                  <p className="text-sm text-slate-500">
                    Calculating illustrative options...
                  </p>
                  <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                  <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                </div>
              )}

              {!advisorLoading && recommendations.length > 0 && (
                <div className="space-y-3 pt-4">
                  {recommendations.map((recommendation) => (
                    <article
                      key={recommendation.productId}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold">
                            {recommendation.productName}
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            {recommendation.indicativeInterestRate.toFixed(2)}%
                            indicative annual rate ·{" "}
                            {recommendation.tenureMonths} months
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            recommendation.eligibilityIndicator ===
                            "LIKELY_ELIGIBLE"
                              ? "bg-emerald-50 text-emerald-700"
                              : recommendation.eligibilityIndicator ===
                                  "MORE_INFORMATION_REQUIRED"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {recommendation.eligibilityIndicator ===
                          "LIKELY_ELIGIBLE"
                            ? "Potential match"
                            : recommendation.eligibilityIndicator ===
                                "MORE_INFORMATION_REQUIRED"
                              ? "More information needed"
                              : "Further assessment"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-500">
                            Estimated EMI
                          </p>
                          <p className="mt-1 text-xl font-bold">
                            {formatINR(recommendation.estimatedEmi)}
                            <span className="ml-1 text-xs font-normal text-slate-400">
                              /month
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const product = products.find(
                              (item) => item.id === recommendation.productId,
                            );
                            if (product) {
                              setPrincipal(
                                Math.min(
                                  Number(advisorAmount),
                                  product.maxAmount,
                                ),
                              );
                              setAnnualRate(product.rate);
                              setTenureYears(
                                Math.max(
                                  1,
                                  Math.floor(recommendation.tenureMonths / 12),
                                ),
                              );
                              document
                                .getElementById("calculator")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#19477f]"
                        >
                          View calculation <ArrowUpRight size={14} />
                        </button>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        {recommendation.reason}
                      </p>
                    </article>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-lg bg-amber-50 p-3">
                <p className="text-xs leading-5 text-amber-900">
                  These are indicative estimates, not a credit decision or
                  guarantee of eligibility. Final approval is subject to bank
                  policy, document verification, and credit assessment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h3 className="text-sm font-semibold">
                Your information, handled responsibly
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                This demo uses synthetic data. Actual lending decisions require
                verified information and the bank's approved credit assessment
                process. Loan rates and product terms shown here are
                illustrative.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Kestrel Bank · LoanLens AI</span>
          <span>Illustrative rates and calculations · Demo environment</span>
        </footer>
      </main>
    </div>
  );
}
