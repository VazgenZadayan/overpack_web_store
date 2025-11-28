// Root layout is now handled by [lang]/layout.tsx
// This file is kept for backward compatibility but should not be used
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
