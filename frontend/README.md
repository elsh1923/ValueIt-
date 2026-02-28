# Frontend - Cost-Based Valuation System

A modern Next.js dashboard for managing property valuations.

## Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State/Data**: Axios, React Hook Form
- **Animations**: Framer Motion

## Getting Started

### 1. Installation

```bash
npm install
```

### 4. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Directory Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/ui/`: Reusable primitive components (Radix UI based).
- `src/components/project/`: Feature-specific components.
- `src/contexts/`: React Contexts (e.g., AuthContext).
- `src/lib/`: Utility functions and shared helpers.

## Contribution Notes

- Use Functional Components with TypeScript.
- Follow the existing design system (Deep Blue, Gold, and Glassmorphism).
- Ensure all new components are responsive.
