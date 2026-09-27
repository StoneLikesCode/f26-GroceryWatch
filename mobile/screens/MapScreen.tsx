import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, layout } from "../theme";
import { ScreenHeader } from "../components/Chrome";

export function MapScreen() {
  return (
    <View style={styles.root}>
      <ScreenHeader title="Map" showActions={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapEmoji}>🗺</Text>
          <Text style={styles.mapTitle}>Norfolk, VA</Text>
          <Text style={styles.mapBody}>
            Map view with nearby stores is coming soon. Zip code search and radius
            filters are deluxe features.
          </Text>
        </View>

        <View style={styles.storeCard}>
          <View>
            <Text style={styles.storeName}>Harris Teeter</Text>
            <Text style={styles.storeMeta}>0.8 Miles · ★★★★☆</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Deluxe</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  content: { padding: 16, gap: 16 },
  mapPlaceholder: {
    height: 280,
    borderRadius: layout.radius,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
  mapEmoji: { fontSize: 48 },
  mapTitle: { fontSize: 20, fontWeight: "700", color: colors.text },
  mapBody: { textAlign: "center", color: colors.muted, lineHeight: 20 },
  storeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radius,
    padding: 14,
  },
  storeName: { fontSize: 16, fontWeight: "700", color: colors.text },
  storeMeta: { marginTop: 4, color: colors.muted },
  badge: {
    backgroundColor: colors.warnSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: colors.warn, fontWeight: "700", fontSize: 11 },
});
