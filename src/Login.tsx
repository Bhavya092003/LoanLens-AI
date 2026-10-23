
import { useState } from "react";
import { Moon, Sun, Languages, ShieldCheck, UserRound, Landmark } from "lucide-react";
import { usePreferences } from "./context/PreferencesContext";

type LoginProps = {
  onLogin: (role: "admin" | "customer") => void;
};

export default function Login({ onLogin }: LoginProps) {
  const { theme, language, setLanguage, toggleTheme } = usePreferences();
  const [role, setRole] = useState<"admin" | "customer">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isHindi = language === "hi";

  const copy = isHindi
    ? {
        welcome: "LoanLens AI में आपका स्वागत है",
        subtitle: "Kestrel Bank का स्मार्ट लोन प्लेटफ़ॉर्म",
        email: "ईमेल पता",
        password: "पासवर्ड",
        choose: "अपनी भूमिका चुनें",
        customer: "ग्राहक",
        admin: "एडमिन",
        customerDesc: "अपने लोन और भुगतान देखें",
        adminDesc: "लोन आवेदनों की समीक्षा करें",
        signIn: "लॉग इन करें",
        note: "डेमो लॉगिन — अभी वास्तविक प्रमाणीकरण उपलब्ध नहीं है",
      }
    : {
        welcome: "Welcome to LoanLens AI",
        subtitle: "Smart lending by Kestrel Bank",
        email: "Email address",
        password: "Password",
        choose: "Choose your role",
        customer: "Customer",
        admin: "Admin",
        customerDesc: "View your loans and repayments",
        adminDesc: "Review applications and lending insights",
        signIn: "Sign In",
        note: "Demo login — real authentication is not connected yet",
      };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(role);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="absolute right-5 top-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            theme === "dark"
              ? "border-slate-700 hover:bg-slate-800"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
          aria-label="Change language"
        >
          <Languages size={16} />
          {language === "en" ? "हिन्दी" : "English"}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className={`rounded-lg border p-2 ${
            theme === "dark"
              ? "border-slate-700 hover:bg-slate-800"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div
        className={`w-full max-w-md overflow-hidden rounded-2xl border shadow-xl ${
          theme === "dark"
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-7 text-white">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <Landmark size={28} />
            </div>
            <div>
              <p className="text-lg font-bold">Kestrel Bank</p>
              <p className="text-sm text-blue-100">LoanLens AI</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold">{copy.welcome}</h1>
          <p className="mt-2 text-sm text-blue-100">{copy.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {copy.choose}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`rounded-xl border p-4 text-left transition ${
                  role === "customer"
                    ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500"
                    : theme === "dark"
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <UserRound
                  className="mb-3 text-blue-500"
                  size={23}
                />
                <span className="block font-semibold">{copy.customer}</span>
                <span
                  className={`mt-1 block text-xs ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {copy.customerDesc}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`rounded-xl border p-4 text-left transition ${
                  role === "admin"
                    ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500"
                    : theme === "dark"
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <ShieldCheck
                  className="mb-3 text-indigo-500"
                  size={23}
                />
                <span className="block font-semibold">{copy.admin}</span>
                <span
                  className={`mt-1 block text-xs ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {copy.adminDesc}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium"
            >
              {copy.email}
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                theme === "dark"
                  ? "border-slate-700 bg-slate-800 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium"
            >
              {copy.password}
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                theme === "dark"
                  ? "border-slate-700 bg-slate-800 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {copy.signIn} as {role === "admin" ? copy.admin : copy.customer}
          </button>

          <p
            className={`text-center text-xs ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {copy.note}
          </p>
        </form>
      </div>
    </div>
  );
}
