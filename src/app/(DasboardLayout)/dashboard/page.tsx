"use client";
import { useState } from "react";
import {
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Types ─────────────────────────────────────────────────────────────────────
type WeeklyRow = {
  week: string;
  classes: number;
  revenue: number;
  payouts: number;
  net: number;
};

type StatCard = {
  title: string;
  value: string;
  Icon: React.ElementType;
  iconColor: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const weekly: WeeklyRow[] = [
  { week: "Jan 26 - Feb 1", classes: 45, revenue: 900, payouts: 450, net: 450 },
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

const stats: StatCard[] = [
  {
    title: "Total Revenue",
    value: "$3900",
    Icon: DollarSign,
    iconColor: "text-green-600",
  },
  {
    title: "Active Students",
    value: "127",
    Icon: Users,
    iconColor: "text-blue-600",
  },
  {
    title: "Active Teachers",
    value: "15",
    Icon: GraduationCap,
    iconColor: "text-purple-600",
  },
  {
    title: "Classes This Week",
    value: "45",
    Icon: BookOpen,
    iconColor: "text-orange-600",
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [period, setPeriod] = useState<string>("Weekly");

  return (
    <div className="max-w-6xl mx-auto p-5 my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map(({ title, value, Icon, iconColor }) => (
          <Card key={title} className="border border-gray-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <Icon className={`${iconColor} w-7 h-7`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Financials Table */}
      <Card className="border border-gray-200 mb-4">
        <CardContent>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Weekly Financials
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week Of</TableHead>
                <TableHead>Classes Booked</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Teacher Payouts</TableHead>
                <TableHead>Net Income</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weekly.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm text-gray-700">
                    {row.week}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {row.classes}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-green-600">
                    ${row.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-red-500">
                    ${row.payouts}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-gray-900">
                    ${row.net}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-green-50 border border-green-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">
                Total Paid to Teachers
              </p>
              <p className="text-3xl font-bold text-green-700">$1950</p>
            </div>
            <TrendingUp className="text-green-600 w-8 h-8" />
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">
                Total Net Income
              </p>
              <p className="text-3xl font-bold text-blue-700">$1950</p>
            </div>
            <DollarSign className="text-blue-600 w-8 h-8" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
