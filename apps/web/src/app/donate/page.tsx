import React from "react";
import DonateClient from "./DonateClient";
import { createClient } from "@alif/database/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate | ALIF",
  description: "Support the ALIF mission of Da'wah, medical outreaches, and welfare support.",
};

export const dynamic = "force-dynamic";

export default async function DonatePage() {
  const supabase = await createClient();
  
  // Fetch active campaigns
  const { data: campaignsData } = await supabase
    .from("alif_campaigns")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  // Fetch completed transactions to calculate raised amounts per campaign
  const { data: transactionsData } = await supabase
    .from("alif_transactions")
    .select("campaign_id, amount")
    .eq("status", "completed")
    .not("campaign_id", "is", null);

  const txs = transactionsData || [];
  const campaigns = campaignsData || [];

  // Calculate raised amount for each campaign
  const campaignsWithTotals = campaigns.map(camp => {
    const raised = txs
      .filter(tx => tx.campaign_id === camp.id)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { ...camp, raised_amount: raised };
  });

  return <DonateClient initialCampaigns={campaignsWithTotals} />;
}
