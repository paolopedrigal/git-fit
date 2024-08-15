"use client";
import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function GoogleReCaptchaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const reCaptchaKey: string | undefined =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (reCaptchaKey != undefined)
    return (
      <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
        {children}
      </GoogleReCaptchaProvider>
    );
  else return children;
}
