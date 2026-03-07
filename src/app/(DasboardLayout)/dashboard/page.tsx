"use client";
import { useState } from "react";
import {
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

export default function Dashboard() {
  const [period, setPeriod] = useState("Weekly");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const stats = [
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

  return (
    <div className="max-w-6xl mx-auto p-5 my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm text-gray-700 font-medium cursor-pointer hover:bg-gray-50"
          >
            {period} <ChevronDown size={16} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32 overflow-hidden">
              {["Weekly", "Monthly", "Yearly"].map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setPeriod(opt);
                    setDropdownOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${opt === period ? "text-blue-600 bg-blue-50" : "text-gray-700"}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {stats.map(({ title, value, Icon, iconColor }) => (
          <div
            key={title}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <Icon className={`${iconColor} w-7 h-7`} />
          </div>
        ))}
      </div>

      {/* Weekly Financials Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Weekly Financials
        </h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">
                Week Of
              </th>
              <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">
                Classes Booked
              </th>
              <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">
                Revenue
              </th>
              <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">
                Teacher Payouts
              </th>
              <th className="text-left text-sm font-medium text-gray-500 pb-3">
                Net Income
              </th>
            </tr>
          </thead>
          <tbody>
            {weekly.map((row, i) => (
              <tr
                key={i}
                className={
                  i < weekly.length - 1 ? "border-b border-gray-200" : ""
                }
              >
                <td className="py-4 text-sm text-gray-700 pr-4">{row.week}</td>
                <td className="py-4 text-sm text-gray-700 pr-4">
                  {row.classes}
                </td>
                <td className="py-4 text-sm font-semibold text-green-600 pr-4">
                  ${row.revenue.toLocaleString()}
                </td>
                <td className="py-4 text-sm font-semibold text-red-500 pr-4">
                  ${row.payouts}
                </td>
                <td className="py-4 text-sm font-bold text-gray-900">
                  ${row.net}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Highlight Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">
              Total Paid to Teachers
            </p>
            <p className="text-3xl font-bold text-green-700">$1950</p>
          </div>
          <TrendingUp className="text-green-600 w-8 h-8" />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">
              Total Net Income
            </p>
            <p className="text-3xl font-bold text-blue-700">$1950</p>
          </div>
          <DollarSign className="text-blue-600 w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
