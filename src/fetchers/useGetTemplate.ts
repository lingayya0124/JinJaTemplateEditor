import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
let api = axios.create({
  baseURL: `http://localhost:8000/` as string,
});
const useGetTemplates = () => {
  return useQuery(["templates"], () =>
    api.get(`template/`).then((res) => res.data)
  );
};
const useCreateTemplate = (queryClient: QueryClient) => {
  return useMutation((data: any) => api.post(`template/`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["templates"]);
    },
    onError: (error: any) => {
      throw error.response.data;
    },
  });
};
const useCreateIssue = (queryClient: QueryClient) => {
  return useMutation(
    (data: any) => api.post(`template/${data.unique_id}/issue/`, data.formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["templates"]);
      },
      onError: (error: any) => {
        throw error.response.data;
      },
    }
  );
};

export { useGetTemplates, useCreateTemplate, useCreateIssue };
