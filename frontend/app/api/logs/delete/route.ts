import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const authHeader = req.headers.get("Authorization"); // Note: headers are case-insensitive

  // Validate the parameters
  if (!date || !authHeader) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const accessToken = authHeader.split(" ")[1]; // Extract the Bearer token

  try {
    // Forward the request to the FastAPI backend
    const response = await fetch(
      process.env.BACKEND_BASE_URL + `/logs/delete/?${searchParams.toString()}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Include the token here
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({
        error: "Failed to fetch logs from the backend",
        status: response.status,
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
