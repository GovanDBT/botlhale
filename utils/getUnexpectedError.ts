// utils/getUnexpectedError.ts
// function for handling unexpected error messages for api routes
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export default function getUnexpectedError(error: unknown): NextResponse {
  // convert error to string
  const errorMessage = error instanceof Error ? error.message : "Unexpected server error occurred!";
  // log error to Sentry (logger)
  Sentry.captureException(error);
  // log error to server & client
  return NextResponse.json(
    { success: false, error: errorMessage },
    { status: 500 }
  );
}

/**
 * The reason for this file is because when building the app for production, Next does not allow
 * error messages typed as "any". Those error messages have to be typed as "unknown" and be instances of
 * Error or a string.
 */