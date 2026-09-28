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

        {results.map((product) => (
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
            </View>
          </View>
        ))}

        {status === "ready" && results.length > 0 && (
          <Text style={styles.hint}>
            Store price and store location come from Kroger and are not connected yet.
          </Text>
        )}
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
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowBody: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: "700", color: colors.text },
  meta: { fontSize: 13, color: colors.muted },
});
