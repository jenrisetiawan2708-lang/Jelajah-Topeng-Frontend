import { NextResponse } from "next/server";

export type ApiSuccess<T> = { success: true; data: T; error: null };
export type ApiFailure = {
  success: false;
  data: null;
  error: { code: string; message: string };
};

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>(
    { success: true, data, error: null },
    { status },
  );
}

export function fail(code: string, message: string, status = 400) {
  return NextResponse.json<ApiFailure>(
    { success: false, data: null, error: { code, message } },
    { status },
  );
}