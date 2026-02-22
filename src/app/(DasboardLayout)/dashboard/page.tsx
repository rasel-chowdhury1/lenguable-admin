"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$3900",
      icon: DollarSign,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Students",
      value: "127",
      icon: Users,
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Teachers",
      value: "15",
      icon: GraduationCap,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      iconColor: "text-yellow-600",
    },
    {
      title: "Classes This Week",
      value: "45",
      icon: BookOpen,
      bg: "bg-pink-50",
      border: "border-pink-200",
      iconColor: "text-pink-600",
    },
  ];

  const highlights = [
    {
      title: "Total Paid to Teachers",
      value: "$1950",
      icon: TrendingUp,
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
    },
    {
      title: "Total Net Income",
      value: "$1950",
      icon: DollarSign,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconColor: "text-blue-600",
    },
  ];

  const weekly = [
    {
      week: "Jan 26 - Feb 1",
      classes: 45,
      revenue: 900,
      payouts: 450,
      net: 450,
    },
    {
      week: "Jan 19 - Jan 25",
      classes: 52,
      revenue: 1040,
      payouts: 520,
      net: 520,
    },
    {
      week: "Jan 12 - Jan 18",
      classes: 48,
      revenue: 960,
      payouts: 480,
      net: 480,
    },
    {
      week: "Jan 5 - Jan 11",
      classes: 50,
      revenue: 1000,
      payouts: 500,
      net: 500,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <Select defaultValue="weekly">
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} className={`${item.bg} border ${item.border}`}>
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-xl font-semibold">{item.value}</p>
                </div>
                <Icon className={`w-6 h-6 ${item.iconColor}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mb-5">
        {highlights.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} className={`${item.bg} border ${item.border}`}>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-2xl font-semibold">{item.value}</p>
                </div>
                <Icon className={`w-7 h-7 ${item.iconColor}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Financial Graph */}
      <Card>
        {" "}
        <CardContent className="p-5">
          {" "}
          <h2 className="font-semibold mb-4">Weekly Financials</h2>{" "}
          <ResponsiveContainer width="100%" height={300}>
            {" "}
            <BarChart
              data={weekly}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              {" "}
              <XAxis dataKey="week" tick={{ fontSize: 12 }} /> <YAxis />{" "}
              <Tooltip /> <Legend />{" "}
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />{" "}
              <Bar dataKey="payouts" fill="#ef4444" name="Teacher Payouts" />{" "}
              <Bar dataKey="net" fill="#10b981" name="Net Income" />{" "}
            </BarChart>{" "}
          </ResponsiveContainer>{" "}
        </CardContent>{" "}
      </Card>
    </div>
  );
}
