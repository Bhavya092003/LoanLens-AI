import { useMemo, useState } from "react";
import { Moon, Sun, Languages } from "lucide-react";
import Login from "./Login";
import AnalystReview from "./features/loans/AnalystReview";
import CustomerDashboard from "./CustomerDashboard";
import LoanDiscovery from "./features/loans/LoanDiscovery";
import LoanApplication, {
  type LoanType,
} from "./features/loans/LoanApplication";
import {
  PreferencesProvider,
  usePreferences,
} from "./context/PreferencesContext";
import {
  Activity,
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Status =
  | "Submitted"
  | "Under Verification"
  | "Under Review"
  | "Approved"
  | "Rejected";

type Risk = "Low" | "Medium" | "High";

type Application = {
  id: string;
  customer: string;
  initials: string;
  product: string;
  amount: number;
  submitted: string;
  status: Status;
  risk: Risk;
};

const applications: Application[] = [
  {
    id: "KL-2026-1042",
    customer: "Aarav Sharma",
    initials: "AS",
    product: "Personal Loan",
    amount: 450000,
    submitted: "23 Oct, 10:42 AM",
    status: "Under Review",
    risk: "Medium",
  },
  {
    id: "KL-2026-1041",
    customer: "Priya Verma",
    initials: "PV",
    product: "Home Loan",
    amount: 4200000,
    submitted: "23 Oct, 10:18 AM",
    status: "Submitted",
    risk: "Low",
  },
  {
    id: "KL-2026-1040",
    customer: "Rohan Mehta",
    initials: "RM",
    product: "Vehicle Loan",
    amount: 780000,
    submitted: "23 Oct, 09:56 AM",
    status: "Under Verification",
    risk: "High",
  },
  {
    id: "KL-2026-1039",
    customer: "Ananya Gupta",
    initials: "AG",
    product: "Education Loan",
    amount: 1250000,
    submitted: "22 Oct, 04:32 PM",
    status: "Under Review",
    risk: "Low",
  },
  {
    id: "KL-2026-1038",
    customer: "Kabir Malhotra",
    initials: "KM",
    product: "Personal Loan",
    amount: 300000,
    submitted: "22 Oct, 02:15 PM",
    status: "Submitted",
    risk: "Medium",
  },
  {
    id: "KL-2026-1037",
    customer: "Ishita Rao",
    initials: "IR",
    product: "Home Loan",
    amount: 5600000,
    submitted: "22 Oct, 11:20 AM",
    status: "Approved",
    risk: "Low",
  },
  {
    id: "KL-2026-1036",
    customer: "Dev Patel",
    initials: "DP",
    product: "Vehicle Loan",
    amount: 650000,
    submitted: "21 Oct, 03:40 PM",
    status: "Under Verification",
    risk: "Medium",
  },
  {
    id: "KL-2026-1035",
    customer: "Meera Iyer",
    initials: "MI",
    product: "Education Loan",
    amount: 1800000,
    submitted: "21 Oct, 01:12 PM",
    status: "Rejected",
    risk: "High",
  },
  {
    id: "KL-2026-1034",
    customer: "Aditya Rao",
    initials: "AR",
    product: "Personal Loan",
    amount: 250000,
    submitted: "20 Oct, 04:15 PM",
    status: "Submitted",
    risk: "Low",
  },
  {
    id: "KL-2026-1033",
    customer: "Neha Kapoor",
    initials: "NK",
    product: "Home Loan",
    amount: 3800000,
    submitted: "20 Oct, 11:05 AM",
    status: "Under Review",
    risk: "Medium",
  },
];

const chartData = [
  { day: "17 Oct", applications: 32 },
  { day: "18 Oct", applications: 46 },
  { day: "19 Oct", applications: 39 },
  { day: "20 Oct", applications: 58 },
  { day: "21 Oct", applications: 51 },
  { day: "22 Oct", applications: 73 },
  { day: "23 Oct", applications: 64 },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Applications", icon: BriefcaseBusiness, count: "24" },
  { label: "Documents", icon: FileText },
  { label: "Findings", icon: CircleAlert, count: "8" },
  { label: "Analyst Review", icon: ShieldCheck, count: "12" },
];

const statusStyles: Record<Status, string> = {
  Submitted: "bg-blue-50 text-blue-700 ring-blue-200",
  "Under Verification": "bg-amber-50 text-amber-700 ring-amber-200",
  "Under Review": "bg-violet-50 text-violet-700 ring-violet-200",
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

const riskStyles: Record<Risk, string> = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700",
};

function formatINR(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-medium ${riskStyles[risk]}`}
    >
      {risk}
    </span>
  );
}

function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  tone,
  positive = true,
  onClick,
}: {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: typeof Activity;
  tone: string;
  positive?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center gap-0.5 font-semibold ${positive ? "text-emerald-700" : "text-rose-700"}`}
        >
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
        <span className="text-slate-400">{description}</span>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm shadow-slate-100/70 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
      >
        {content}
      </button>
    );
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/70">
      {content}
    </article>
  );
}

function AppContent() {
  const { theme, language, setLanguage, toggleTheme, t } = usePreferences();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "customer" | null>(null);

  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sortOrder, setSortOrder] = useState("Newest first");
  const [page, setPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [range, setRange] = useState("7 days");
  const [showLoanDiscovery, setShowLoanDiscovery] = useState(false);
  const [showLoanApplication, setShowLoanApplication] = useState(false);

  const [selectedLoanType, setSelectedLoanType] =
    useState<LoanType>("Personal Loan");

  const pageSize = 5;

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.id.toLowerCase().includes(query) ||
        application.customer.toLowerCase().includes(query) ||
        application.product.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All statuses" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (sortOrder === "Amount: high to low") {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortOrder === "Amount: low to high") {
      filtered.sort((a, b) => a.amount - b.amount);
    }

    return filtered;
  }, [search, statusFilter, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / pageSize),
  );
  const safePage = Math.min(page, totalPages);
  const visibleApplications = filteredApplications.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const navigate = (label: string) => {
    setActivePage(label);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeStatus = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All statuses");
    setSortOrder("Newest first");
    setPage(1);
  };

  return !isAuthenticated ? (
    <Login
      onLogin={(role) => {
        setUserRole(role);
        setIsAuthenticated(true);
      }}
    />
  ) : userRole === "customer" && !showLoanApplication && !showLoanDiscovery ? (
    <CustomerDashboard
      onExploreLoans={() => {
        setShowLoanDiscovery(true);
        setShowLoanApplication(false);
      }}
      onLogout={() => {
        setIsAuthenticated(false);
        setUserRole(null);
        setShowLoanDiscovery(false);
        setShowLoanApplication(false);
      }}
    />
  ) : showLoanApplication ? (
    <LoanApplication
      initialLoanType={selectedLoanType}
      onBack={() => setShowLoanApplication(false)}
    />
  ) : showLoanDiscovery ? (
    <div>
      <button
        onClick={() => setShowLoanDiscovery(false)}
        className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg"
      >
        ← Back to dashboard
      </button>

      <LoanDiscovery
        onApply={(loanType) => {
          setSelectedLoanType(loanType);
          setShowLoanApplication(true);
        }}
      />
    </div>
  ) : (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-text)]">
      {mobileMenuOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => navigate("Dashboard")}
            aria-label="Kestrel Bank home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#153b72] text-white">
              <ShieldCheck size={23} />
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight">
                Kestrel Bank
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
                LoanLens AI
              </span>
            </span>
          </button>
          <button
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-3 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
            Workspace
          </p>
          <nav aria-label="Main navigation" className="space-y-1">
            {navItems.map(({ label, icon: Icon, count }) => {
              const active = activePage === label;

              return (
                <button
                  key={label}
                  onClick={() => navigate(label)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm transition ${
                    active
                      ? "bg-[#edf3fc] font-semibold text-[#19477f]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                    {label}
                  </span>
                  {count && (
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs ${
                        active
                          ? "bg-white text-[#19477f]"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-4 pt-8">
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
            System status
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#19477f] shadow-sm">
                <Activity size={16} />
              </span>
              <span className="text-sm font-semibold">Demo environment</span>
              <span className="ml-auto h-2 w-2 rounded-full bg-amber-400" />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Displaying synthetic data. Live banking APIs are not connected.
            </p>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dce8f8] text-sm font-bold text-[#19477f]">
              AS
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Ananya Sharma</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Credit Analyst · Demo
              </p>
            </div>
            <button
              aria-label="Profile options"
              onClick={() => setProfileOpen((open) => !open)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <MoreHorizontal size={19} />
            </button>
          </div>
          {profileOpen && (
            <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setIsAuthenticated(false);
                  setUserRole(null);
                  setShowLoanDiscovery(false);
                  setShowLoanApplication(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[258px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 xl:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Open navigation"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={21} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Workspace</span>
                <span>/</span>
                <span className="truncate text-slate-600">{activePage}</span>
              </div>
              <h1 className="mt-1 truncate text-lg font-semibold tracking-tight sm:text-xl">
                {activePage}
              </h1>
            </div>
          </div>

          <div className="ml-3 flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={theme === "dark" ? t("lightMode") : t("darkMode")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
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
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 md:flex">
              <CalendarDays size={15} />
              23 Oct 2026
            </div>

            <div className="relative">
              <button
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                  <p className="font-semibold">Notifications</p>
                  <p className="mt-2 text-sm leading-5 text-slate-500">
                    8 flagged findings and 12 applications awaiting analyst
                    review.
                  </p>
                  <button
                    onClick={() => navigate("Findings")}
                    className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#19477f]"
                  >
                    Review findings <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>

            <div className="hidden h-9 w-px bg-slate-200 sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce8f8] text-xs font-bold text-[#19477f]">
                AS
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-semibold">Ananya Sharma</p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Credit Analyst
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 xl:p-9">
          {activePage === "Dashboard" ? (
            <>
              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm text-slate-500">
                    Friday, 23 October 2026
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">
                    Good morning, Ananya
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Here's what's happening with your lending portfolio today.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                  {/* <button
                    onClick={() => setShowLoanDiscovery(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Explore loans
                  </button> */}
                  <button
                    onClick={() => navigate("Applications")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#19477f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123660]"
                  >
                    View applications <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <section
                aria-label="Portfolio summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
              >
                <MetricCard
                  title="Total applications"
                  value="1,284"
                  change="+12.8%"
                  description="vs. last month"
                  icon={BriefcaseBusiness}
                  tone="bg-blue-50 text-blue-700"
                  onClick={() => navigate("Applications")}
                />
                <MetricCard
                  title="Pending reviews"
                  value="126"
                  change="+8.2%"
                  description="vs. last month"
                  icon={Clock3}
                  tone="bg-amber-50 text-amber-700"
                  positive={false}
                  onClick={() => navigate("Analyst Review")}
                />
                <MetricCard
                  title="Flagged findings"
                  value="8"
                  change="-3"
                  description="since yesterday"
                  icon={CircleAlert}
                  tone="bg-rose-50 text-rose-700"
                  onClick={() => navigate("Findings")}
                />
                <MetricCard
                  title="Processed this month"
                  value="342"
                  change="+16.4%"
                  description="vs. last month"
                  icon={CheckCircle2}
                  tone="bg-emerald-50 text-emerald-700"
                />
              </section>

              <section className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
                <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">Application overview</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Applications received over the selected period
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">
                      <CalendarDays size={14} />
                      <select
                        aria-label="Chart date range"
                        value={range}
                        onChange={(event) => setRange(event.target.value)}
                        className="max-w-[100px] bg-transparent outline-none"
                      >
                        <option value="7 days">Last 7 days</option>
                        <option value="30 days">Last 30 days</option>
                      </select>
                      <ChevronDown size={13} />
                    </label>
                  </div>

                  <div className="mt-6 h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={
                          range === "7 days"
                            ? chartData
                            : [
                                { day: "Week 1", applications: 210 },
                                { day: "Week 2", applications: 245 },
                                { day: "Week 3", applications: 228 },
                                { day: "Week 4", applications: 276 },
                              ]
                        }
                        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="applicationFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#386db0"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="95%"
                              stopColor="#386db0"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          stroke="#eef1f6"
                          strokeDasharray="4 4"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 10,
                            border: "1px solid #e2e8f0",
                            fontSize: 12,
                            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="applications"
                          name="Applications"
                          stroke="#386db0"
                          strokeWidth={2.5}
                          fill="url(#applicationFill)"
                          activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-[#386db0]" />
                    Applications received
                    <span className="ml-auto font-medium text-slate-700">
                      {range === "7 days" ? "363 total" : "959 total"}
                    </span>
                  </div>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">Review queue</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Items that need attention
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                      <Users size={18} />
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <button
                      onClick={() => {
                        changeStatus("Under Review");
                        navigate("Applications");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                        <ShieldCheck size={19} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          Analyst review
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Awaiting human assessment
                        </span>
                      </span>
                      <span className="text-xl font-semibold">12</span>
                    </button>

                    <button
                      onClick={() => navigate("Documents")}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                        <FileCheck2 size={19} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          Document verification
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Pending document checks
                        </span>
                      </span>
                      <span className="text-xl font-semibold">18</span>
                    </button>

                    <button
                      onClick={() => navigate("Findings")}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                        <CircleAlert size={19} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          Flagged findings
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Require further investigation
                        </span>
                      </span>
                      <span className="text-xl font-semibold">8</span>
                    </button>
                  </div>

                  <div className="mt-4 rounded-lg bg-[#f3f6fb] p-3">
                    <p className="text-xs leading-5 text-slate-600">
                      AI findings are recommendations. Final credit decisions
                      remain with authorized human analysts.
                    </p>
                  </div>
                </article>
              </section>

              <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h3 className="font-semibold">Recent applications</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Track incoming applications and their current status
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("Applications")}
                    className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#19477f] hover:text-[#123660]"
                  >
                    View all <ArrowRight size={15} />
                  </button>
                </div>

                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-6">
                  <div className="relative min-w-0 flex-1 sm:max-w-sm">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      aria-label="Search applications"
                      value={search}
                      onChange={(event) => changeSearch(event.target.value)}
                      placeholder="Search customer, ID or product..."
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <SlidersHorizontal size={16} className="text-slate-400" />
                    <select
                      aria-label="Filter by application status"
                      value={statusFilter}
                      onChange={(event) => changeStatus(event.target.value)}
                      className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      <option>All statuses</option>
                      <option>Submitted</option>
                      <option>Under Verification</option>
                      <option>Under Review</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                    </select>

                    <select
                      aria-label="Sort applications"
                      value={sortOrder}
                      onChange={(event) => {
                        setSortOrder(event.target.value);
                        setPage(1);
                      }}
                      className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      <option>Newest first</option>
                      <option>Amount: high to low</option>
                      <option>Amount: low to high</option>
                    </select>

                    {(search ||
                      statusFilter !== "All statuses" ||
                      sortOrder !== "Newest first") && (
                      <button
                        onClick={resetFilters}
                        className="text-xs font-semibold text-[#19477f] hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] border-collapse text-left">
                    <thead>
                      <tr className="border-y border-slate-100 bg-slate-50/70">
                        <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Application ID
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Loan product
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            Amount <ArrowDown size={12} />
                          </span>
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Risk band
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visibleApplications.map((application) => (
                        <tr
                          key={application.id}
                          className="transition hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf3fc] text-xs font-semibold text-[#19477f]">
                                {application.initials}
                              </span>
                              <span className="whitespace-nowrap text-sm font-medium text-slate-800">
                                {application.customer}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs font-medium text-slate-500">
                            {application.id}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            {application.product}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-800">
                            {formatINR(application.amount)}
                          </td>
                          <td className="px-4 py-4">
                            <RiskBadge risk={application.risk} />
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={application.status} />
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                            {application.submitted}
                          </td>
                        </tr>
                      ))}

                      {visibleApplications.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <Search
                              size={24}
                              className="mx-auto text-slate-300"
                            />
                            <p className="mt-3 text-sm font-medium text-slate-700">
                              No applications found
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Try another search term or status filter.
                            </p>
                            <button
                              onClick={resetFilters}
                              className="mt-3 text-sm font-semibold text-[#19477f]"
                            >
                              Clear filters
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <span>
                    {filteredApplications.length === 0
                      ? "No results"
                      : `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filteredApplications.length)} of ${filteredApplications.length} applications`}
                  </span>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      aria-label="Previous page"
                      disabled={safePage === 1}
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-1">
                      Page {safePage} of {totalPages}
                    </span>
                    <button
                      aria-label="Next page"
                      disabled={safePage === totalPages}
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </section>
            </>
          ) : activePage === "Analyst Review" ? (
            <AnalystReview />
          ) : (
            <section className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3fc] text-[#19477f]">
                {activePage === "Applications" && (
                  <BriefcaseBusiness size={26} />
                )}
                {activePage === "Documents" && <FileText size={26} />}
                {activePage === "Findings" && <CircleAlert size={26} />}
              </span>
              <h2 className="mt-5 text-xl font-semibold">{activePage}</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                This module will be implemented next. Its navigation is
                connected to this dashboard shell, but the full workflow is not
                yet available.
              </p>
              <button
                onClick={() => navigate("Dashboard")}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#19477f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#123660]"
              >
                Return to dashboard <ArrowRight size={16} />
              </button>
            </section>
          )}

          <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Kestrel Bank · LoanLens AI</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} />
              Secure lending workspace · Synthetic demo data
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <AppContent />
    </PreferencesProvider>
  );
}
