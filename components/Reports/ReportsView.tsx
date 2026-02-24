import React, { useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";

const ReportsView: React.FC = () => {
  const { transactions } = useStore();

  const stats = useMemo(() => {
    const totalSales = transactions.reduce((acc, t) => acc + t.total, 0);
    const totalOrders = transactions.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Process data for charts
    const salesByDay: Record<string, number> = {};
    const salesByMethod: Record<string, number> = {};

    transactions.forEach((t) => {
      const date = new Date(t.timestamp).toLocaleDateString(undefined, {
        weekday: "short",
      });
      salesByDay[date] = (salesByDay[date] || 0) + t.total;
      salesByMethod[t.paymentMethod] =
        (salesByMethod[t.paymentMethod] || 0) + 1;
    });

    const chartData = Object.keys(salesByDay).map((date) => ({
      date,
      sales: salesByDay[date],
    }));
    const pieData = Object.keys(salesByMethod).map((method) => ({
      name: method,
      value: salesByMethod[method],
    }));

    return { totalSales, totalOrders, avgOrderValue, chartData, pieData };
  }, [transactions]);

  const PIE_COLORS = ["#111111", "#FDE047", "#9CA3AF"];

  return (
    <div className="space-y-6 overflow-y-auto h-full pr-2 custom-scrollbar">
      {/* Date Filter */}
      <div className="flex items-center justify-center sm:justify-end">
        <div className="bg-white rounded-full p-1 border border-zinc-100 flex gap-1">
          {["Day", "Week", "Month"].map((t) => (
            <button
              key={t}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${t === "Week" ? "bg-[#111] text-white" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Pastel KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`₦${stats.totalSales.toFixed(2)}`}
          icon={<DollarSign size={24} />}
          trend="+12.5%"
          bgColor="bg-[#FDE047]" // Pastel Yellow
          textColor="text-black"
        />
        <KPICard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={<ShoppingBag size={24} />}
          trend="+5.2%"
          bgColor="bg-[#FBCFE8]" // Pastel Pink
          textColor="text-black"
        />
        <KPICard
          title="Avg. Order Value"
          value={`₦${stats.avgOrderValue.toFixed(2)}`}
          icon={<TrendingUp size={24} />}
          trend="-1.1%"
          bgColor="bg-[#BAE6FD]" // Pastel Blue
          textColor="text-black"
        />
        <KPICard
          title="Active Customers"
          value="142"
          icon={<Users size={24} />}
          trend="+8.4%"
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
              <h3 className="font-bold text-xl text-zinc-900">
                Sales Analytics
              </h3>
              <p className="text-zinc-500 text-sm">Weekly performance</p>
            </div>
            <button className="p-2 rounded-full hover:bg-zinc-50 text-zinc-400">
              <MoreHorizontal />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    padding: "12px",
                  }}
                  cursor={{ fill: "#f3f4f6", radius: 8 }}
                />
                <Bar
                  dataKey="sales"
                  fill="#111"
                  radius={[8, 8, 8, 8]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-100 flex flex-col">
          <h3 className="font-bold text-xl text-zinc-900 mb-2">Payment Type</h3>
          <p className="text-zinc-500 text-sm mb-8">Distribution by method</p>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-2xl font-bold">
                  {stats.totalOrders}
                </span>
                <span className="text-xs text-zinc-400 font-bold uppercase">
                  Txns
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {stats.pieData.map((entry, index) => (
              <div
                key={entry.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                    }}
                  ></span>
                  <span className="font-medium text-zinc-600">
                    {entry.name}
                  </span>
                </div>
                <span className="font-bold text-zinc-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <h3 className="text-4xl font-bold tracking-tight mb-1">{value}</h3>
        <p className="opacity-60 font-medium text-sm">{title}</p>
      </div>

      {/* Decorative Circle */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
};

export default ReportsView;
