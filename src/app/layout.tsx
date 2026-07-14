import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Maduvedibbana | Okkaliga Community Matrimony",
  description:
    "Find your perfect life partner within the Okkaliga community. Trusted matrimony platform by Utthana Uttara Kannada Okkalu Sangama, Bengaluru.",
  keywords: [
    "matrimony",
    "okkaliga",
    "kannada matrimony",
    "maduvedibbana",
    "community marriage",
  ],
};

// Helper: read env vars via dynamic key access so Next.js does NOT
// statically inline them at build time. This ensures they are read
// from the actual runtime environment on the server.
function getRuntimeEnv(key: string): string {
  return process.env[key] || '';
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read env vars at RUNTIME (not build time) using dynamic access
  const supabaseUrl = getRuntimeEnv('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnon = getRuntimeEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const isEnvMissing = !supabaseUrl || !supabaseAnon;

  if (isEnvMissing) {
    return (
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body style={{ 
          margin: 0, padding: "40px 20px", 
          background: "#fafcff", 
          fontFamily: "var(--font-inter), sans-serif", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "100vh",
          boxSizing: "border-box",
        }}>
          <div style={{
            maxWidth: "600px", width: "100%", 
            background: "#fff", borderRadius: "24px", 
            padding: "40px", boxShadow: "0 20px 50px rgba(30,42,68,0.08)",
            border: "1px solid rgba(198,165,92,0.2)",
            textAlign: "center"
          }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "rgba(198,165,92,0.1)",
              display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 24px",
            }}>
              <span style={{ fontSize: "36px" }}>🛡️</span>
            </div>

            <h1 style={{ 
              fontFamily: "var(--font-playfair), serif", 
              fontSize: "26px", fontWeight: 700, 
              color: "#1e2a44", margin: "0 0 12px 0" 
            }}>
              Supabase Configuration Required
            </h1>
            
            <p style={{ fontSize: "14px", color: "#5f6368", lineHeight: 1.6, margin: "0 0 28px 0" }}>
              Your Maduvedibbana Matrimony project is deployed or running, but it is missing the environment variables required to connect to your Supabase database.
            </p>

            <div style={{ textAlign: "left", background: "#f8fafc", borderRadius: "16px", padding: "20px", marginBottom: "28px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44", margin: "0 0 12px 0" }}>
                Add these 5 keys to your Environment:
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "NEXT_PUBLIC_SUPABASE_URL",
                  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
                  "SUPABASE_SERVICE_ROLE_KEY",
                  "NEXT_PUBLIC_ADMIN_EMAIL",
                  "NEXT_PUBLIC_ADMIN_PASSWORD"
                ].map(key => (
                  <code key={key} style={{ 
                    display: "block", background: "#fff", padding: "8px 12px", 
                    borderRadius: "6px", border: "1px solid #cbd5e1", 
                    fontSize: "12px", color: "#0f172a", fontFamily: "monospace" 
                  }}>
                    {key}
                  </code>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "left", margin: "0 0 24px 0" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#1e2a44", margin: "0 0 6px 0" }}>
                Steps to Fix:
              </h4>
              <ol style={{ fontSize: "13px", color: "#5f6368", lineHeight: 1.6, paddingLeft: "20px", margin: 0 }}>
                <li><strong>Local Server</strong>: Create a file named <code>.env.local</code> in your project root folder and paste these keys with your Supabase credentials. Restart your server.</li>
                <li><strong>Vercel Staging/Prod</strong>: Go to your project settings in the Vercel Dashboard, select <strong>Environment Variables</strong>, and add each key.</li>
                <li><strong>Redeploy</strong>: Once updated in Vercel, go to the <strong>Deployments</strong> tab, select your latest build, click the three dots, and select <strong>Redeploy</strong> (make sure to select <strong>Redeploy with Clean Build Cache</strong>).</li>
              </ol>
            </div>

            <div style={{ fontSize: "12px", color: "#a0aec0", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
              Maduvedibbana Matrimony Setup Manager
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Inject runtime env vars into the page so client-side code can use them
  // even if the NEXT_PUBLIC_ vars weren't baked at build time
  const envScript = `window.__ENV__=${JSON.stringify({
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnon,
    NEXT_PUBLIC_ADMIN_EMAIL: getRuntimeEnv('NEXT_PUBLIC_ADMIN_EMAIL'),
    NEXT_PUBLIC_ADMIN_PASSWORD: getRuntimeEnv('NEXT_PUBLIC_ADMIN_PASSWORD'),
  })};`;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: envScript }} />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
