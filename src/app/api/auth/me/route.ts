import api from "@/api/api";
import {
  handleApiError,
  handleSuccessResponse,
} from "@/api/utils/api-response.util";

export async function GET() {
  try {
    // ✅ Send login request to backend (NestJS)
    const res = await api.get("/users/me");

    return handleSuccessResponse(res.data, "User retrieved successfully");
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
