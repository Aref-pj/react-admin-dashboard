import api from "../../../app/api/axios";

export const fetchStats = async () => {
    const res = await api.get("/stats");
    return res.data;
}


