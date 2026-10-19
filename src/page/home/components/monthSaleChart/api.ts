import api from "../../../../app/api/axios";

const fetchMonthSale = async () => {
    const res = await api.get("/month-sale");
    return res.data;
}

export default fetchMonthSale;