import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/api/analytics";
import { useStore } from "../../context/StoreContext";
import { formatCurrency } from "@/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, DollarSign, ShoppingBag, Users,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Loader2,
} from "lucide-react";

const ReportsView: React.FC = () => {
  const { transactions } = useStore();
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");

  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics", period],
    queryFn: () => getAnalytics(period),
  });

  const analytics = data?.data;

  // Keep local chart data from transactions
  const chartData = useMemo(() => {
    const salesByDay: Record<string, number> = {};
    const salesByMethod: Record<string, number> = {};

    transactions.forEach((t) => {
      const date = new Date(t.timestamp).toLocaleDateString(undefined, { weekday: "short" });
      salesByDay[date] = (salesByDay[date] || 0) + t.total;
      salesByMethod[t.paymentMethod] = (salesByMethod[t.paymentMethod] || 0) + 1;
    });

    return {
      barData: Object.keys(salesByDay).map((date) => ({ date, sales: salesByDay[date] })),
      pieData: Object.keys(salesByMethod).map((method) => ({ name: method, value: salesByMethod[method] })),
    };
  }, [transactions]);

  const PIE_COLORS = ["#111111", "#FDE047", "#9CA3AF"];

  return (
    <div className="space-y-6 md:overflow-y-auto h-full md:pr-2 custom-scrollbar">
      {/* Period Filter */}
      <div className="flex items-center justify-center sm:justify-end">
        <div className="bg-white rounded-full p-1 border border-zinc-100 flex gap-1">
          {(["day", "week", "month"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all capitalize ${
                period === t ? "bg-[#111] text-white" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-48 text-zinc-500 gap-3">
          <Loader2 className="animate-spin" size={24} />
          Loading analytics...
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-48 text-red-500">
          Failed to load analytics.
        </div>
      )}

      {!isLoading && !error && analytics && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Revenue"
              value={`₦${formatCurrency(analytics.totalRevenue.value)}`}
              icon={<DollarSign size={24} />}
              trend={`${analytics.totalRevenue.change > 0 ? "+" : ""}${analytics.totalRevenue.change}%`}
              bgColor="bg-[#FDE047]"
              textColor="text-black"
            />
            <KPICard
              title="Total Orders"
              value={analytics.totalOrders.value.toString()}
              icon={<ShoppingBag size={24} />}
              trend={`${analytics.totalOrders.change > 0 ? "+" : ""}${analytics.totalOrders.change}%`}
              bgColor="bg-[#FBCFE8]"
              textColor="text-black"
            />
            <KPICard
              title="Items Sold"
              value={analytics.totalItemsSold.value.toString()}
              icon={<TrendingUp size={24} />}
              trend={`${analytics.totalItemsSold.change > 0 ? "+" : ""}${analytics.totalItemsSold.change}%`}
              bgColor="bg-[#BAE6FD]"
              textColor="text-black"
            />
            <KPICard
              title="Total Stock"
              value={analytics.totalStock.value.toString()}
              icon={<Users size={24} />}
              trend="—"
              bgColor="bg-white"
              textColor="text-black"
              borderColor="border border-zinc-100"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-xl text-zinc-900">Sales Analytics</h3>
                  <p className="text-zinc-500 text-sm capitalize">{period}ly performance</p>
                </div>
                {/* <button className="p-2 rounded-full hover:bg-zinc-50 text-zinc-400">
                  <MoreHorizontal />
                </button> */}
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111", border: "none", borderRadius: "12px", color: "#fff", padding: "12px" }}
                      cursor={{ fill: "#f3f4f6", radius: 8 }}
                    />
                    <Bar dataKey="sales" fill="#111" radius={[8, 8, 8, 8]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-100 flex flex-col">
              <h3 className="font-bold text-xl text-zinc-900 mb-2">Payment Type</h3>
              <p className="text-zinc-500 text-sm mb-4">
                Top method: <span className="font-bold text-zinc-800 capitalize">{analytics.topPaymentMethod}</span>
              </p>
              <div className="flex-1 relative my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData.pieData} cx="50%" cy="50%"
                      innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {chartData.pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="block text-2xl font-bold">{analytics.totalOrders.value}</span>
                    <span className="text-xs text-zinc-400 font-bold uppercase">Txns</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {chartData.pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                      <span className="font-medium text-zinc-600">{entry.name}</span>
                    </div>
                    <span className="font-bold text-zinc-900">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// KPICard component stays the same
interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  bgColor,
  textColor,
  borderColor = "",
}) => {
  const isPositive = trend.startsWith("+");
  return (
    <div
      className={`${bgColor} ${textColor} p-6 rounded-[2rem] relative overflow-hidden transition-transform hover:-translate-y-1 duration-300 ${borderColor}`}
    >
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="p-3 bg-black/5 rounded-full backdrop-blur-sm">
          {icon}
        </div>
        <div className="flex items-center gap-1 bg-white/30 px-2 py-1 rounded-full backdrop-blur-sm">
          {isPositive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          <span className="text-xs font-bold">{trend}</span>
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold tracking-tight mb-1">{value}</h3>
        <p className="opacity-60 font-medium text-sm">{title}</p>
      </div>

      {/* Decorative Circle */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
};

export default ReportsView;
