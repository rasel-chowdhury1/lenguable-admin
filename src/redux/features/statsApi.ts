import { baseApi } from "../api/baseApi";

export type WeeklyRow = {
  weekOf: string;
  weekStart: string;
  weekEnd: string;
  classesBooked: number;
  revenue: number;
  estimatedTeacherEarnings: number; // ← updated
  actualPayouts: number; // ← added
  netIncome: number;
};

export type FinancialTotals = {
  classesBooked: number;
  revenue: number;
  estimatedTeacherEarnings: number; // ← updated
  actualPayouts: number; // ← added
  netIncome: number;
};

export type OverviewStats = {
  totalRevenue: number;
  activeStudents: number;
  activeTeachers: number;
  classesThisPeriod: number;
  unpaidTeacherEarnings: number; // ← added
  period: string;
};

export type DashboardStats = {
  overview: OverviewStats;
  financials: {
    weeks: WeeklyRow[];
    totals: FinancialTotals;
    totalUnpaidEarnings: number; // ← added
  };
};

type DashboardResponse = {
  success: boolean;
  message: string;
  data: DashboardStats;
};

export type Period = "weekly" | "monthly" | "all";

type QueryArgs = { period?: Period; weeks?: number };

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, QueryArgs>({
      query: ({ period = "weekly", weeks = 4 }: QueryArgs = {}) => ({
        url: "/stats",
        params: { period, weeks },
      }),
      transformResponse: (res: DashboardResponse) => res.data,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = statsApi;
