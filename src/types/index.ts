export type Teacher = {
  _id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "WARNING";
  totalClasses: number;
  totalEarnings: number;
  totalCanceledClasses: number;
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
  _id?: string;
  level: string;
  title: string;
  exercises: string[];
  file?: string;
};

export type Resource = {
  _id?: string;
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

export type Student = {
  _id: string;
  name: string;
  email: string;
  credits: number;
  level: string;
  classesCompleted: number;
  aboutMe?: string;
  unlockedLessons?: Lesson[];
  packages?: PricingPackage[];
  booking?: {
    _id: string;
    date: string;
    status: string;
    teacherId?: {
      _id: string;
      name: string;
      email: string;
    };
  }[];
  interests?: string[];
};

export type AddCreditsFormData = {
  credits: number;
};
