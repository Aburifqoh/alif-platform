import { createClient } from "@alif/database/server";
import { redirect } from "next/navigation";
import DonationsDashboardClient from "./DonationsDashboardClient";

export const metadata = {
  title: "Donations Dashboard | ALIF Admin",
};

export default async function DonationsAdminPageWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/portal/admin/donations");

  const { data: roles } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", user.id);

  const roleNames = (roles ?? []).map((r: any) => {
    const role = r.roles;
    if (Array.isArray(role)) return role.map(x => x.name);
    return role?.name;
  }).flat();

  const hasAccess = roleNames.some((r) => ["admin", "super_admin"].includes(r as string));
  if (!hasAccess) redirect("/portal");

  return <DonationsDashboardClient />;
}
