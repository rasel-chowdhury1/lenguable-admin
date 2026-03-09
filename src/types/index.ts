export type Teacher = {
  _id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "WARNING";
  totalClasses: number;
  totalEarnings: number;
  cancellationsWithin24Hours: number;
  createdAt: string;
};

export interface PricingPackage {
  id: string;
  name: string;
  validity: string;
  price: number;
  credits: number;
  perClassPrice?: number;
  features: string[];
  isMostPopular: boolean;
}
