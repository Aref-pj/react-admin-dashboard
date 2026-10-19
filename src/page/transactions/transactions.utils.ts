import type { TransactionStatus } from "./transactions.type";

export function formatTransactionAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTransactionDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTransactionDateTime(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export const transactionStatusStyles: Record<TransactionStatus, string> = {
  approved: "bg-c-success/10 text-c-success",
  pending: "bg-c-warning/10 text-c-warning",
  declined: "bg-c-danger/10 text-c-danger",
};