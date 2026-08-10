import { createClient } from "@alif/database/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Store, Filter } from "lucide-react";

export const metadata = {
  title: "Marketplace | ALIF",
  description: "ALIF Commerce Community",
};

export default async function MarketplacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/portal/marketplace");

  // Fetch categories
  const { data: categories } = await supabase
    .from("marketplace_categories")
    .select("*")
    .eq("is_active", true)
    .order("name");

  // Fetch approved listings
  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      category:marketplace_categories(name),
      seller:marketplace_seller_profiles(business_name, is_verified)
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">Support fellow members and discover halal products.</p>
        </div>
        <Link
          href="/portal/marketplace/new"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          Sell an Item
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-[#161b22] p-4 rounded-2xl border border-gray-100 dark:border-white/8 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" />
            All Categories
          </button>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
        <button className="px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-sm font-medium whitespace-nowrap border border-orange-200 dark:border-orange-500/20">
          All
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            className="px-4 py-1.5 rounded-full bg-white dark:bg-[#161b22] text-gray-600 dark:text-gray-400 text-sm font-medium whitespace-nowrap border border-gray-100 dark:border-white/8 hover:border-orange-200 dark:hover:border-orange-500/20 transition-colors"
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((item) => (
            <Link
              href={`/portal/marketplace/${item.id}`}
              key={item.id}
              className="group bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/8 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] bg-gray-100 dark:bg-white/5 relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Store className="w-8 h-8 opacity-50" />
                  </div>
                )}
                {/* Condition Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                  {item.condition?.replace(/_/g, " ")}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-orange-500 font-medium mb-1">
                  {item.category?.name}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
                  {item.title}
                </h3>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  ₦{item.price.toLocaleString()}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/8 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px]">{item.seller?.business_name}</span>
                    {item.seller?.is_verified && (
                      <span className="text-blue-500 ml-1 text-[10px]">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[60px]">{item.location_city || 'Nationwide'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No items found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            There are currently no active listings in the marketplace. Check back later or be the first to sell!
          </p>
          <Link
            href="/portal/marketplace/new"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Create a Listing
          </Link>
        </div>
      )}
    </div>
  );
}
