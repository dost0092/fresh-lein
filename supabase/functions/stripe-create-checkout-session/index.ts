/// <reference types="https://deno.land/x/types/index.d.ts" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "../_shared/cors.ts";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function stripeRequest(path: string, form: URLSearchParams) {
  const key = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");

  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Stripe error (${res.status}): ${text}`);
  }
  return JSON.parse(text);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return jsonResponse({ error: "Missing Authorization bearer token" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const user = userData.user;
    const body = await req.json().catch(() => ({}));
    const successUrl = body?.successUrl ?? `${new URL(req.url).origin}/dashboard/billing?checkout=success`;
    const cancelUrl = body?.cancelUrl ?? `${new URL(req.url).origin}/dashboard/billing?checkout=cancel`;

    const planId = String(body?.planId ?? "starter").toLowerCase();
    const priceByPlan: Record<string, string | undefined> = {
      starter: Deno.env.get("STRIPE_PRICE_ID_STARTER") ?? Deno.env.get("STRIPE_PRICE_ID"),
      pro: Deno.env.get("STRIPE_PRICE_ID_PRO") ?? Deno.env.get("STRIPE_PRICE_ID"),
    };
    const planNames: Record<string, string> = {
      starter: "Starter",
      pro: "Professional",
    };
    const priceId = priceByPlan[planId] ?? priceByPlan.starter ?? "";
    if (!priceId) {
      throw new Error(
        `Missing Stripe price for plan "${planId}". Set STRIPE_PRICE_ID_STARTER / STRIPE_PRICE_ID_PRO (or STRIPE_PRICE_ID).`,
      );
    }
    const planName = planNames[planId] ?? "Pro";

    // Get existing Stripe customer if present
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, plan_name, status")
      .eq("user_id", user.id)
      .maybeSingle();

    let stripeCustomerId = existingSub?.stripe_customer_id ?? null;

    if (!stripeCustomerId) {
      const created = await stripeRequest("customers", new URLSearchParams({
        email: user.email ?? "",
        "metadata[supabase_user_id]": user.id,
      }));
      stripeCustomerId = created.id;
    }

    const session = await stripeRequest("checkout/sessions", new URLSearchParams({
      mode: "subscription",
      customer: stripeCustomerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: "true",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "metadata[supabase_user_id]": user.id,
      "metadata[plan_id]": planId,
    }));

    await supabase.from("subscriptions").upsert({
      user_id: user.id,
      plan_name: planName,
      status: "incomplete",
      stripe_customer_id: stripeCustomerId,
      price_id: priceId,
    }, { onConflict: "user_id" });

    return jsonResponse({ sessionId: session.id, url: session.url });
  } catch (e) {
    return jsonResponse({ error: e?.message ?? "Unknown error" }, 400);
  }
});

