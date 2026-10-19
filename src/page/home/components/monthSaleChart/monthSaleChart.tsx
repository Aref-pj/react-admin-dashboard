import fetchMonthSale from "./api";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    payload: {
      month: string;
    };
  }[];
}

function CustomTooltip({
  active,
  payload,
}: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-sm border border-c-border bg-c-surface px-4 py-2 shadow-md">
      <p className="mb-2 text-base font-medium text-c-text">
        {item.payload.month}
      </p>

      <p className="text-sm text-c-primary">
        sale : {item.value}
      </p>
    </div>
  );
}

export default function MonthSaleChart() {
  const { data = [] } = useQuery({
    queryKey: ["monthSale"],
    queryFn: fetchMonthSale,
  });

  const plotRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setIsCompact(width < 560);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex-2 rounded-2xl border border-c-border bg-c-surface p-3 sm:p-4">

      <h2 className="mb-4 text-xl font-medium text-c-text-secondary">
        Month Sale
      </h2>

      <div ref={plotRef} className="h-60 w-full bg-transparent sm:h-85">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: isCompact ? 6 : 15,
              left: isCompact ? 6 : 15,
              bottom: 20,
            }}
          >

            <defs>
              <linearGradient
                id="saleGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--ui-primary)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor="var(--ui-primary)"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--ui-border)"
              strokeDasharray="8 8"
              vertical
              horizontal
            />

            <XAxis
              dataKey="month"
              interval={0}
              axisLine={{
                stroke: "var(--ui-primary)",
              }}
              tickLine={false}
              tick={{
                fill: "var(--ui-text-secondary)",
                fontSize: isCompact ? 10 : 16,
              }}
              dy={isCompact ? 4 : 8}
              padding={{
                left: isCompact ? 14 : 0,
                right: isCompact ? 14 : 0,
              }}
            />

            <YAxis
              hide
              domain={[0, 130000]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--ui-border)",
                strokeWidth: 1,
              }}
            />

            <Area
              type="monotone"
              dataKey="sale"
              stroke="none"
              fill="url(#saleGradient)"
            />

            <Line
              type="monotone"
              dataKey="sale"
              stroke="var(--ui-primary)"
              strokeWidth={1.5}
              dot={{
                r: 4,
                fill: "var(--ui-surface)",
                stroke: "var(--ui-primary)",
                strokeWidth: 1.5,
              }}
              activeDot={{
                r: 4,
                fill: "var(--ui-primary)",
                stroke: "var(--ui-primary)",
                strokeWidth: 1,
              }}
            />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}