import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SEARCH_PRODUCTS } from "../data/mockHome";
import { colors } from "../theme";
import { ScreenHeader } from "../components/Chrome";

type Props = {
  onOpenSettings: () => void;
};

export function SearchScreen({ onOpenSettings }: Props) {
  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Search Products"
        onListPress={() =>
          Alert.alert("Shopping list", "Coming soon — shopping list is a deluxe feature.")
        }
        onSettingsPress={onOpenSettings}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
        <Text style={styles.hint}>
          Sample results based on location set in Maps (coming soon).
        </Text>

        {SEARCH_PRODUCTS.map((product) => (
          <View key={product.id} style={styles.row}>
            <View style={styles.thumb} />
            <View style={styles.rowBody}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.description}>{product.description}</Text>
              <Pressable
                onPress={() =>
                  Alert.alert(
                    "Store prices",
                    "Live store price comparison will connect to the API later."
                  )
                }
              >
                <Text style={styles.link}>🛒 See store prices</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  content: { padding: 16, gap: 14 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { color: colors.muted, fontSize: 16 },
  hint: { fontSize: 12, color: colors.muted },
  row: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: colors.placeholder,
  },
  rowBody: { flex: 1, gap: 4, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "700", color: colors.text },
  description: { fontSize: 13, color: colors.muted },
  link: { marginTop: 2, color: colors.greenDark, fontWeight: "600" },
});
