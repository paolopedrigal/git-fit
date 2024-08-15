import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    if (!body) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }
    const response = await fetch(process.env.BACKEND_BASE_URL + "/auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({
        error: "Failed to create user in the backend",
        status: response.status,
      });
    }
  } catch (error: any) {
    console.error("Error in POST /auth:", error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
      status: 500,
    });
  }
}
