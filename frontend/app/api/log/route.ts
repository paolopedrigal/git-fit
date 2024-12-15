import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization"); // Note: headers are case-insensitive

    // Extract the JSON body from the request
    const body = await req.json();

    // Perform any necessary validation
    if (!body || !authHeader) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    const accessToken = authHeader.split(" ")[1]; // Extract the Bearer token

    // Forward the request to your backend or handle it here
    const response = await fetch(process.env.BACKEND_BASE_URL + "/log/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Include the token here
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({
        error: "Failed to create log",
        status: response.status,
      });
    }
  } catch (error: any) {
    console.error("Error in POST /logs:", error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
      status: 500,
    });
  }
}
