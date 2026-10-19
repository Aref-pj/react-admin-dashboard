import StatCard from "./components/statCard/statCard";
import MonthSaleChart from "./components/monthSaleChart/monthSaleChart";

import { LuAlignHorizontalDistributeCenter } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuBox } from "react-icons/lu";

import { fetchStats } from "./api/api";
import { useQuery } from "@tanstack/react-query";
import NewJoinedMembers from "./components/newJoinedMembers/newJoinedMembers";
import LatestTransactions from "./components/latestTransactions/latestTransactions";

export default function Home() {

  const {data : stats} = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  return (
    <>
      <div className="mb-5 grid gap-3 grid-cols-3 max-md:grid-cols-1">
        <StatCard
          title="Revenue"
          num={stats?.revenue.num}
          perc={stats?.revenue.perc}
          icon={<LuAlignHorizontalDistributeCenter size={24}/>}
        />

        <StatCard
          title="Customers"
          num={stats?.customers.num}
          perc={stats?.customers.perc}
          icon={<LuUsers size={24}/>}
        />

        <StatCard
          title="Orders"
          num={stats?.orders.num}
          perc={stats?.orders.perc}
          icon={<LuBox size={24}/>}
        />
      </div>
      <div className="mb-5">
        <MonthSaleChart/>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row">
        <NewJoinedMembers/>
        <LatestTransactions/>
      </div>
    </>
  )
}
