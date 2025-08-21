import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { Env, EnvironmentType } from "@/config/environment";
import { INextApiResponse } from "@/api/interface/api-response.interface";
import api from "@/api/api";
import {
  handleApiError,
  handleSuccessResponse,
} from "@/api/utils/api-response.util";

export async function POST(
  req: Request,
): Promise<NextResponse<INextApiResponse>> {
  try {
    const body = await req.json();

    // ✅ Send login request to backend (NestJS)
    const res = await api.post("/auth/sign-in", body);

    // ✅ Store tokens securely in HttpOnly cookies
    (await cookies()).set("accessToken", res.data.accessToken, {
      httpOnly: true,
      secure: Env.NODE_ENV === EnvironmentType.production,
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    });

    (await cookies()).set("refreshToken", res.data.refreshToken, {
      httpOnly: true,
      secure: Env.NODE_ENV === EnvironmentType.production,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return handleSuccessResponse(res.data);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
