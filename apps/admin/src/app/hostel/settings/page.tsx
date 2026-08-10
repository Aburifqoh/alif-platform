import { createClient } from "@alif/database/server";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";
import { ChevronRight, Settings } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Hostel Settings | ALIF Admin",
  description: "Manage hostel fees, deadlines, and application URLs.",
};

export default async function HostelSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/portal/admin/hostel/settings");

  // Check role
  const { data: roles } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", user.id);

  const roleNames = (roles ?? []).map((r: any) => {
    const role = r.roles;
    if (Array.isArray(role)) return role.map(x => x.name);
    return role?.name;
  }).flat();

  const hasAccess = roleNames.some((r) => ["admin", "super_admin", "hostel_manager"].includes(r as string));
  if (!hasAccess) redirect("/portal");

  // Fetch settings
  const { data: settings } = await supabase
    .from("hostel_settings")
    .select("*")
    .limit(1)
    .single();

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117]">
      <header className="bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/hostel" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Hostel Settings</h1>
            <p className="text-xs text-gray-400">Manage hostel configurations and deadlines</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SettingsForm initialData={settings || {}} />
      </div>
    </div>
  );
}
