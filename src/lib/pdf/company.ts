import { prisma } from "@/lib/prisma";

export async function getCompanyProfile() {
  const profile = await prisma.companyProfile.findFirst({
    orderBy: { updatedAt: "desc" },
  });
  if (profile) return profile;
  // Sensible defaults if no profile exists yet
  return {
    companyName: "JRW Engineering",
    ownerName: "Jason R Wallace",
    title: "PE",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    peCertNumber: "",
  };
}
