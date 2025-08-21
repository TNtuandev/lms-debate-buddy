import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "@/api/endpoints/category.api";
import { ICategory } from "@/api/types/category";
import { IParamsRequest } from "@/api/interface/api.request.interface";

export const categoryKeys = {
  all: ["category"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: IParamsRequest) => [...categoryKeys.lists(), filters] as const,
};

export const useCategory = (params?: IParamsRequest) => {
  return useQuery<ICategory[]>({
    queryKey: categoryKeys.list(params || {}),
    queryFn: () => categoryAPI.getListCategory(params || {}),
  });
};