import api from "@/api/api";
import { ICategory } from "@/api/types/category";
import { IParamsRequest } from "@/api/interface/api.request.interface";

export const categoryAPI = {
  getListCategory: async ({
    limit = 100, // Default limit if not provided
  }: IParamsRequest): Promise<ICategory[]> => {
    const { data } = await api.get(`/categories`, {
      params: {
        limit,
      },
    });
    return data;
  },
};