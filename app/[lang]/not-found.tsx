'use client';

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Logo } from "@/shared/icons/Logo";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const params = useParams();
  const pathname = usePathname();
  const t = useTranslations('notFound');
  
  let lang = params?.lang as string;
  if (!lang && pathname) {
    const pathSegments = pathname.split('/').filter(Boolean);
    lang = pathSegments[0] || 'en';
  }
  if (!lang || !['en', 'ru', 'hy'].includes(lang)) {
    lang = 'en';
  }

  return (
    <div
      style={{
        margin: 0,
        fontFamily: "inherit",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        paddingBottom: '100px',
      }}
    >
      <div style={{ width: '480px', maxWidth: '100%', marginBottom: '40px' }}>
        <Logo theme="light" />
      </div>
      <h1
        style={{
          fontSize: "clamp(3rem, 8vw, 6rem)",
          margin: 0,
          color: "#222",
          fontWeight: 800,
          letterSpacing: "-2px",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          margin: "16px 0 8px",
          color: "#444",
          fontWeight: 700,
        }}
      >
        {t('title')}
      </h2>
      <p
        style={{
          color: "#666",
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          marginBottom: 32,
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        {t('description')}
      </p>
      <Link
        href={`/${lang}/`}
        style={{
          display: "inline-block",
          background: "#222",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: 32,
          fontWeight: 600,
          fontSize: "1.1rem",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#333";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#222";
        }}
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}
