export function sanitizeProjectName(name: string): string {
  return name
    .replace(/[^A-Za-z0-9-_ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildPdfFilename({
  projectName,
  type,
  number,
}: {
  projectName: string;
  type: string;
  number?: string;
}): string {
  const safeName = sanitizeProjectName(projectName) || "Project";
  const parts = number ? [safeName, type, number] : [safeName, type];
  return `${parts.join(" ")}.pdf`;
}
