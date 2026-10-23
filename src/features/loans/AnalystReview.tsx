import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  AlertTriangle,
  ShieldCheck,
  UserRound,
  Wallet,
  BriefcaseBusiness,
  Eye,
  X,
  Info,
  Activity,
  CircleDashed,
  ClipboardCheck,
  Scale,
  GitCompareArrows,
  History,
  LockKeyhole,
  Send,
  RefreshCw,
} from "lucide-react";

type Severity = "Critical" | "High" | "Medium" | "Low";

type Finding = {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  evidence: string;
  source: string;
  recommendation: string;
  resolved: boolean;
};

const documents = [
  {
    name: "PAN Card",
    type: "Identity proof",
    status: "Verified",
    detail: "Name and masked identifier match the application.",
    icon: FileCheck2,
  },
  {
    name: "Aadhaar Card",
    type: "Address proof",
    status: "Verified",
    detail: "Address extracted. Identifier masked in this demo.",
    icon: FileCheck2,
  },
  {
    name: "Salary Slip — September",
    type: "Income proof",
    status: "Needs review",
    detail: "Extracted net salary differs from the declared amount.",
    icon: FileText,
  },
  {
    name: "Bank Statement",
    type: "Financial record",
    status: "Pending",
    detail: "Awaiting manual review of salary credits.",
    icon: Clock3,
  },
  {
    name: "Employment Letter",
    type: "Employment proof",
    status: "Missing",
    detail: "No employment letter is available in the demo record.",
    icon: AlertTriangle,
  },
];

const initialFindings: Finding[] = [
  {
    id: "F-001",
    title: "Income discrepancy",
    severity: "High",
    description:
      "The declared monthly income differs from the value extracted from the salary slip.",
    evidence:
      "Application: ₹85,000/month. Salary slip extraction: ₹78,500/month.",
    source: "Salary Slip — September",
    recommendation:
      "Review the original document and request clarification if required.",
    resolved: false,
  },
  {
    id: "F-002",
    title: "Employment evidence missing",
    severity: "Medium",
    description:
      "The employment letter is not present in the current document checklist.",
    evidence: "Employment letter: not received in this demo record.",
    source: "Document checklist",
    recommendation: "Request an employment letter or an accepted alternative.",
    resolved: false,
  },
  {
    id: "F-003",
    title: "Bank statement review pending",
    severity: "Medium",
    description:
      "Salary credits have not yet been confirmed through manual review.",
    evidence: "Bank statement review status: pending.",
    source: "Bank statement",
    recommendation:
      "Inspect relevant salary credits before completing the review.",
    resolved: false,
  },
  {
    id: "F-004",
    title: "Identity checks completed",
    severity: "Low",
    description:
      "The demo identity verification step completed without a reported mismatch.",
    evidence: "PAN and address proof marked verified in synthetic data.",
    source: "Identity documents",
    recommendation: "Retain the verification evidence in the review record.",
    resolved: true,
  },
];

const auditEvents = [
  {
    time: "10:42:03",
    title: "Application received",
    operation: "application.intake",
    status: "Completed",
    output: "Application KL-2026-1042 entered the review queue.",
  },
  {
    time: "10:42:15",
    title: "Document verification initiated",
    operation: "document.verify",
    status: "Completed",
    output:
      "Five expected document categories checked against the demo checklist.",
  },
  {
    time: "10:42:29",
    title: "Document fields extracted",
    operation: "document.extract_fields",
    status: "Needs attention",
    output:
      "Salary value extracted as ₹78,500. One employment document is missing.",
  },
  {
    time: "10:42:41",
    title: "Income values compared",
    operation: "income.compare",
    status: "Needs attention",
    output: "Declared income and extracted salary value do not match.",
  },
  {
    time: "10:43:02",
    title: "Credit assessment generated",
    operation: "credit.assess",
    status: "Completed",
    output: "Provisional Medium risk band generated for analyst review.",
  },
  {
    time: "10:43:16",
    title: "Compliance checks",
    operation: "compliance.check",
    status: "Completed",
    output: "Manual review remains necessary before a final decision.",
  },
];

const severityStyles: Record<Severity, string> = {
  Critical: "bg-rose-100 text-rose-800 ring-rose-200",
  High: "bg-orange-100 text-orange-800 ring-orange-200",
  Medium: "bg-amber-100 text-amber-800 ring-amber-200",
  Low: "bg-blue-100 text-blue-800 ring-blue-200",
};

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof FileText;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf3fc] text-[#19477f]">
        <Icon size={18} />
      </span>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${severityStyles[severity]}`}
    >
      {severity}
    </span>
  );
}

function AgentCard({
  title,
  icon: Icon,
  status,
  summary,
  details,
  updated,
}: {
  title: string;
  icon: typeof FileText;
  status: string;
  summary: string;
  details: string[];
  updated: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const attention = status === "Needs attention";
  const pending = status === "Pending";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[#19477f]">
          <Icon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <span
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
              attention
                ? "bg-amber-50 text-amber-800"
                : pending
                  ? "bg-slate-100 text-slate-600"
                  : "bg-emerald-50 text-emerald-800"
            }`}
          >
            {attention ? (
              <AlertTriangle size={12} />
            ) : pending ? (
              <Clock3 size={12} />
            ) : (
              <CheckCircle2 size={12} />
            )}
            {status}
          </span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{summary}</p>
      {expanded && (
        <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {details.map((detail) => (
            <li
              key={detail}
              className="flex gap-2 text-xs leading-5 text-slate-600"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#386db0]" />
              {detail}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="text-[11px] text-slate-400">{updated}</span>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#19477f] hover:underline"
        >
          {expanded ? "Show less" : "View evidence"}
          <ChevronDown size={13} className={expanded ? "rotate-180" : ""} />
        </button>
      </div>
    </article>
  );
}

export default function AnalystReview() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [findings, setFindings] = useState(initialFindings);
  const [expandedAudit, setExpandedAudit] = useState<number | null>(0);
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recordedDecision, setRecordedDecision] = useState("");
  const [decisionError, setDecisionError] = useState("");
  const [submissionError, setSubmissionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const selectedDoc = documents.find((doc) => doc.name === selectedDocument);
  const openFindings = findings.filter((finding) => !finding.resolved);
  const visibleFindings = findings.filter((finding) => {
    if (activeFilter === "All") return true;
    return finding.severity === activeFilter;
  });

  const incompleteEvidence = documents.some(
    (doc) => doc.status === "Missing" || doc.status === "Pending",
  );
  const canRecordDecision =
    Boolean(decision) &&
    reason.trim().length >= 10 &&
    !incompleteEvidence &&
    openFindings.length === 0;

  function confirmDecision() {
    if (!decision) {
      setDecisionError("Select a decision before continuing.");
      return;
    }
    if (reason.trim().length < 10) {
      setDecisionError("Enter a reason of at least 10 characters.");
      return;
    }
    if (incompleteEvidence || openFindings.length > 0) {
      setDecisionError(
        "Resolve outstanding evidence and findings before recording a final decision.",
      );
      return;
    }
    setDecisionError("");
    setShowConfirmation(true);
  }

  function recordHumanDecision() {
    if (submissionError) {
      setDecisionError(
        "Demo submission failed. Retry the simulated submission or cancel.",
      );
      setShowConfirmation(false);
      return;
    }
    setRecordedDecision(decision);
    setShowConfirmation(false);
  }

  function resetDemoSubmission() {
    setSubmissionError(false);
    setRetryCount((count) => count + 1);
    setDecisionError("");
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumb and title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
            <span>Workspace</span>
            <ChevronRight size={13} />
            <span>Analyst Review</span>
            <ChevronRight size={13} />
            <span className="font-medium text-slate-600">KL-2026-1042</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Credit Analyst Review
            </h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
              Under review
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Review the evidence, investigate findings, and record your decision.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500">
            <ShieldCheck size={15} className="text-emerald-600" />
            Internal review
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-900">
        <span className="font-semibold">Demonstration workspace.</span> All
        customer details, documents, agent outputs, timestamps, findings, and
        decisions on this screen are synthetic. No banking system or AI service
        is connected.
      </div>

      {/* Application summary */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <BriefcaseBusiness size={15} />
              Application ID
            </div>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              KL-2026-1042
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Personal Loan · Submitted 23 October 2026, 10:42 AM
            </p>
          </div>
          <div className="rounded-xl bg-[#edf3fc] px-5 py-4 sm:min-w-[210px]">
            <p className="text-xs font-medium text-[#19477f]">
              Requested loan amount
            </p>
            <p className="mt-1 text-2xl font-bold text-[#153b72]">₹4,50,000</p>
            <p className="mt-1 text-xs text-slate-500">Illustrative amount</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-start gap-3">
            <UserRound size={18} className="mt-1 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Customer</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                Aarav Sharma
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Customer ID: CUS-••4821
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wallet size={18} className="mt-1 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Declared monthly income</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                ₹85,000
              </p>
              <p className="mt-1 text-xs text-slate-500">Salary-based income</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Activity size={18} className="mt-1 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">
                Existing monthly obligations
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                ₹18,000
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Illustrative declared amount
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BriefcaseBusiness size={18} className="mt-1 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Employment</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                Salaried · Private sector
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tenure: 3 years (demo)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">
              Declared debt-to-income ratio
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">21.2%</p>
            <p className="mt-1 text-xs text-slate-500">
              Existing obligations ÷ declared income
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <p className="text-xs text-amber-800">Overall risk band</p>
            <p className="mt-1 text-lg font-bold text-amber-900">Medium</p>
            <p className="mt-1 text-xs text-amber-800">
              Provisional agent assessment; human review required
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Review stage</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              Evidence review
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {openFindings.length} unresolved findings
            </p>
          </div>
        </div>
      </section>

      {/* Findings and documents */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={AlertTriangle}
            title="Priority findings"
            subtitle="Investigate discrepancies and incomplete evidence before making a final decision."
          />
          <div className="mb-4 flex flex-wrap gap-2">
            {["All", "Critical", "High", "Medium", "Low"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  activeFilter === filter
                    ? "bg-[#19477f] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filter}
                {filter === "All" ? ` (${findings.length})` : ""}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {visibleFindings.map((finding) => (
              <article
                key={finding.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-400">
                    {finding.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={finding.severity} />
                    {finding.resolved && (
                      <span className="text-xs font-medium text-emerald-700">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-900">
                  {finding.title}
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {finding.description}
                </p>
                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-600">
                    Supporting evidence
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {finding.evidence}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Source: {finding.source}
                  </p>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-600">
                  <span className="font-semibold">Suggested next step: </span>
                  {finding.recommendation}
                </p>
                {!finding.resolved && (
                  <button
                    type="button"
                    onClick={() =>
                      setFindings((current) =>
                        current.map((item) =>
                          item.id === finding.id
                            ? { ...item, resolved: true }
                            : item,
                        ),
                      )
                    }
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Check size={14} />
                    Mark reviewed
                  </button>
                )}
              </article>
            ))}
            {visibleFindings.length === 0 && (
              <p className="rounded-lg bg-slate-50 p-5 text-sm text-slate-500">
                No findings match this severity filter.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={FileCheck2}
            title="Document checklist"
            subtitle="Synthetic document records. Select an item to inspect its demo preview."
          />
          <div className="space-y-3">
            {documents.map((doc) => {
              const Icon = doc.icon;
              const isVerified = doc.status === "Verified";
              const isMissing = doc.status === "Missing";
              return (
                <div
                  key={doc.name}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {doc.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{doc.type}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {doc.detail}
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${
                        isVerified
                          ? "bg-emerald-50 text-emerald-700"
                          : isMissing
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDocument(doc.name)}
                    aria-label={`Inspect ${doc.name}`}
                    className="rounded-lg p-2 text-[#19477f] hover:bg-blue-50"
                  >
                    <Eye size={17} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-xs leading-5 text-rose-800">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            Employment evidence is missing. Final decision recording is blocked
            until evidence and findings are reviewed.
          </div>
        </section>
      </div>

      {/* Agent assessment cards */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading
          icon={Activity}
          title="Agent assessments"
          subtitle="Illustrative agent outputs only. These are not live AI results or final credit decisions."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AgentCard
            title="Document Verification Agent"
            icon={FileCheck2}
            status="Needs attention"
            summary="Identity checks are marked complete in the demo record. Income evidence requires follow-up."
            details={[
              "5 document categories inspected",
              "1 missing employment document",
              "1 income discrepancy identified",
              "No actual document processing is connected",
            ]}
            updated="Demo event · 10:42 AM"
          />
          <AgentCard
            title="Credit Assessment Agent"
            icon={Scale}
            status="Completed"
            summary="Provisional Medium risk band based on synthetic declared income and obligations. The income discrepancy limits confidence."
            details={[
              "Declared income: ₹85,000/month",
              "Declared existing obligations: ₹18,000/month",
              "The risk band is illustrative, not a lending recommendation",
              "Analyst must verify all supporting evidence",
            ]}
            updated="Demo event · 10:43 AM"
          />
          <AgentCard
            title="Compliance Agent"
            icon={ShieldCheck}
            status="Needs attention"
            summary="A human review is needed to establish whether the evidence meets the applicable documentation requirements."
            details={[
              "Identity checklist marked complete in mock data",
              "Employment evidence remains outstanding",
              "No live policy engine is connected",
              "No compliance clearance is implied",
            ]}
            updated="Demo event · 10:43 AM"
          />
        </div>
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <Info size={17} className="mt-0.5 shrink-0 text-[#19477f]" />
            <div>
              <p className="text-sm font-semibold text-[#19477f]">
                Agent recommendation: REQUEST_ADDITIONAL_DOCUMENTS
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                This is a suggested next step generated from mock evidence. It
                is not a recorded decision. The human analyst must review the
                evidence and choose an action independently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence comparison */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading
          icon={GitCompareArrows}
          title="Evidence comparison"
          subtitle="Compare the declared value with extracted values. A discrepancy requires investigation; it does not establish fraud."
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Field
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Application
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Extracted evidence
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Assessment / policy
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Result
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-4 font-medium text-slate-800">
                  Monthly income
                </td>
                <td className="px-4 py-4 text-slate-600">₹85,000</td>
                <td className="px-4 py-4 text-slate-600">₹78,500</td>
                <td className="px-4 py-4 text-slate-600">
                  Requires analyst verification
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    Mismatch
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-slate-800">
                  Monthly obligations
                </td>
                <td className="px-4 py-4 text-slate-600">₹18,000</td>
                <td className="px-4 py-4 text-slate-600">Not yet confirmed</td>
                <td className="px-4 py-4 text-slate-600">
                  Bank statement review pending
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    Pending
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-slate-800">
                  Identity
                </td>
                <td className="px-4 py-4 text-slate-600">Provided</td>
                <td className="px-4 py-4 text-slate-600">
                  Marked verified in demo
                </td>
                <td className="px-4 py-4 text-slate-600">
                  Manual confirmation as required
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Match recorded
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-400">
          Extracted values are synthetic examples, not results from actual
          customer documents. No lending policy thresholds are asserted here.
        </p>
      </section>

      {/* Audit timeline */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading
          icon={History}
          title="Agent audit trail"
          subtitle="Chronological demonstration events showing operations and outputs, not hidden model reasoning."
        />
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
          <CircleDashed size={13} />
          Synthetic event history · 23 Oct 2026
        </div>
        <div className="space-y-3">
          {auditEvents.map((event, index) => {
            const expanded = expandedAudit === index;
            return (
              <div
                key={event.operation}
                className="rounded-lg border border-slate-200"
              >
                <button
                  type="button"
                  onClick={() => setExpandedAudit(expanded ? null : index)}
                  className="flex w-full items-center gap-3 p-3 text-left sm:p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf3fc] text-xs font-bold text-[#19477f]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      {event.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {event.time} · {event.operation}
                    </span>
                  </span>
                  <span
                    className={`hidden rounded-full px-2 py-1 text-[11px] font-medium sm:inline-flex ${
                      event.status === "Needs attention"
                        ? "bg-amber-50 text-amber-800"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {event.status}
                  </span>
                  {expanded ? (
                    <ChevronDown size={17} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={17} className="text-slate-400" />
                  )}
                </button>
                {expanded && (
                  <div className="border-t border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-600">
                      Recorded output
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {event.output}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      Operation: {event.operation} · Demo event, not a live tool
                      call
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Human decision panel */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading
          icon={ClipboardCheck}
          title="Human decision panel"
          subtitle="Final actions belong to the authorized Credit Analyst, not to the AI agents."
        />

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              {incompleteEvidence
                ? "Evidence incomplete"
                : openFindings.length > 0
                  ? "Findings unresolved"
                  : "Evidence checklist clear"}
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              {incompleteEvidence
                ? "A document is missing or pending. Resolve evidence gaps before a final decision."
                : openFindings.length > 0
                  ? `${openFindings.length} findings remain open. Review and resolve them before a final decision.`
                  : "No missing or pending documents remain in this demo checklist."}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Decision recording status
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {recordedDecision
                ? `Demo decision recorded: ${recordedDecision}`
                : "Pending human decision. No final decision has been recorded."}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3fc] text-[#19477f]">
              <LockKeyhole size={19} />
            </span>
            <div>
              <h4 className="font-semibold text-slate-900">Analyst action</h4>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                UI demonstration only. This frontend does not authenticate users
                or enforce server-side authorization.
              </p>
            </div>
          </div>

          <fieldset disabled={Boolean(recordedDecision)}>
            <legend className="mb-3 text-sm font-semibold text-slate-700">
              Select a human action
            </legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  value: "Request additional documents",
                  description: "Request missing evidence or clarification.",
                },
                {
                  value: "Escalate for further review",
                  description: "Send the case for additional review.",
                },
                {
                  value: "Approve",
                  description: "Record approval after all checks are complete.",
                },
                {
                  value: "Reject",
                  description: "Record rejection with a documented rationale.",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                    decision === option.value
                      ? "border-[#19477f] bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="human-decision"
                    value={option.value}
                    checked={decision === option.value}
                    onChange={(event) => {
                      setDecision(event.target.value);
                      setDecisionError("");
                    }}
                    className="mt-1 accent-[#19477f]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      {option.value}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <label
              htmlFor="decision-reason"
              className="mt-5 block text-sm font-semibold text-slate-700"
            >
              Decision rationale <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="decision-reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setDecisionError("");
              }}
              rows={4}
              placeholder="Document the evidence reviewed and explain the reason for your selected action..."
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-xs text-slate-400">
              Minimum 10 characters. Required before confirmation.
            </p>

            {(incompleteEvidence || openFindings.length > 0) && (
              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-amber-800">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                Final decision submission is blocked while evidence is
                incomplete or findings remain unresolved. You can select Request
                additional documents or Escalate for further review, but the
                demo requires the checklist to be clear before recording any
                action.
              </p>
            )}

            {decisionError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {decisionError}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={confirmDecision}
                disabled={!canRecordDecision}
                title={
                  !canRecordDecision
                    ? "Resolve incomplete evidence and findings, then provide a decision and reason."
                    : "Review and confirm your decision"
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#19477f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#123660] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={15} />
                Review decision
              </button>
              <button
                type="button"
                onClick={() => {
                  setDecision("");
                  setReason("");
                  setDecisionError("");
                }}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear form
              </button>
            </div>
          </fieldset>

          {recordedDecision && (
            <div
              role="status"
              className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-emerald-700" />
                <div>
                  <p className="font-semibold text-emerald-900">
                    Demo decision recorded
                  </p>
                  <p className="mt-1 text-sm text-emerald-800">
                    {recordedDecision}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-emerald-800">
                    Rationale: {reason}
                  </p>
                  <p className="mt-2 text-xs text-emerald-700">
                    This confirmation exists only in local component state. It
                    has not been saved to a backend.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showConfirmation && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <h4 className="font-semibold text-[#19477f]">
                Confirm human decision
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                You are about to record <strong>{decision}</strong> for
                application KL-2026-1042. Please verify that the rationale is
                accurate.
              </p>
              <div className="mt-3 rounded-lg bg-white p-3 text-sm text-slate-600">
                {reason}
              </div>
              {submissionError && (
                <p role="alert" className="mt-3 text-sm text-rose-700">
                  Simulated submission error. Retry to clear the demo error,
                  then confirm again.
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={recordHumanDecision}
                  className="rounded-lg bg-[#19477f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#123660]"
                >
                  Confirm and record
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionError(true);
                    setDecisionError("");
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600"
                >
                  <X size={13} />
                  Simulate error
                </button>
                {submissionError && (
                  <button
                    type="button"
                    onClick={resetDemoSubmission}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600"
                  >
                    <RefreshCw size={13} />
                    Retry ({retryCount})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Document preview dialog */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setSelectedDocument(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="document-preview-title"
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3fc] text-[#19477f]">
                  <FileText size={20} />
                </span>
                <div>
                  <h3
                    id="document-preview-title"
                    className="font-semibold text-slate-900"
                  >
                    {selectedDoc.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedDoc.type} · Synthetic preview
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close document preview"
                onClick={() => setSelectedDocument(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <FileText size={36} className="text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                No actual document attached
              </p>
              <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                This preview is a placeholder for the future document viewer. No
                real file has been uploaded or processed.
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-600">
                Demo verification status
              </p>
              <p className="mt-2 text-sm text-slate-800">
                {selectedDoc.status}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {selectedDoc.detail}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDocument(null)}
              className="mt-5 w-full rounded-lg bg-[#19477f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#123660]"
            >
              Close preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
