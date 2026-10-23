# 🏦 LoanLens AI
### Smarter Lending. Clearer Decisions. Better Banking.

**An AI-powered digital lending and credit advisory platform for Kestrel Bank.**

LoanLens AI is a modern digital banking experience designed to simplify loan discovery, streamline loan applications, and support credit analysts with an intuitive workspace. It brings customers and banking professionals together through a unified interface featuring loan calculators, application tracking, credit assessment workflows, and an AI-powered loan assistance chatbot.

Built as part of a hackathon project, LoanLens AI combines a modern React frontend with a planned Java and Spring Boot backend architecture to explore how AI can improve the digital lending journey.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Enabled-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-Powered-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## ✨ Overview

Traditional lending journeys can involve complicated eligibility requirements, document collection, EMI calculations, and time-consuming credit reviews. LoanLens AI aims to make this experience simpler through a customer-facing lending portal and an internal credit analyst dashboard.

The platform provides role-based demo experiences for:

- 👤 **Customers** — explore loan products, estimate EMIs, submit applications, and access loan assistance.
- 🛡️ **Administrators and credit analysts** — explore an internal dashboard with application information, analytics, document-related workflows, and review-oriented screens.

The application currently uses illustrative frontend data and demo interactions. Backend integration and live AI capabilities are not implied by the current frontend.

## 🚀 Key Features

### 1. 🔐 Role-Based Login Experience

- Dedicated login screen with customer and administrator roles.
- Role-specific dashboards and navigation.
- Login and logout interactions.
- Integrated language and theme controls.
- No predefined demo credentials are required.

### 2. 👤 Customer Dashboard

A centralized view for customers to access their lending information.

- Overview of illustrative loan balances and EMI information.
- Loan application summaries and status information.
- Quick access to loan discovery.
- Customer profile and KYC-related information.
- Access to the LoanLens AI chatbot.
- Dark mode and language preferences.

### 3. 💳 Digital Loan Discovery

Explore different loan products through a dedicated loan discovery interface.

- Personal loans.
- Home loans.
- Vehicle loans.
- Education loans.
- Loan information and product comparisons.
- EMI estimation tools.
- Entry point to the loan application journey.

### 4. 🧮 EMI Calculator

Estimate monthly loan repayments using the key factors that influence borrowing costs.

- Principal loan amount.
- Annual interest rate.
- Repayment tenure.
- Estimated monthly EMI.

The standard EMI formula is:

\[
EMI = \frac{P \times r \times (1+r)^n}{(1+r)^n-1}
\]

Where:

- \(P\) = Principal loan amount.
- \(r\) = Monthly interest rate.
- \(n\) = Total number of monthly instalments.

Actual loan terms depend on the lender's applicable rates, fees, and conditions.

### 5. 📝 Multi-Step Loan Application

A guided application experience designed to make loan applications easier to complete.

- Structured application steps.
- Loan-type selection.
- Customer information collection.
- Form-based application workflow.
- Navigation between application stages.

The current frontend demonstrates the application journey; persistent submission and backend processing require integration.

### 6. 🤖 LoanLens AI Chatbot

A floating chatbot available from the customer dashboard.

It provides predefined demo responses to common questions about:

- 📄 Required loan documents.
- 🧮 EMI calculations.
- ✅ Loan eligibility.
- 📈 Interest rates and loan terms.

The chatbot also includes suggested questions, a conversational message interface, and a disclaimer reminding users to verify official bank policies.

**Current implementation:** The chatbot uses predefined responses rather than a live LLM. AI model integration and retrieval-augmented generation (RAG) are part of the broader project architecture, not capabilities to assume are already connected.

### 7. 🛡️ Credit Analyst Workspace

An internal workspace designed to support loan application reviews.

- Application overview and review-oriented information.
- Document checklist concepts.
- Risk-band and assessment information.
- Audit-trail-oriented interface.
- Navigation for analyst review workflows.

These interfaces use demo data where applicable. Actual credit decisions require verified data, backend logic, and appropriate authorization.

### 8. 📊 Administrator Dashboard

An internal dashboard for exploring lending operations and application information.

- Application overview.
- Application table and status information.
- Search, filters, sorting, and pagination where implemented.
- Data visualizations and summary charts.
- Notifications and profile menu.
- Sign-out functionality.

### 9. 🌙 Dark Mode and Multilingual Support

- Shared theme preferences across supported screens.
- Dark and light appearance modes.
- Internationalization using `i18next` and `react-i18next`.
- Language controls for the supported translations.

Translation coverage depends on the configured translation resources and the individual screen.

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| TypeScript | Type safety and maintainable code |
| Vite | Development server and build tooling |
| Tailwind CSS v4 | Utility-first styling and responsive layouts |
| shadcn/ui | Reusable UI components and design foundations |
| Lucide React | Icons |
| Recharts | Data visualizations |
| React Router | Routing support |
| React Hook Form | Form management |
| Zod | Schema validation |
| Axios | HTTP client for future API integration |
| Zustand | Lightweight state-management option |
| TanStack Query | Server-state and API data management |
| i18next | Internationalization |
| react-i18next | React integration for translations |
| Sonner | Toast notifications |

*The stack lists libraries used or installed during frontend development; not every library necessarily powers a currently visible feature.*

### Planned Backend and Data Layer

| Technology | Intended purpose |
|---|---|
| Java | Backend programming language |
| Spring Boot 3 | REST APIs and application services |
| Spring AI | AI application integration |
| PostgreSQL | Relational data storage |
| pgvector | Vector similarity search for retrieval-based AI features |

**Architecture note:** The Java, Spring Boot, Spring AI, PostgreSQL, and pgvector components describe the intended backend stack. The current frontend demo should not be treated as evidence that these services are already connected.

---

## 🔑 Demo Login Credentials

You can explore the frontend without setting up a username or password.

| Field | Demo behavior |
|---|---|
| Email | Enter any email |
| Password | Enter any password |
| Role | Select Customer or Admin |
| Account creation | Not required for the demo |

**Important:** Login is currently a frontend demonstration. Credentials are not verified against a backend, and selecting a role changes the displayed interface. This is not secure authentication and must not be used to protect real customer or banking data.

---

## ⚙️ Getting Started

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) — a recent version compatible with the project.
- npm — included with Node.js.
- [Git](https://git-scm.com/) — for version control.

### 1. Clone the repository

```bash
git clone https://github.com/Bhavya092003/HCL-Hackathon.git
cd HCL-Hackathon
```

### 2. Navigate to the frontend

If the React project is located in the repository root, continue directly. If it is inside a subdirectory, navigate to that directory.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in the terminal, usually:

```text
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

To run the production build locally for a preview:

```bash
npm run preview
```

---

## 📁 Project Structure

The frontend is organized around dashboard screens, reusable components, and loan-related features. The exact structure may evolve as development continues.

```text
loanlens-ai/
├── public/
├── src/
│   ├── features/
│   │   └── loans/
│   │       ├── ChatBot.tsx
│   │       ├── LoanDiscovery.tsx
│   │       └── LoanApplication.tsx
│   ├── context/
│   │   └── PreferencesContext.tsx
│   ├── App.tsx
│   ├── Login.tsx
│   ├── CustomerDashboard.tsx
│   └── main.tsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🧠 Vision and Future Scope

LoanLens AI is designed to evolve into a more comprehensive digital lending platform.

Potential next steps include:

- 🔗 Integrate the React frontend with Spring Boot REST APIs.
- 🗄️ Store customer profiles, loan applications, and application statuses in PostgreSQL.
- 🔒 Implement secure authentication, authorization, and role-based API access.
- 📄 Add secure document upload, storage, and verification workflows.
- 🧠 Integrate an LLM-backed loan assistant with retrieval-augmented generation (RAG).
- 🔍 Use pgvector for semantic retrieval over approved loan policies and documentation.
- 📋 Connect analyst reviews and audit trails to persistent backend data.
- 📊 Replace illustrative dashboard data with validated analytics.
- 🧪 Add automated tests, error handling, and deployment pipelines.

These are potential development directions, not claims that the features are already implemented.

## 🔐 Security and Data Disclaimer

- The application is a hackathon/demo project.
- The frontend uses illustrative data and predefined chatbot replies in the current demo.
- Do not enter real passwords, bank account details, PAN information, identity documents, or other sensitive personal data.
- The demo login does not provide real authentication or authorization.
- Loan estimates are illustrative and are not financial advice, an offer of credit, or a loan approval.
- Verify actual rates, eligibility, fees, and document requirements with the relevant bank.

## 👨‍💻 Author

**Bhavya Singh**

GitHub: [@Bhavya092003](https://github.com/Bhavya092003)

Project repository: [HCL-Hackathon](https://github.com/Bhavya092003/HCL-Hackathon)

---

<p align="center">
  <strong>LoanLens AI — Making the lending journey clearer, simpler, and more accessible.</strong>
</p>
