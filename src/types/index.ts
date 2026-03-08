export type Teacher = {
  name: string;
  email: string;
  hours: number;
  totalHours: number;
  totalPaid: string;
  status: "Active" | "Warning";
  cancellations: number;
};
