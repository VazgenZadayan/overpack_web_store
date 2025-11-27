# Overpack Web Store

Web version of Overpack - Hookah Market online store built with Next.js 16, TypeScript, Tailwind CSS, Redux Toolkit, and i18next.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Redux Toolkit** - State management
- **redux-persist** - State persistence
- **i18next** - Internationalization (en, ru, hy)
- **React Hook Form + Yup** - Form handling and validation

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_DOMAIN=your_api_domain_here
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
web/
├── app/              # Next.js App Router pages
├── components/       # React components
├── services/         # API services
├── shared/           # Shared utilities (i18n, providers)
├── store/            # Redux store
└── utils/            # Utility functions
```

## Features

- 🔐 Authentication (SMS-based)
- 🛒 Shopping cart
- 🌍 Multi-language support (English, Russian, Armenian)
- 📱 Responsive design
- 🎨 Dark/Light theme support
