// "use client";

// import { useState } from "react";
// import {
//   DollarSign,
//   Users,
//   GraduationCap,
//   BookOpen,
//   TrendingUp,
// } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Period, useGetDashboardStatsQuery } from "@/redux/features/statsApi";

// export default function Dashboard() {
//   const [period, setPeriod] = useState<Period>("weekly");

//   const { data, isLoading, isError } = useGetDashboardStatsQuery({
//     period,
//     weeks: 4,
//   });

//   const overview = data?.overview;
//   const financials = data?.financials;

//   const statCards = [
//     {
//       title: "Total Revenue",
//       value: `$${overview?.totalRevenue.toLocaleString() ?? 0}`,
//       Icon: DollarSign,
//       iconColor: "text-green-600",
//     },
//     {
//       title: "Active Students",
//       value: String(overview?.activeStudents ?? 0),
//       Icon: Users,
//       iconColor: "text-blue-600",
//     },
//     {
//       title: "Active Teachers",
//       value: String(overview?.activeTeachers ?? 0),
//       Icon: GraduationCap,
//       iconColor: "text-purple-600",
//     },
//     {
//       title:
//         period === "weekly"
//           ? "Classes This Week"
//           : period === "monthly"
//             ? "Classes This Month"
//             : "Total Classes",
//       value: String(overview?.classesThisPeriod ?? 0),
//       Icon: BookOpen,
//       iconColor: "text-orange-600",
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className="max-w-6xl mx-auto p-5 my-10">
//         <p className="text-lg">Loading...</p>
//       </div>
//     );
//   }
//   if (isError) {
//     return (
//       <div className="max-w-6xl mx-auto p-5 my-10">
//         <p className="text-red-500 text-sm">
//           Failed to load dashboard stats. Please try again.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-5 my-10">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
//         <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
//           <SelectTrigger className="w-36">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="weekly">Weekly</SelectItem>
//             <SelectItem value="monthly">Monthly</SelectItem>
//             <SelectItem value="all">All Time</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//         {statCards.map(({ title, value, Icon, iconColor }) => (
//           <Card key={title} className="border border-gray-200">
//             <CardContent className="p-5 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">{title}</p>
//                 <p className="text-2xl font-bold">{value}</p>
//               </div>
//               <Icon className={`${iconColor} w-7 h-7`} />
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Weekly Financials Table */}
//       <Card className="border border-gray-200 mb-4">
//         <CardContent>
//           <h2 className="text-base font-semibold text-gray-900 mb-4">
//             Weekly Financials
//           </h2>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Week Of</TableHead>
//                 <TableHead>Classes Booked</TableHead>
//                 <TableHead>Revenue</TableHead>
//                 <TableHead>Teacher Payouts</TableHead>
//                 <TableHead>Net Income</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {financials?.weeks.map((row, i) => (
//                 <TableRow key={i}>
//                   <TableCell className="text-sm text-gray-700">
//                     {row.weekOf}
//                   </TableCell>
//                   <TableCell className="text-sm text-gray-700">
//                     {row.classesBooked}
//                   </TableCell>
//                   <TableCell className="text-sm font-semibold text-green-600">
//                     ${row.revenue.toLocaleString()}
//                   </TableCell>
//                   <TableCell className="text-sm font-semibold text-red-500">
//                     ${row.teacherPayouts.toLocaleString()}
//                   </TableCell>
//                   <TableCell className="text-sm font-bold text-gray-900">
//                     ${row.netIncome.toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Bottom Highlight Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <Card className="bg-green-50 border border-green-200">
//           <CardContent className="p-6 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-green-600 mb-1">
//                 Total Paid to Teachers
//               </p>
//               <p className="text-3xl font-bold text-green-700">
//                 ${financials?.totals.teacherPayouts.toLocaleString() ?? 0}
//               </p>
//             </div>
//             <TrendingUp className="text-green-600 w-8 h-8" />
//           </CardContent>
//         </Card>

//         <Card className="bg-blue-50 border border-blue-200">
//           <CardContent className="p-6 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-blue-600 mb-1">
//                 Total Net Income
//               </p>
//               <p className="text-3xl font-bold text-blue-700">
//                 ${financials?.totals.netIncome.toLocaleString() ?? 0}
//               </p>
//             </div>
//             <DollarSign className="text-blue-600 w-8 h-8" />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertCircle,
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
import { Period, useGetDashboardStatsQuery } from "@/redux/features/statsApi";

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("weekly");

  const { data, isLoading, isError } = useGetDashboardStatsQuery({
    period,
    weeks: 4,
  });

  const overview = data?.overview;
  const financials = data?.financials;

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${overview?.totalRevenue.toLocaleString() ?? 0}`,
      Icon: DollarSign,
      iconColor: "text-green-600",
    },
    {
      title: "Active Students",
      value: String(overview?.activeStudents ?? 0),
      Icon: Users,
      iconColor: "text-blue-600",
    },
    {
      title: "Active Teachers",
      value: String(overview?.activeTeachers ?? 0),
      Icon: GraduationCap,
      iconColor: "text-purple-600",
    },
    {
      title:
        period === "weekly"
          ? "Classes This Week"
          : period === "monthly"
            ? "Classes This Month"
            : "Total Classes",
      value: String(overview?.classesThisPeriod ?? 0),
      Icon: BookOpen,
      iconColor: "text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-5 my-10">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-5 my-10">
        <p className="text-red-500 text-sm">
          Failed to load dashboard stats. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-5 my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {statCards.map(({ title, value, Icon, iconColor }) => (
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

      {/* Unpaid Teacher Earnings Alert */}
      {(overview?.unpaidTeacherEarnings ?? 0) > 0 && (
        <Card className="border border-yellow-200 bg-yellow-50 mb-4">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="text-yellow-600 w-5 h-5 shrink-0" />
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">
                ${overview?.unpaidTeacherEarnings.toLocaleString()}
              </span>{" "}
              in teacher earnings are pending payout.
            </p>
          </CardContent>
        </Card>
      )}

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
                <TableHead>Classes</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Teacher Earned</TableHead>
                <TableHead>Actual Payouts</TableHead>
                <TableHead>Net Income</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financials?.weeks.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm text-gray-700">
                    {row.weekOf}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {row.classesBooked}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-green-600">
                    ${row.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-orange-500">
                    ${row.estimatedTeacherEarnings.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-red-500">
                    ${row.actualPayouts.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-gray-900">
                    ${row.netIncome.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-green-50 border border-green-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">
                Total Paid to Teachers
              </p>
              <p className="text-3xl font-bold text-green-700">
                ${financials?.totals.actualPayouts.toLocaleString() ?? 0}
              </p>
            </div>
            <TrendingUp className="text-green-600 w-8 h-8" />
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border border-yellow-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">
                Unpaid Teacher Earnings
              </p>
              <p className="text-3xl font-bold text-yellow-700">
                ${financials?.totalUnpaidEarnings.toLocaleString() ?? 0}
              </p>
            </div>
            <AlertCircle className="text-yellow-600 w-8 h-8" />
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">
                Total Net Income
              </p>
              <p className="text-3xl font-bold text-blue-700">
                ${financials?.totals.netIncome.toLocaleString() ?? 0}
              </p>
            </div>
            <DollarSign className="text-blue-600 w-8 h-8" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
