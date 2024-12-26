import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomHeader(texts: string[]) {
  return texts[Math.floor(Math.random() * texts.length)];
}

export function formatPlanName(plan: string) {
  return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
}

export function formatEndDate(endDate: Date) {
  return format(new Date(endDate), "d MMMM yyyy");
}

export function formatPrice(price: number) {
  return price.toLocaleString("id-ID");
}
