import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenHeader } from "../components/Chrome";
import { colors } from "../theme";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type CatalogProduct = {
  barcode: string | null;
  name: string;
  brand: string | null;
  packageSize: string | null;
};

type KrogerStore = {
  locationId: string;
  name: string;
  address: string;
};

type KrogerPrice = {
  barcode: string;
  price: number | null;
  promoPrice: number | null;
};

type Props = {
  onOpenSettings: () => void;
};

async function readError(res: Response) {
  try {
    const data = (await res.json()) as { error?: unknown };
    if (typeof data.error === "string") return data.error;
  } catch {
    // Response had no JSON body.
  }
  return "Search failed.";
}

export function SearchScreen({ onOpenSettings }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogProduct[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState("");
  const [zip, setZip] = useState("");
  const [stores, setStores] = useState<KrogerStore[]>([]);
  const [storeStatus, setStoreStatus] = useState<"idle" | "loading" | "error">("idle");
  const [storeError, setStoreError] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, KrogerPrice>>({});
  const [priceStatus, setPriceStatus] = useState<"idle" | "loading" | "error">("idle");
  const [priceError, setPriceError] = useState("");
  const [storesChecked, setStoresChecked] = useState(false);

  const canSearch = query.trim().length > 0 && status !== "loading";

  async function onSearch() {
    const q = query.trim();
    if (!q || status === "loading") return;

    if (!API_URL) {
      setStatus("error");
      setError("API URL not set");
      return;
    }

    setStatus("loading");
    setError("");
    setStores([]);
    setSelectedStoreId(null);
    setPrices({});
    setStoreStatus("idle");
    setStoreError("");
    setPriceStatus("idle");
    setPriceError("");
    setStoresChecked(false);

    try {
      const res = await fetch(`${API_URL}/catalog/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        setStatus("error");
        setError(await readError(res));
        return;
      }
      setResults((await res.json()) as CatalogProduct[]);
      setStatus("ready");
    } catch {
      setStatus("error");
      setError("API unreachable");
    }
  }

  async function onFindStores() {
    if (!/^\d{5}$/.test(zip.trim()) || !API_URL || storeStatus === "loading") return;
    setStoreStatus("loading");
    setStoreError("");
    setStoresChecked(false);
    setSelectedStoreId(null);
    setPrices({});
    setPriceStatus("idle");
    setPriceError("");
    try {
      const res = await fetch(`${API_URL}/stores?zip=${encodeURIComponent(zip.trim())}`);
      if (!res.ok) {
        setStoreStatus("error");
        setStoreError(await readError(res));
        setStores([]);
        return;
      }
      setStores((await res.json()) as KrogerStore[]);
      setStoresChecked(true);
      setStoreStatus("idle");
    } catch {
      setStoreStatus("error");
      setStoreError("API unreachable");
      setStores([]);
    }
  }

  async function onSelectStore(store: KrogerStore) {
    if (!API_URL || priceStatus === "loading") return;
    const barcodes = results
      .map((product) => product.barcode)
      .filter((barcode): barcode is string => Boolean(barcode));
    setSelectedStoreId(store.locationId);
    setPrices({});
    if (barcodes.length === 0) {
      setPriceStatus("idle");
      return;
    }
    setPriceStatus("loading");
    setPriceError("");
    try {
      const params = new URLSearchParams({
        locationId: store.locationId,
        barcodes: barcodes.join(","),
      });
      const res = await fetch(`${API_URL}/catalog/prices?${params.toString()}`);
      if (!res.ok) {
        setPriceStatus("error");
        setPriceError(await readError(res));
        return;
      }
      const rows = (await res.json()) as KrogerPrice[];
      const next: Record<string, KrogerPrice> = {};
      for (const row of rows) next[row.barcode] = row;
      setPrices(next);
      setPriceStatus("idle");
    } catch {
      setPriceStatus("error");
      setPriceError("API unreachable");
    }
  }

  function formatMoney(value: number) {
    return `$${value.toFixed(2)}`;
  }

  const canFindStores = /^\d{5}$/.test(zip.trim()) && storeStatus !== "loading";

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Search Products"
        onListPress={() =>
          Alert.alert("Shopping list", "Coming soon — shopping list is a deluxe feature.")
        }
        onSettingsPress={onOpenSettings}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchBar}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => void onSearch()}
            placeholder="Search foods"
            placeholderTextColor={colors.muted}
            style={styles.input}
            accessibilityLabel="Search foods"
            returnKeyType="search"
          />
          <Pressable
            accessibilityRole="button"
            disabled={!canSearch}
            onPress={() => void onSearch()}
            style={[styles.searchBtn, !canSearch && styles.searchBtnDisabled]}
          >
            <Text style={styles.searchBtnText}>Search</Text>
          </Pressable>
        </View>

        {status === "loading" && (
          <View style={styles.statusRow}>
            <ActivityIndicator color={colors.greenDark} />
            <Text style={styles.hint}>Searching...</Text>
          </View>
        )}

        {status === "error" && <Text style={styles.errorText}>{error}</Text>}

        {status === "ready" && results.length === 0 && (
          <Text style={styles.hint}>No products found.</Text>
        )}

        {status === "ready" && results.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearby Kroger</Text>
            <View style={styles.searchBar}>
              <TextInput
                value={zip}
                onChangeText={setZip}
                onSubmitEditing={() => void onFindStores()}
                placeholder="Zip code"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                style={styles.input}
                accessibilityLabel="Zip code"
                maxLength={5}
              />
              <Pressable
                accessibilityRole="button"
                disabled={!canFindStores}
                onPress={() => void onFindStores()}
                style={[styles.searchBtn, !canFindStores && styles.searchBtnDisabled]}
              >
                <Text style={styles.searchBtnText}>
                  {storeStatus === "loading" ? "Finding..." : "Find stores"}
                </Text>
              </Pressable>
            </View>
            {storeError ? <Text style={styles.errorText}>{storeError}</Text> : null}
            {!storesChecked && stores.length === 0 && storeError === "" ? (
              <Text style={styles.hint}>Enter a zip code to choose a Kroger.</Text>
            ) : null}
            {stores.map((store) => {
              const selected = store.locationId === selectedStoreId;
              return (
                <Pressable
                  key={store.locationId}
                  accessibilityRole="button"
                  onPress={() => void onSelectStore(store)}
                  style={[styles.store, selected && styles.storeSelected]}
                >
                  <Text style={styles.name}>{store.name}</Text>
                  {store.address ? <Text style={styles.meta}>{store.address}</Text> : null}
                </Pressable>
              );
            })}
            {storesChecked && stores.length === 0 && storeError === "" ? (
              <Text style={styles.hint}>No Kroger stores found for that zip.</Text>
            ) : null}
            {priceStatus === "loading" && (
              <View style={styles.statusRow}>
                <ActivityIndicator color={colors.greenDark} />
                <Text style={styles.hint}>Loading prices...</Text>
              </View>
            )}
            {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
          </View>
        )}

        {results.map((product) => {
          const quote = product.barcode ? prices[product.barcode] : undefined;
          const showAvailability = selectedStoreId !== null && priceStatus !== "loading";
          return (
            <View key={`${product.barcode ?? "none"}-${product.name}`} style={styles.row}>
              <View style={styles.rowBody}>
                <Text style={styles.name}>{product.name}</Text>
                {product.brand ? <Text style={styles.meta}>{product.brand}</Text> : null}
                {product.packageSize ? (
                  <Text style={styles.meta}>{product.packageSize}</Text>
                ) : null}
                {product.barcode ? (
                  <Text style={styles.meta}>Barcode {product.barcode}</Text>
                ) : null}
                {quote?.price !== null && quote?.price !== undefined ? (
                  <Text style={styles.price}>{formatMoney(quote.price)}</Text>
                ) : null}
                {quote?.promoPrice !== null && quote?.promoPrice !== undefined ? (
                  <Text style={styles.promo}>Promo {formatMoney(quote.promoPrice)}</Text>
                ) : null}
                {showAvailability && (quote === undefined || quote.price === null) ? (
                  <Text style={styles.meta}>Not at this store</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  content: { padding: 16, gap: 14, paddingBottom: 28 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  searchBtn: {
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchBtnDisabled: { opacity: 0.45 },
  searchBtnText: { color: colors.white, fontWeight: "700" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  hint: { fontSize: 12, color: colors.muted },
  errorText: { color: colors.danger, fontSize: 14 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  store: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    gap: 2,
  },
  storeSelected: {
    borderColor: colors.green,
    backgroundColor: colors.greenSoft,
  },
  price: { fontSize: 16, fontWeight: "800", color: colors.greenDark },
  promo: { fontSize: 13, fontWeight: "700", color: colors.green },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowBody: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: "700", color: colors.text },
  meta: { fontSize: 13, color: colors.muted },
});
