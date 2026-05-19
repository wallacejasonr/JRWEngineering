export type FormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const emptyFormState: FormState = { ok: false };

export function zodErrorsToFieldErrors(
  issues: Array<{ path: ReadonlyArray<PropertyKey>; message: string }>
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path.map((p) => String(p)).join(".");
    if (!out[key]) out[key] = [];
    out[key].push(issue.message);
  }
  return out;
}

export function getString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function getOptionalString(fd: FormData, key: string): string | null {
  const v = getString(fd, key);
  return v === "" ? null : v;
}

export function getBoolean(fd: FormData, key: string): boolean {
  return fd.get(key) != null;
}
