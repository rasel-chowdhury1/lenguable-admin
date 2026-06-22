"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Spinner } from "@/components/ui/spinner";
import { Payment } from "@/types";
import { useGetAllPaymentsQuery } from "@/redux/features/paymentApi";

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function fmt(n: number | null | undefined) {
  return (n ?? 0).toFixed(2);
}

export default function PaymentListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError } = useGetAllPaymentsQuery(undefined);

  const payments: Payment[] = useMemo(() => {
    if (!data?.data) return [];
    const keyword = search.toLowerCase();
    return (data.data as Payment[]).filter((p) => {
      const matchesSearch =
        p.studentId.name.toLowerCase().includes(keyword) ||
        p.studentId.email.toLowerCase().includes(keyword) ||
        p.packageId.name.toLowerCase().includes(keyword) ||
        (p.discountCode ?? "").toLowerCase().includes(keyword);
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const totalRevenue = useMemo(
    () =>
      ((data?.data as Payment[]) ?? [])
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + (p.amount ?? 0), 0),
    [data],
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-64">
        <Spinner className="size-8 text-primary" />
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center w-full h-64">
        <p className="text-sm text-destructive">
          Failed to load payments. Please try again.
        </p>
      </div>
    );

  return (
    <div className="w-[90%] mx-auto p-3 my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment List</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {payments.length} payment{payments.length !== 1 ? "s" : ""} ·{" "}
            <span className="font-semibold text-gray-800">
              ${fmt(totalRevenue)} revenue
            </span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Search by student, package or discount code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-8">#</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Original</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Discount Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Intent</TableHead>
              <TableHead>Paid At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-16 text-muted-foreground"
                >
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p, index) => (
                <TableRow key={p._id}>
                  <TableCell className="text-muted-foreground text-sm">
                    {index + 1}
                  </TableCell>

                  {/* Student */}
                  <TableCell>
                    <p className="font-medium text-sm">{p.studentId.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.studentId.email}
                    </p>
                  </TableCell>

                  {/* Package */}
                  <TableCell>
                    <p className="text-sm font-medium">{p.packageId.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.packageId.credits} credits
                    </p>
                  </TableCell>

                  {/* Original price */}
                  <TableCell className="text-sm text-muted-foreground">
                    ${fmt(p.originalPrice)}
                  </TableCell>

                  {/* Discount */}
                  <TableCell className="text-sm">
                    {(p.discountAmount ?? 0) > 0 ? (
                      <span className="text-orange-500 font-medium">
                        −${fmt(p.discountAmount)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Final amount */}
                  <TableCell className="text-sm font-bold text-gray-900">
                    ${fmt(p.amount)}{" "}
                    <span className="text-xs font-normal text-muted-foreground uppercase">
                      {p.currency}
                    </span>
                  </TableCell>

                  {/* Discount code */}
                  <TableCell>
                    {p.discountCode ? (
                      <Badge className="bg-purple-100 text-purple-700 border-0 text-xs font-medium">
                        {p.discountCode}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={`capitalize text-xs font-medium border-0 ${STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>

                  {/* Stripe Payment Intent ID */}
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {p.stripePaymentIntentId ?? "—"}
                  </TableCell>

                  {/* Paid at */}
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {p.paidAt ? formatDate(p.paidAt) : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
