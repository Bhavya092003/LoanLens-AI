import { useState, type FormEvent } from "react";
import {
  Bot,
  X,
  Send,
  MessageCircle,
  Sparkles,
  UserRound,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const suggestions = [
  "What documents do I need?",
  "How is EMI calculated?",
  "How does loan eligibility work?",
];

function getDemoReply(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("document")) {
    return "Common loan documents include identity and address proof, PAN, income proof, and bank statements. Requirements vary by loan type. Please confirm the checklist with the bank.";
  }

  if (q.includes("emi") || q.includes("monthly payment")) {
    return "Your EMI depends on the loan amount, annual interest rate, and repayment tenure. You can use the loan calculator on the Loan Details screen to estimate your monthly payment.";
  }

  if (q.includes("eligibility") || q.includes("eligible")) {
    return "Loan eligibility may depend on verified income, existing financial obligations, credit history, and the selected loan product. Final approval is subject to credit assessment.";
  }

  if (q.includes("interest") || q.includes("rate")) {
    return "Interest rates vary by loan product and applicant circumstances. Please check Kestrel Bank's official rate information for current terms.";
  }

  return "I can help with general questions about loan documents, EMI calculations, interest rates, and eligibility. Try one of the suggested questions. For verified answers, consult the bank's official policy documents.";
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! 👋 I'm the LoanLens AI Assistant. Ask me about loan documents, EMI, or eligibility.",
    },
  ]);

  function sendMessage(text: string) {
    const question = text.trim();
    if (!question) return;

    const answer = getDemoReply(question);

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
      { role: "assistant", text: answer },
    ]);

    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <section className="mb-4 flex h-120 w-[calc(100vw-2.5rem)] max-w-92.5 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Chat header */}
          {/* <div className="flex items-center justify-between bg--to-r from-blue-800 to-blue-600 p-4 text-white"> */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-800 to-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2">
                <Bot size={23} />
              </div>
              <div>
                <h2 className="font-bold">LoanLens AI</h2>
                <p className="text-xs text-blue-100">
                  Loan Policy Assistant · Demo
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="rounded-lg p-2 transition hover:bg-white/15"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex items-start gap-2 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    message.role === "assistant"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot size={16} />
                  ) : (
                    <UserRound size={16} />
                  )}
                </div>

                <div
                  className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3 py-2.5 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-tr-sm bg-blue-700 text-white"
                      : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="space-y-2 pt-2">
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Sparkles size={14} />
                  Suggested questions
                </p>

                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left text-xs text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your loan..."
              aria-label="Type your message"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="rounded-xl bg-blue-700 p-3 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </form>

          <p className="bg-white px-3 pb-3 text-center text-[10px] text-slate-400">
            Demo answers only. Verify official bank policies.
          </p>
        </section>
      )}

      {/* Floating chat button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close assistant" : "Open AI assistant"}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-xl transition hover:scale-105 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        {isOpen ? (
          <X size={25} />
        ) : (
          <MessageCircle size={25} />
        )}
      </button>
    </div>
  );
}
