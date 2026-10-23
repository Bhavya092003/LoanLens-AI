import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import i18n from "../i18n";

export type Theme = "light" | "dark";
export type Language = "en" | "hi";

type PreferencesContextType = {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    applications: "Applications",
    documents: "Documents",
    findings: "Findings",
    analystReview: "Analyst Review",
    exploreLoans: "Explore loans",
    backToDashboard: "Back to dashboard",
    workspace: "Workspace",
    systemStatus: "System status",
    demoEnvironment: "Demo environment",
    language: "Language",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    settings: "Settings",
    search: "Search",
    emiCalculator: "EMI calculator",
    loanAdvisor: "Loan Advisor",
    compare: "Compare",
    clear: "Clear",
    cancel: "Cancel",
    submit: "Submit",
    loading: "Loading...",
    noResults: "No results found",

    dashboardTitle: "Dashboard",
    goodMorning: "Good morning",
    dashboardSubtitle:
      "Here's what's happening with your lending portfolio today.",
    viewApplications: "View applications",
    totalApplications: "Total applications",
    pendingReviews: "Pending reviews",
    flaggedFindings: "Flagged findings",
    processedThisMonth: "Processed this month",
    applicationOverview: "Application overview",
    applicationsReceived: "Applications received over the selected period",
    reviewQueue: "Review queue",
    itemsNeedAttention: "Items that need attention",
    documentVerification: "Document verification",
    awaitingAssessment: "Awaiting human assessment",
    pendingDocumentChecks: "Pending document checks",
    last7Days: "Last 7 days",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    applications: "आवेदन",
    documents: "दस्तावेज़",
    findings: "निष्कर्ष",
    analystReview: "विश्लेषक समीक्षा",
    exploreLoans: "लोन देखें",
    backToDashboard: "डैशबोर्ड पर वापस जाएँ",
    workspace: "कार्यक्षेत्र",
    systemStatus: "सिस्टम स्थिति",
    demoEnvironment: "डेमो वातावरण",
    language: "भाषा",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    settings: "सेटिंग्स",
    search: "खोजें",
    emiCalculator: "EMI कैलकुलेटर",
    loanAdvisor: "लोन सलाहकार",
    compare: "तुलना करें",
    clear: "साफ़ करें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    loading: "लोड हो रहा है...",
    noResults: "कोई परिणाम नहीं मिला",

    dashboardTitle: "डैशबोर्ड",
    goodMorning: "सुप्रभात",
    dashboardSubtitle: "आज आपके ऋण पोर्टफोलियो में क्या हो रहा है, यहाँ देखें।",
    viewApplications: "आवेदन देखें",
    totalApplications: "कुल आवेदन",
    pendingReviews: "समीक्षाधीन आवेदन",
    flaggedFindings: "चिह्नित निष्कर्ष",
    processedThisMonth: "इस महीने संसाधित",
    applicationOverview: "आवेदनों का विवरण",
    applicationsReceived: "चुनी गई अवधि में प्राप्त आवेदन",
    reviewQueue: "समीक्षा सूची",
    itemsNeedAttention: "जिन मामलों पर ध्यान देना है",
    documentVerification: "दस्तावेज़ सत्यापन",
    awaitingAssessment: "विश्लेषक की समीक्षा की प्रतीक्षा में",
    pendingDocumentChecks: "दस्तावेज़ जाँच लंबित",
    last7Days: "पिछले 7 दिन",
  },
};

function getSavedTheme(): Theme {
  try {
    return localStorage.getItem("loanlens-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function getSavedLanguage(): Language {
  try {
    return localStorage.getItem("loanlens-language") === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);
  const [language, setLanguage] = useState<Language>(getSavedLanguage);

  useEffect(() => {
    i18n.changeLanguage(language);

    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;

    try {
      localStorage.setItem("loanlens-theme", theme);
      localStorage.setItem("loanlens-language", language);
    } catch {
      // Preferences still work for the current session.
    }
  }, [theme, language]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const t = (key: string) =>
    translations[language][key] ?? translations.en[key] ?? key;

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        language,
        setTheme,
        setLanguage,
        toggleTheme,
        t,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider.");
  }

  return context;
}
