export type TeacherBooking = {
  _id: string;
  studentId: { _id: string; name: string; email: string };
  teacherId: { _id: string; name: string; email: string };
  startTime: string;
  endTime: string;
  meetLink: string;
  status: "scheduled" | "completed" | "cancelled";
  attendanceStatus: string | null;
  cancellationReason: string | null;
  cancelledBy: "student" | "teacher" | null;
  cancelledAt: string | null;
  teacherJoined: boolean;
  teacherFirstJoinedAt: string | null;
  teacherLastJoinedAt: string | null;
  studentJoined: boolean;
  studentFirstJoinedAt: string | null;
  studentLastJoinedAt: string | null;
  teacherPaymentEligible: boolean;
  studentRefunded: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TeacherSlot = {
  _id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

export type TeacherAvailability = {
  day: string;
  date: string;
  slots: TeacherSlot[];
};

export type Teacher = {
  _id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "WARNING";
  totalClasses: number;
  totalEarnings: number;
  totalCanceledClasses: number;
  totalPaidOut: number;
  unpaidEarnings: number;
  averageRating: number;
  totalReviews: number;
  bookings: TeacherBooking[];
  availabilities: TeacherAvailability[];
  interests: string[];
  languages: string[];
  stripeOnboarded: boolean;
  createdAt: string;
};

export interface PricingPackage {
  _id?: string;
  name: string;
  price: number;
  credits: number;
  perClassPrice?: number;
  features: string[];
  isMostPopular: boolean;
  discount?: number;
}

export type PackageFormValues = {
  name: string;
  price: number;
  credits: number;
  perClassPrice?: number;
  isMostPopular: boolean;
  features: { value: string }[];
  discount?: number;
};

export type Lesson = {
  _id: string;
  level: string;
  title: string;
  exercises: string[];
  file?: string;
};

export type Resource = {
  _id: string;
  title: string;
  url: string;
  type: string;
};

export type LessonFormData = {
  level: string;
  title: string;
  exercises: string[];
  file?: string;
};

export type ResourceFormData = {
  title: string;
  url: string;
  type: string;
};

export type StudentPayment = {
  _id: string;
  packageId: {
    _id: string;
    name: string;
    price: number;
    credits: number;
    discount?: number;
  };
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  paidAt: string | null;
  createdAt: string;
};

export type StudentBooking = {
  _id: string;
  teacherId: { _id: string; name: string; email: string };
  startTime: string;
  endTime: string;
  meetLink: string;
  status: "scheduled" | "completed" | "cancelled";
  cancellationReason: string | null;
  cancelledBy: "student" | "teacher" | null;
  teacherJoined: boolean;
  studentJoined: boolean;
  createdAt: string;
};

export type StudentLesson = {
  _id: string;
  title: string;
  level: string;
  order: number;
  exercises: string[];
};

export type Student = {
  _id: string;
  name: string;
  email: string;
  credits: number;
  totalCompletedClasses: number;
  interests: string[];
  payment: StudentPayment[];
  booking: StudentBooking[];
  unlockedLessons: StudentLesson[];
  user?: {
    timezone: string;
    role: string;
  };
  createdAt: string;
};

export type AddCreditsFormData = {
  credits: number;
};

export type Payment = {
  _id: string;
  studentId: { _id: string; name: string; email: string };
  packageId: { _id: string; name: string; price: number; credits: number };
  stripeSessionId: string;
  stripePaymentIntentId: string;
  originalPrice: number;
  discountAmount: number;
  amount: number;
  currency: string;
  discountCode: string | null;
  status: "pending" | "completed" | "failed" | "refunded";
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Booking = {
  _id: string;
  studentId: { _id: string; name: string; email: string };
  teacherId: { _id: string; name: string; email: string };
  startTime: string;
  endTime: string;
  meetLink: string;
  status: "scheduled" | "completed" | "cancelled";
  attendanceStatus: string | null;
  cancellationReason: string | null;
  cancelledBy: "student" | "teacher" | null;
  cancelledAt: string | null;
  teacherJoined: boolean;
  teacherFirstJoinedAt: string | null;
  teacherLastJoinedAt: string | null;
  studentJoined: boolean;
  studentFirstJoinedAt: string | null;
  studentLastJoinedAt: string | null;
  teacherPaymentEligible: boolean;
  studentRefunded: boolean;
  reminder24hSent: string | null;
  reminder2hSent: string | null;
  reviewRequestSent: boolean;
  createdAt: string;
  updatedAt: string;
};
