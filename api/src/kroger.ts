const TOKEN_URL = "https://api.kroger.com/v1/connect/oauth2/token";
const API_BASE = "https://api.kroger.com/v1";
const LOOKUP_BATCH = 4;

export class KrogerNotConfiguredError extends Error {
  constructor() {
    super("Kroger is not configured.");
  }
}

export class KrogerRequestError extends Error {
  constructor() {
    super("Kroger request failed.");
  }
}

export type KrogerStore = {
  locationId: string;
  name: string;
  address: string;
};

export type KrogerPrice = {
  barcode: string;
  price: number | null;
  promoPrice: number | null;
};

type TokenCache = {
  token: string;
  expiresAt: number;
};

let cachedToken: TokenCache | null = null;

function envValue(name: string) {
  const value = process.env[name]?.trim() ?? "";
  return value.length > 0 ? value : "";
}

function credentials() {
  const id = envValue("KROGER__CLIENT_ID");
  const secret = envValue("KROGER_CLIENT_SECRET");
  if (!id || !secret) return null;
  return { id, secret };
}

export function padBarcode(barcode: string) {
  const digits = barcode.trim();
  if (!/^\d+$/.test(digits) || digits.length >= 13) return digits;
  return digits.padStart(13, "0");
}

async function accessToken() {
  const creds = credentials();
  if (!creds) throw new KrogerNotConfiguredError();

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) return cachedToken.token;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "product.compact",
  });
  const basic = Buffer.from(`${creds.id}:${creds.secret}`).toString("base64");
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });
  if (!response.ok) throw new KrogerRequestError();

  const data = (await response.json()) as {
    access_token?: unknown;
    expires_in?: unknown;
  };
  if (typeof data.access_token !== "string" || data.access_token.length === 0) {
    throw new KrogerRequestError();
  }
  const expiresIn = typeof data.expires_in === "number" ? data.expires_in : 1800;
  cachedToken = {
    token: data.access_token,
    expiresAt: now + Math.max(expiresIn - 60, 30) * 1000,
  };
  return data.access_token;
}

async function krogerGet(path: string) {
  const token = await accessToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response;
}

function storeAddress(address: {
  addressLine1?: unknown;
  city?: unknown;
  state?: unknown;
  zipCode?: unknown;
}) {
  const parts = [address.addressLine1, address.city, address.state, address.zipCode]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .map((part) => part.trim());
  return parts.join(", ");
}

export async function searchStores(zip: string): Promise<KrogerStore[]> {
  const response = await krogerGet(
    `/locations?filter.zipCode.near=${encodeURIComponent(zip)}&filter.limit=5`
  );
  if (!response.ok) throw new KrogerRequestError();
  const data = (await response.json()) as {
    data?: Array<{
      locationId?: unknown;
      name?: unknown;
      address?: {
        addressLine1?: unknown;
        city?: unknown;
        state?: unknown;
        zipCode?: unknown;
      };
    }>;
  };

  const stores: KrogerStore[] = [];
  for (const store of data.data ?? []) {
    if (typeof store.locationId !== "string" || typeof store.name !== "string") continue;
    stores.push({
      locationId: store.locationId,
      name: store.name,
      address: storeAddress(store.address ?? {}),
    });
  }
  return stores;
}

function moneyOrNull(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function priceForBarcode(locationId: string, barcode: string): Promise<KrogerPrice> {
  const upc = padBarcode(barcode);
  const response = await krogerGet(
    `/products/${encodeURIComponent(upc)}?filter.locationId=${encodeURIComponent(locationId)}`
  );
  if (!response.ok) return { barcode, price: null, promoPrice: null };

  const body = (await response.json()) as {
    data?: {
      items?: Array<{ price?: { regular?: unknown; promo?: unknown } }>;
    };
  };
  const price = body.data?.items?.[0]?.price;
  return {
    barcode,
    price: moneyOrNull(price?.regular),
    promoPrice: moneyOrNull(price?.promo),
  };
}

export async function pricesForBarcodes(locationId: string, barcodes: string[]) {
  const prices: KrogerPrice[] = [];
  for (let index = 0; index < barcodes.length; index += LOOKUP_BATCH) {
    const batch = barcodes.slice(index, index + LOOKUP_BATCH);
    const found = await Promise.all(
      batch.map((barcode) => priceForBarcode(locationId, barcode))
    );
    prices.push(...found);
  }
  return prices;
}
