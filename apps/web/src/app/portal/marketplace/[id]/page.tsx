import { createClient } from "@alif/database/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Store, Info, ShieldCheck, CheckCircle2, AlertTriangle, MessageCircle } from "lucide-react";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirect=/portal/marketplace/${params.id}`);

  // Fetch listing details
  const { data: listing } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      category:marketplace_categories(name),
      seller:marketplace_seller_profiles(*)
    `)
    .eq("id", params.id)
    .single();

  if (!listing) {
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto text-center py-20">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Listing not found</h2>
        <p className="text-gray-500 mt-2 mb-6">This item may have been removed or sold.</p>
        <Link href="/portal/marketplace" className="text-orange-500 hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Format WhatsApp message
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const listingUrl = `${appUrl}/portal/marketplace/${listing.id}`;
  const whatsappMessage = encodeURIComponent(
    `As-salamu alaykum, I saw your listing for "${listing.title}" on the ALIF Marketplace. Is this still available?\n\nListing: ${listingUrl}`
  );
  
  // Format WhatsApp number (ensure it has country code, default to Nigeria +234 if missing)
  let phone = listing.seller?.whatsapp_number || "";
  if (phone.startsWith("0")) phone = "234" + phone.substring(1);
  if (!phone.startsWith("+")) phone = "+" + phone;
  // Remove spaces, + and non-digits for the wa.me link
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  const whatsappLink = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <Link href="/portal/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/8">
            {listing.images && listing.images.length > 0 ? (
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <Store className="w-12 h-12 opacity-30 mb-2" />
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery (if more than 1 image) */}
          {listing.images && listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {listing.images.map((img: string, idx: number) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10 cursor-pointer hover:opacity-80">
                  <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Description Section */}
          <div className="bg-white dark:bg-[#161b22] rounded-2xl p-6 border border-gray-100 dark:border-white/8 mt-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {listing.description}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-white/8">
              <div>
                <div className="text-xs text-gray-500 mb-1">Condition</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {listing.condition?.replace(/_/g, " ")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Category</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {listing.category?.name}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Listed</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(listing.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Action */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#161b22] rounded-2xl p-6 border border-gray-100 dark:border-white/8 sticky top-24">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              {listing.title}
            </h1>
            <div className="text-3xl font-extrabold text-orange-500 mb-6">
              ₦{listing.price.toLocaleString()}
              {listing.is_negotiable && (
                <span className="text-sm font-normal text-gray-500 ml-2">(Negotiable)</span>
              )}
            </div>

            {/* Seller Info Block */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-6 border border-gray-100 dark:border-white/5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">About the Seller</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    {listing.seller?.business_name}
                    {listing.seller?.is_verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Member since {new Date(listing.seller?.created_at).getFullYear()}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {listing.location_city ? `${listing.location_city}, ${listing.location_state}` : "Nationwide Delivery"}
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Fulfillment: <span className="capitalize font-medium">{listing.fulfillment}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3.5 rounded-xl font-bold transition-colors shadow-sm shadow-[#25D366]/20"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              
              <div className="flex items-center gap-2 justify-center text-xs text-gray-500 mt-4 text-center">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>Trade safely. Meet in public or use escrow for delivery.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
