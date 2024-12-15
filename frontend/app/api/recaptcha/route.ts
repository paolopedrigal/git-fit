import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const { gReCaptchaToken } = await request.json();
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify" +
        `?secret=${secretKey}&response=${gReCaptchaToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.score > 0.5) {
        return NextResponse.json({
          success: true,
          score: data.score,
        });
      } else {
        return NextResponse.json({
          success: false,
          score: data.score,
        });
      }
    } else {
      return NextResponse.json({
        error: "Failed to verify ReCAPTCHA",
        status: 500,
        response: response,
      });
    }
  } catch (error: any) {
    console.error("Error in GET /logs:", error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
      status: 500,
    });
  }
}
