import axios from "axios";

type ApiErrorData = Record<string, unknown>;

function flattenMessages(data: ApiErrorData): string[] {
  const messages: string[] = [];

  for (const value of Object.values(data)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") {
          messages.push(item);
        }
      }
      continue;
    }

    if (typeof value === "string") {
      messages.push(value);
    }
  }

  return messages;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data;
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const messages = flattenMessages(data as ApiErrorData);
  if (messages.length > 0) {
    return messages.join("\n");
  }

  return fallback;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}