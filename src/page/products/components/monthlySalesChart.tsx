
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatNumber } from "../utils";

interface MonthlySalesChartProps {
  monthlySales: number[];
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthlySalesChart({
  monthlySales,
}: MonthlySalesChartProps) {
  const data = MONTHS.map((month, index) => ({
    month,
    sales: Math.max(0, Number(monthlySales?.[index]) || 0),
  }));

  const totalSales = data.reduce((total, item) => total + item.sales, 0);

  const bestMonth = data.reduce(
    (best, item) => (item.sales > best.sales ? item : best),
    data[0],
  );

  return (
    <section
      className="w-full rounded-2xl border border-c-border bg-c-surface
        px-5 py-5 sm:px-6"
      aria-label="Monthly product sales"
    >
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row
        sm:items-center"
      >
        <div>
          <h3 className="text-lg font-semibold text-c-text-secondary">
            Monthly Sales
          </h3>

          <p className="mt-1 text-sm text-c-text-muted">
            Number of units sold per month
          </p>
        </div>

        <div className="flex gap-3">
          <div className="rounded-xl border border-c-border bg-c-background
            px-4 py-3"
          >
            <p className="text-xs text-c-text-muted">Total Sold</p>
            <p className="mt-1 text-lg font-bold text-c-text">
              {formatNumber(totalSales)}
              <span className="ml-1 text-xs font-normal text-c-text-muted">
                units
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-c-border bg-c-background
            px-4 py-3"
          >
            <p className="text-xs text-c-text-muted">Best Month</p>
            <p className="mt-1 text-lg font-bold text-c-text">
              {bestMonth.month}
            </p>
            <p className="text-xs text-c-text-muted">
              {formatNumber(bestMonth.sales)} units
            </p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 4, left: 4, bottom: 0 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--color-c-border)"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-c-text-muted)",
                fontSize: 12,
              }}
              tickMargin={10}
              interval={0}
              tickFormatter={(month, index) => {
                if (window.innerWidth < 520 && index % 2 !== 0) {
                  return "";
                }

                return month;
              }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-c-text-muted)",
                fontSize: 12,
              }}
              tickMargin={8}
              width={38}
            />

            <Tooltip
              cursor={{ fill: "var(--color-c-primary)", opacity: 0.06 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                const sales = Number(payload[0].value ?? 0);

                return (
                  <div className="rounded-xl border border-c-border
                    bg-c-surface px-4 py-3 shadow-lg"
                  >
                    <p className="mb-1 text-sm text-c-text-muted">
                      {label}
                    </p>

                    <p className="text-sm font-semibold text-c-text">
                      {formatNumber(sales)} units sold
                    </p>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="sales"
              name="Units Sold"
              radius={[6, 6, 0, 0]}
              maxBarSize={34}
              isAnimationActive={false}
            >
              {data.map((item) => (
                <Cell
                  key={item.month}
                  fill={
                    item.sales === bestMonth.sales && item.sales > 0
                      ? "#16A34A"
                      : "var(--color-c-primary)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className="mt-4 flex flex-col items-start gap-3
          border-t border-c-border pt-4
          sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2"
      >
        <div className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-sm bg-c-primary" />
          <span className="text-xs text-c-text-muted">
            Monthly sales
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-sm bg-green-600" />
          <span className="text-xs text-c-text-muted">
            Best performing month
          </span>
        </div>
      </div>
    </section>
  );
}
