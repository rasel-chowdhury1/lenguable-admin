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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Total Revenue", value: "$3900", icon: DollarSign },
    { title: "Active Students", value: "127", icon: Users },
    { title: "Active Teachers", value: "15", icon: GraduationCap },
    { title: "Classes This Week", value: "45", icon: BookOpen },
  ];

  const weekly = [
    {
      week: "Jan 26 - Feb 1",
      classes: 45,
      revenue: "$900",
      payouts: "$450",
      net: "$450",
    },
    {
      week: "Jan 19 - Jan 25",
      classes: 52,
      revenue: "$1040",
      payouts: "$520",
      net: "$520",
    },
    {
      week: "Jan 12 - Jan 18",
      classes: 48,
      revenue: "$960",
      payouts: "$480",
      net: "$480",
    },
    {
      week: "Jan 5 - Jan 11",
      classes: 50,
      revenue: "$1000",
      payouts: "$500",
      net: "$500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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

      {/* Stats1 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i}>
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-xl font-semibold">{item.value}</p>
                </div>
                <Icon className="w-6 h-6 text-primary" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* States 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Paid to Teachers
              </p>
              <p className="text-2xl font-semibold">$1950</p>
            </div>
            <TrendingUp className="w-7 h-7 text-green-600" />
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Net Income</p>
              <p className="text-2xl font-semibold">$1950</p>
            </div>
            <DollarSign className="w-7 h-7 text-blue-600" />
          </CardContent>
        </Card>
      </div>

      {/* Weekly Financials */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold">Weekly Financials</h2>

          <div className="overflow-x-auto">
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
                    <TableCell>{row.week}</TableCell>
                    <TableCell>{row.classes}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {row.revenue}
                    </TableCell>
                    <TableCell className="text-red-500 font-medium">
                      {row.payouts}
                    </TableCell>
                    <TableCell className="font-medium">{row.net}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
