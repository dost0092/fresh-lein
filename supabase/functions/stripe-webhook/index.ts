/// <reference types="https://deno.land/x/types/index.d.ts" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bufToHex(sig);
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function toIso(ts?: number | null) {
  if (!ts) return null;
  return new Date(ts * 1000).toISOString();
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
  if (!supabaseUrl || !supabaseServiceKey) return new Response("Missing Supabase env", { status: 500 });
  if (!webhookSecret) return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const sigHeader = req.headers.get("stripe-signature") ?? "";
  const rawBody = await req.text();

  // Verify Stripe signature (HMAC SHA256)
  const segments = sigHeader.split(",").map((kv) => kv.split("=").map((s) => s.trim()));
  const t = segments.find(([k]) => k === "t")?.[1];
  const v1s = segments.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || v1s.length === 0) return new Response("Invalid signature header", { status: 400 });

  const expected = await hmacSha256Hex(webhookSecret, `${t}.${rawBody}`);
  const ok = v1s.some((v1) => timingSafeEqualHex(expected, v1));
  if (!ok) return new Response("Signature verification failed", { status: 400 });

  const event = JSON.parse(rawBody);
  const type = event?.type ?? "";
  const obj = event?.data?.object ?? {};

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const upsertByUserId = async (userId: string, patch: Record<string, unknown>) => {
    await supabase.from("subscriptions").upsert(
      { user_id: userId, ...patch },
      { onConflict: "user_id" },
    );
  };

  try {
    if (type === "checkout.session.completed") {
      const userId = obj?.metadata?.supabase_user_id ?? null;
      const customerId = obj?.customer ?? null;
      const subscriptionId = obj?.subscription ?? null;
      if (userId) {
        await upsertByUserId(userId, {
          status: "active",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        });
      }
      return new Response("ok");
    }

    if (type.startsWith("customer.subscription.")) {
      const customerId = obj?.customer ?? null;
      const subscriptionId = obj?.id ?? null;
      const status = obj?.status ?? null;
      const currentPeriodEnd = toIso(obj?.current_period_end ?? null);
      const cancelAtPeriodEnd = Boolean(obj?.cancel_at_period_end);
      const priceId = obj?.items?.data?.[0]?.price?.id ?? null;
      const userIdFromMetadata = obj?.metadata?.supabase_user_id ?? null;

      let userId = userIdFromMetadata;
      if (!userId && customerId) {
        const { data } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();
        userId = data?.user_id ?? null;
      }

      if (userId) {
        await upsertByUserId(userId, {
          status,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          current_period_end: currentPeriodEnd,
          cancel_at_period_end: cancelAtPeriodEnd,
          price_id: priceId,
          plan_name: "Pro",
        });
      }

      return new Response("ok");
    }

    return new Response("ignored");
  } catch (e) {
    return new Response(`webhook error: ${e?.message ?? "unknown"}`, { status: 500 });
  }
});

