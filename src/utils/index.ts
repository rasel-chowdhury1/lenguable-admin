import { PricingPackage } from "@/types";

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

const generateId = () => Math.random().toString(36).slice(2, 9);

export const emptyPackage = (): PricingPackage => ({
  id: generateId(),
  name: "",
  validity: "",
  price: 0,
  credits: 1,
  perClassPrice: undefined,
  features: [""],
  isMostPopular: false,
});
