import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bot,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  Landmark,
  LogOut,
  Plus,
  ShieldCheck,
  Wallet,
} from "lucide-react";
// import { useState } from "react";
import { usePreferences } from "./context/PreferencesContext";
// import ChatBot from "./features/loans/ChatBot";
import ChatbotWidget from "./features/loans/ChatBot";

type CustomerDashboardProps = {
  onExploreLoans: () => void;
  onLogout: () => void;
};

type CustomerLoan = {
  id: string;
  name: string;
  icon: typeof Home;
  outstanding: number;
  emi: number;
  dueDate: string;
  progress: number;
  rate: string;
};

const customerLoans: CustomerLoan[] = [
  {
    id: "KL-1024",
    name: "Home Loan",
    icon: Home,
    outstanding: 2450000,
    emi: 24500,
    dueDate: "05 Nov 2026",
    progress: 35,
    rate: "8.5%",
  },
  {
    id: "KL-1086",
    name: "Vehicle Loan",
    icon: CarFront,
    outstanding: 325000,
    emi: 12500,
    dueDate: "10 Nov 2026",
    progress: 62,
    rate: "9.2%",
  },
  {
    id: "KL-1102",
    name: "Personal Loan",
    icon: Wallet,
    outstanding: 118500,
    emi: 6200,
    dueDate: "15 Nov 2026",
    progress: 28,
    rate: "11.5%",
  },
];

const applications = [
  {
    id: "APP-2081",
    name: "Education Loan",
    date: "18 Oct 2026",
    status: "Under review",
  },
  {
    id: "APP-2045",
    name: "Personal Loan",
    date: "12 Oct 2026",
    status: "Approved",
  },
];

export default function CustomerDashboard({
  onExploreLoans,
  onLogout,
}: CustomerDashboardProps) {
  const { theme, language, setLanguage, toggleTheme } = usePreferences();
  // const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const isHindi = language === "hi";
  const dark = theme === "dark";

  const outstandingTotal = customerLoans.reduce(
    (total, loan) => total + loan.outstanding,
    0,
  );

  const monthlyEmiTotal = customerLoans.reduce(
    (total, loan) => total + loan.emi,
    0,
  );

  const money = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const text = isHindi
    ? {
        dashboard: "ग्राहक डैशबोर्ड",
        greeting: "नमस्ते, राहुल!",
        subtitle: "यहाँ आपके लोन और भुगतान का सारांश है।",
        explore: "लोन देखें",
        outstanding: "कुल बकाया लोन",
        monthlyEmi: "मासिक EMI",
        activeLoans: "सक्रिय लोन",
        applications: "लोन आवेदन",
        loanPortfolio: "आपके लोन",
        viewAll: "सभी देखें",
        outstandingLabel: "बकाया राशि",
        nextEmi: "अगली EMI",
        interest: "ब्याज दर",
        repaid: "चुकाया गया",
        duePayments: "आगामी भुगतान",
        applicationHistory: "आवेदन इतिहास",
        submitted: "आवेदन की तारीख",
        profile: "प्रोफ़ाइल और KYC",
        verified: "पहचान सत्यापन",
        verifiedValue: "सत्यापित",
        kycMessage: "आपका KYC सत्यापन पूरा है।",
        tools: "आपके लिए उपयोगी टूल",
        calculator: "EMI कैलकुलेटर",
        calculatorDesc: "अपनी मासिक किस्त का अनुमान लगाएँ",
        advisor: "AI लोन सलाहकार",
        advisorDesc: "उपयुक्त लोन विकल्प खोजें",
        notification: "सूचनाएँ",
        review: "समीक्षा जारी",
        approved: "स्वीकृत",
        logout: "लॉग आउट",
        demo: "डेमो डेटा",
        demoNote:
          "यह उदाहरण के लिए दिखाया गया डेटा है, वास्तविक बैंक रिकॉर्ड नहीं।",
        welcome: "Kestrel Bank में आपका स्वागत है",
      }
    : {
        dashboard: "Customer Dashboard",
        greeting: "Welcome back, Rahul!",
        subtitle: "Here's an overview of your loans and repayments.",
        explore: "Explore Loans",
        outstanding: "Total Outstanding Loans",
        monthlyEmi: "Monthly EMI",
        activeLoans: "Active Loans",
        applications: "Applications",
        loanPortfolio: "Your Loans",
        viewAll: "View all",
        outstandingLabel: "Outstanding",
        nextEmi: "Next EMI",
        interest: "Interest rate",
        repaid: "Repaid",
        duePayments: "Upcoming Payments",
        applicationHistory: "Application History",
        submitted: "Submitted",
        profile: "Profile & KYC",
        verified: "Identity verification",
        verifiedValue: "Verified",
        kycMessage: "Your demo KYC status is complete.",
        tools: "Tools for You",
        calculator: "EMI Calculator",
        calculatorDesc: "Estimate your monthly repayments",
        advisor: "Loan Advisor",
        advisorDesc: "Find a loan that fits your needs",
        notification: "Notifications",
        review: "Under review",
        approved: "Approved",
        logout: "Log Out",
        demo: "Demo data",
        demoNote: "Illustrative sample data, not real bank records.",
        welcome: "Banking made simpler with Kestrel Bank",
      };

  const page = dark
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-900";

  const panel = dark
    ? "border border-slate-800 bg-slate-900"
    : "border border-slate-200 bg-white";

  const muted = dark ? "text-slate-400" : "text-slate-500";

  const formatDate = (date: string) => {
    if (!isHindi) return date;

    const dates: Record<string, string> = {
      "05 Nov 2026": "05 नवम्बर 2026",
      "10 Nov 2026": "10 नवम्बर 2026",
      "15 Nov 2026": "15 नवम्बर 2026",
      "18 Oct 2026": "18 अक्टूबर 2026",
      "12 Oct 2026": "12 अक्टूबर 2026",
    };

    return dates[date] ?? date;
  };

  return (
    <div className={page}>
      <header
        className={`sticky top-0 z-20 border-b ${
          dark
            ? "border-slate-800 bg-slate-950/95"
            : "border-slate-200 bg-white/95"
        } backdrop-blur`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5 text-white">
              <Landmark size={24} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold">Kestrel Bank</p>
              <p className={`text-xs ${muted}`}>LoanLens AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className={`rounded-lg border px-3 py-2 text-sm ${
                dark
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
            >
              {language === "en" ? "हिन्दी" : "English"}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`rounded-lg border p-2 ${
                dark
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            <button
              type="button"
              aria-label={text.notification}
              className={`relative rounded-lg border p-2 ${
                dark
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Bell size={19} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-500" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              title={text.logout}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{text.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className={`mb-2 text-sm ${muted}`}>{text.dashboard}</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {text.greeting}
            </h1>
            <p className={`mt-2 text-sm ${muted}`}>{text.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onExploreLoans}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={19} />
            {text.explore}
            <ArrowRight size={17} />
          </button>
        </section>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600">
            {text.demo}
          </span>
          <p className={`text-xs ${muted}`}>{text.demoNote}</p>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-700 p-5 text-white shadow-sm sm:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-blue-100">{text.outstanding}</p>
                <p className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  {money(outstandingTotal)}
                </p>
                <p className="mt-3 text-sm text-blue-100">
                  {customerLoans.length} {text.activeLoans.toLowerCase()}
                </p>
              </div>
              <div className="rounded-xl bg-white/15 p-3">
                <Wallet size={25} />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-5 ${panel}`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${muted}`}>{text.monthlyEmi}</p>
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                <CalendarDays size={20} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold">{money(monthlyEmiTotal)}</p>
            <p className={`mt-2 text-xs ${muted}`}>
              {isHindi ? "सभी सक्रिय लोन की EMI" : "Across all active loans"}
            </p>
          </div>

          <div className={`rounded-2xl p-5 ${panel}`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${muted}`}>{text.applications}</p>
              <div className="rounded-lg bg-violet-500/10 p-2 text-violet-500">
                <FileText size={20} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold">{applications.length}</p>
            <p className={`mt-2 text-xs ${muted}`}>
              {isHindi ? "आपके आवेदन" : "Your loan applications"}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">{text.loanPortfolio}</h2>
              <p className={`mt-1 text-sm ${muted}`}>
                {isHindi
                  ? "अपने सक्रिय लोन और भुगतान देखें"
                  : "Track your active loans and repayments"}
              </p>
            </div>
            <CreditCard size={22} className={muted} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {customerLoans.map((loan) => {
              const LoanIcon = loan.icon;

              return (
                <article key={loan.id} className={`rounded-2xl p-5 ${panel}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                        <LoanIcon size={23} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{loan.name}</h3>
                        <p className={`mt-1 text-xs ${muted}`}>{loan.id}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={18} className={muted} />
                  </div>

                  <p className={`mt-6 text-sm ${muted}`}>
                    {text.outstandingLabel}
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {money(loan.outstanding)}
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className={muted}>{text.repaid}</span>
                      <span className="font-semibold">{loan.progress}%</span>
                    </div>
                    <div
                      className={`h-2 overflow-hidden rounded-full ${
                        dark ? "bg-slate-800" : "bg-slate-100"
                      }`}
                    >
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${loan.progress}%` }}
                      />
                    </div>
                  </div>

                  <div
                    className={`mt-5 grid grid-cols-2 gap-3 border-t pt-4 ${
                      dark ? "border-slate-800" : "border-slate-100"
                    }`}
                  >
                    <div>
                      <p className={`text-xs ${muted}`}>{text.monthlyEmi}</p>
                      <p className="mt-1 font-semibold">{money(loan.emi)}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${muted}`}>{text.interest}</p>
                      <p className="mt-1 font-semibold">{loan.rate}</p>
                    </div>
                  </div>

                  <div
                    className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-xs ${
                      dark
                        ? "bg-slate-800/70 text-slate-300"
                        : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    <CalendarDays size={15} className="shrink-0" />
                    <span>
                      {text.nextEmi}: {formatDate(loan.dueDate)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className={`rounded-2xl p-5 lg:col-span-2 ${panel}`}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold">{text.applicationHistory}</h2>
                <p className={`mt-1 text-sm ${muted}`}>
                  {isHindi
                    ? "अपने आवेदन की प्रगति देखें"
                    : "Check the progress of your applications"}
                </p>
              </div>
              <FileText size={21} className={muted} />
            </div>

            <div className="space-y-3">
              {applications.map((application) => {
                const approved = application.status === "Approved";

                return (
                  <div
                    key={application.id}
                    className={`flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
                      dark ? "border-slate-800" : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-500">
                        <Landmark size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">{application.name}</p>
                        <p className={`mt-1 text-xs ${muted}`}>
                          {application.id} · {text.submitted}:{" "}
                          {formatDate(application.date)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        approved
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {approved ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Clock3 size={14} />
                      )}
                      {approved
                        ? text.approved
                        : isHindi
                          ? "समीक्षा जारी"
                          : text.review}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onExploreLoans}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-400"
            >
              {text.explore}
              <ChevronRight size={17} />
            </button>
          </div>

          <div className={`rounded-2xl p-5 ${panel}`}>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                <ShieldCheck size={23} />
              </div>
              <div>
                <h2 className="font-bold">{text.profile}</h2>
                <p className={`mt-1 text-xs ${muted}`}>{text.verified}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                RM
              </div>
              <div>
                <p className="font-semibold">
                  {isHindi ? "राहुल मेहता" : "Rahul Mehta"}
                </p>
                <p className={`text-xs ${muted}`}>rahul.mehta@example.com</p>
              </div>
            </div>

            <div
              className={`mt-5 flex items-center justify-between border-t pt-4 ${
                dark ? "border-slate-800" : "border-slate-100"
              }`}
            >
              <span className={`text-sm ${muted}`}>{text.verified}</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-500">
                <CheckCircle2 size={16} />
                {text.verifiedValue}
              </span>
            </div>

            <p className={`mt-4 text-xs leading-5 ${muted}`}>
              {text.kycMessage}
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">{text.tools}</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={onExploreLoans}
              className={`group flex items-center gap-4 rounded-2xl p-5 text-left transition hover:border-blue-500 ${panel}`}
            >
              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-500">
                <GraduationCap size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{text.calculator}</p>
                <p className={`mt-1 text-sm ${muted}`}>{text.calculatorDesc}</p>
              </div>
              <ChevronRight
                size={20}
                className={`${muted} transition group-hover:translate-x-1`}
              />
            </button>

            <button
              type="button"
              onClick={onExploreLoans}
              className={`group flex items-center gap-4 rounded-2xl p-5 text-left transition hover:border-blue-500 ${panel}`}
            >
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                <Bot size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{text.advisor}</p>
                <p className={`mt-1 text-sm ${muted}`}>{text.advisorDesc}</p>
              </div>
              <ChevronRight
                size={20}
                className={`${muted} transition group-hover:translate-x-1`}
              />
            </button>
          </div>
        </section>

        <footer
          className={`flex flex-col justify-between gap-2 border-t py-5 text-xs sm:flex-row ${
            dark
              ? "border-slate-800 text-slate-500"
              : "border-slate-200 text-slate-500"
          }`}
        >
          <span>© 2026 Kestrel Bank · LoanLens AI</span>
          <span>{text.welcome}</span>
        </footer>
        {/* <button
          type="button"
          onClick={() => setIsChatBotOpen((open) => !open)}
          aria-label="Open AI loan chatbot"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-blue-600 px-5 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700"
        >
          <MessageCircle size={22} />
          <span>Chat with AI</span>
        </button> */}
        {/* {isChatBotOpen && (
          <div className="fixed bottom-24 right-6 z-50">
          </div>
        )} */}
        <ChatbotWidget />
      </main>
    </div>
  );
}
