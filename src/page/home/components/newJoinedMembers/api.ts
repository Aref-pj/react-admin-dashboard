import api from "../../../../app/api/axios";

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface PaginatedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

export const fetchNewUsers = async (): Promise<Member[]> => {
  const res = await api.get<PaginatedResponse<Member>>("/users", {
    params: {
      _page: 1,
      _per_page: 6,
      _sort: "-createdAt",
    },
  });

  return res.data.data;
};