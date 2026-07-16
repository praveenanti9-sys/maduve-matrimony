import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Join the Maduvedibbana Okkaliga Matrimony community and find your life partner today.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
