import GoogleReCaptchaWrapper from "@/components/google-recaptcha-wrapper";
import React from "react";

export default function CredentialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GoogleReCaptchaWrapper>{children}</GoogleReCaptchaWrapper>;
}
