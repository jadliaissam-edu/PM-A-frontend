import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect /dashboard to the enterprise design
  redirect("/dashboard/enterprise");
}
