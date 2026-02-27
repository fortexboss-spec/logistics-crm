import axios from "axios";
const api = axios.create({ baseURL: "/api/wb", timeout: 30000 });
export async function wbRequest<T = any>(
  baseUrl: "logistics" | "drive",
  endpoint: string,
  options?: { method?: "GET" | "POST" | "PUT" | "DELETE"; params?: Record<string, any>; data?: any }
): Promise<T> {
  const { method = "GET", params, data } = options || {};
  const response = await api.request({
    url: "/proxy",
    method: "POST",
    data: { baseUrl, endpoint, method, params, body: data },
  });
  return response.data;
}
export default api;
