import { useQuery } from "@tanstack/react-query";
import { fetchLatestTransactions } from "./api";
import { Link } from "react-router-dom";
import StatusBadge from "../../../../shared/components/statusBadge/statusBadge";

export default function LatestTransactions() {
  const { data: transactions } = useQuery({
    queryKey: ["latest-transactions"],
    queryFn: fetchLatestTransactions,
  });

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-c-border bg-c-surface lg:flex-[1.5]">
      <div className="flex items-center justify-between border-b border-c-border px-5 py-4">
        <h2 className="text-lg font-semibold text-c-text-secondary">
          Latest Transactions
        </h2>

        <Link to="/transactions">
          <span
            className="rounded-lg px-3 py-2 text-sm font-semibold text-c-primary transition-colors 
             hover:bg-c-primary/10 active:bg-c-primary/20"
          >View All</span>
        </Link>
      </div>

      <div className="hidden w-full overflow-x-auto sm:block">
        <table className="w-full min-w-155">
          <thead>
            <tr className="border-b border-c-border text-xs text-c-text-muted">
              <th className="px-5 py-3 text-left font-medium">Customer</th>
              <th className="px-5 py-3 text-center font-medium">Date</th>
              <th className="px-5 py-3 text-left font-medium">Amount</th>
              <th className="px-5 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions?.map((transaction) => {
              const date = new Date(transaction.createdAt);

              return (
                <tr
                  key={transaction.id}
                  className="border-b border-c-border transition-colors last:border-b-0 hover:bg-c-surface-hover"
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={transaction.avatar}
                        alt={transaction.customer}
                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-c-border"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-lg font-medium text-c-text">
                          {transaction.customer}
                        </p>

                        <p className="mt-0.5 text-xs text-c-text-disabled">
                          #{transaction.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-center">
                    <span
                      className="tooltip tooltip-bottom block w-full cursor-default text-c-text-secondary before:-translate-y-1 
                        before:bg-c-primary/20 before:text-xs before:text-c-primary after:bg-c-primary after:-translate-y-1.25 text-sm"
                      data-tip={date.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    >
                      {date.toLocaleDateString("en-GB")}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="text-sm font-semibold text-c-text">
                      ${transaction.amount.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={transaction.status}
                      className="w-full justify-center"
                      pulse={transaction.status === "pending"}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-c-border sm:hidden">
        {transactions?.map((transaction) => {
          const date = new Date(transaction.createdAt);

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-c-surface-hover"
            >
              <img
                src={transaction.avatar}
                alt={transaction.customer}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-c-border"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-c-text">
                  {transaction.customer}
                </p>

                <p className="mt-0.5 truncate text-xs text-c-text-disabled">
                  #{transaction.id} · {date.toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-sm font-semibold text-c-text">
                  ${transaction.amount.toLocaleString()}
                </span>

                <StatusBadge
                  status={transaction.status}
                  className="px-2 py-1"
                  pulse={transaction.status === "pending"}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
