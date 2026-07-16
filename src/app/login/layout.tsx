import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Maduvedibbana account to connect with the Okkaliga community.",
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
