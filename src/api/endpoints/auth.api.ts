import {
  AuthResponse, ForgotPasswordCredentials,
  LoginCredentials, LoginGoogleCredentials,
  RegisterCredentials,
  User, VerifyEmailCredentials, ChangePasswordCredentials
} from "@/api/types/auth.type";
import api from "@/api/api";

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  loginGoogle: async (credentials: LoginGoogleCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login-google", credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<any> => {
    const { data } = await api.post("/auth/register", credentials);
    return data;
  },

  forgotPassword: async (credentials: ForgotPasswordCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/request-password-reset", credentials);
    return data;
  },

  verifyEmail: async (credentials: VerifyEmailCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/verify-email", credentials);
    return data;
  },

  sendVerification: async (credentials: ForgotPasswordCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/send-verification", credentials);
    return data;
  },

  confirmResetPassword: async (credentials: ForgotPasswordCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/confirm-reset-password", credentials);
    return data;
  },

  changePassword: async (credentials: ChangePasswordCredentials): Promise<any> => {
    const { data } = await api.post("/auth/change-password", credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  me: async (): Promise<User> => {
    const { data } = await api.get("/users/me");
    return data;
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const { data } = await api.post(`/users/${id}`, userData);
    return data;
  },

  uploadAvatar: async (avatarData: { avatarUrl: string; attachmentId: string }): Promise<any> => {
    const { data } = await api.post("/users/upload-avatar", avatarData);
    return data;
  },

  uploadCoverPhoto: async (coverData: { coverPhotoUrl: string; attachmentId: string }): Promise<any> => {
    const { data } = await api.post("/users/upload-cover-photo", coverData);
    return data;
  },
};
