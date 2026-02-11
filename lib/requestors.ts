import requestorsData from "@/data/requestors.json";

export const REQUESTORS: string[] = Array.isArray(requestorsData)
  ? requestorsData
  : [];

export function getRequestors(): string[] {
  return REQUESTORS;
}
