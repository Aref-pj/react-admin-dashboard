import api from "../../app/api/axios";

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  phone: string;
  nationalId: string;
  country: string;
  state: string;
  residentialAddress: string;
  postal: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
}

interface JsonServerResponse {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: User[];
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  pages: number;
}

export type NewUserPayload = Omit<User, "id" | "createdAt">;

export async function getUserById(id: string): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

export async function createUser(
  payload: NewUserPayload,
): Promise<{ user: User }> {
  const user: User = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const response = await api.post<User>("/users", user);

  return { user: response.data };
}

export async function getUsers({
  page,
  limit,
  search = "",
}: GetUsersParams): Promise<GetUsersResponse> {
  const params: Record<string, string | number> = {
    _page: page,
    _per_page: limit,
  };

  if (search.trim()) {
    params["name:contains"] = search.trim();
  }

  const response = await api.get<JsonServerResponse>("/users", {
    params,
  });

  return {
    users: response.data.data,
    total: response.data.items,
    pages: response.data.pages,
  };
}