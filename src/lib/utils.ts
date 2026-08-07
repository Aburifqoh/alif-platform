import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(new Date(date));
}

export function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function generateMembershipId() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ALIF-${year}-${random}`;
}
