import { createClient } from "@alif/database/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, X, ShieldAlert, Store, UserCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Admin Moderation - Marketplace",
};

export default async function AdminMarketplacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify Admin Role
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", user.id)
    .single();

  const isAdmin = Array.isArray(roleData?.roles)
    ? roleData.roles.some((r: any) => r.name === "admin" || r.name === "super_admin")
    : (roleData?.roles as any)?.name === "admin" || (roleData?.roles as any)?.name === "super_admin";

  if (!isAdmin) {
    redirect("/portal"); // Kick non-admins out
  }

  // Fetch Pending Listings
  const { data: pendingListings } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      category:category_id (name),
      seller:seller_id (business_name, whatsapp_number)
    `)
    .eq("status", "pending_review")
    .order("created_at", { ascending: false });

  async function approveListing(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const id = formData.get("id") as string;
    await supabase
      .from("marketplace_listings")
      .update({ 
        status: "approved", 
        approved_by: user.id,
        approved_at: new Date().toISOString()
      })
      .eq("id", id);
      
    revalidatePath("/portal/admin/marketplace");
    revalidatePath("/portal/marketplace");
  }

  async function rejectListing(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const id = formData.get("id") as string;
    await supabase
      .from("marketplace_listings")
      .update({ status: "rejected" })
      .eq("id", id);
      
    revalidatePath("/portal/admin/marketplace");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Outfit] flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-brand-red" />
            Marketplace Moderation
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review pending listings before they go live on the platform.</p>
        </div>
        <Link
          href="/portal/marketplace"
          className="px-4 py-2 bg-brand-cream text-brand-charcoal text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
        >
          View Live Marketplace
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {pendingListings?.length === 0 ? (
          <div className="p-12 text-center">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Queue is clear!</h3>
            <p className="text-gray-500 mt-1">There are no pending listings to review right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingListings?.map((listing: any) => (
              <div key={listing.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Image Placeholder */}
                <div className="w-full md:w-48 h-32 bg-brand-cream rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-blue-subtle text-brand-blue-dark text-xs font-medium">
                      {listing.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Submitted {new Date(listing.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{listing.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                  
                  <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-700">
                    <div className="flex items-center gap-1.5 font-semibold text-brand-gold-dark">
                      ₦{listing.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      {listing.seller?.business_name}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                  <form action={approveListing} className="flex-1 md:flex-none">
                    <input type="hidden" name="id" value={listing.id} />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl font-medium transition-colors border border-green-200"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                  </form>
                  <form action={rejectListing} className="flex-1 md:flex-none">
                    <input type="hidden" name="id" value={listing.id} />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-brand-red hover:bg-brand-red-tint rounded-xl font-medium transition-colors border border-red-100"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
