import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SEARCH_PRODUCTS } from "../data/mockHome";
import { colors, layout } from "../theme";
import { ScreenHeader } from "../components/Chrome";

export function AccountScreen() {
  return (
    <View style={styles.root}>
      <ScreenHeader title="Account" showActions={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profile}>
          <View style={styles.avatar} />
          <View style={styles.profileText}>
            <Text style={styles.name}>Your Name</Text>
            <Text style={styles.meta}>Registered Shopper</Text>
            <View style={styles.points}>
              <Text style={styles.pointsText}>Points 1,412</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tier Progress</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.muted}>840 pts to Platinum</Text>
            <Text style={styles.muted}>64%</Text>
          </View>
        </View>

        <Pressable
          style={styles.primaryBtn}
          onPress={() => Alert.alert("Rewards", "Coming soon — rewards are a deluxe feature.")}
        >
          <Text style={styles.primaryBtnText}>Redeem Rewards</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => Alert.alert("Coupons", "Coming soon — coupons are a deluxe feature.")}
        >
          <Text style={styles.secondaryBtnText}>View Coupons</Text>
        </Pressable>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity</Text>
            <Text style={styles.link}>See History</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Recent Comparison</Text>
            <Text style={styles.saved}>Saved $4.60</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Cart</Text>
            <Text style={styles.link}>See Cart</Text>
          </View>
          {SEARCH_PRODUCTS.slice(0, 2).map((item) => (
            <View key={item.id} style={styles.cartRow}>
              <View style={styles.thumb} />
              <View>
                <Text style={styles.cartName}>{item.name}</Text>
                <Text style={styles.muted}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Account, rewards, and cart are deluxe / coming soon.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  content: { padding: 16, gap: 14, paddingBottom: 28 },
  profile: { flexDirection: "row", gap: 14, alignItems: "center" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.placeholder,
  },
  profileText: { flex: 1, gap: 4 },
  name: { fontSize: 20, fontWeight: "800", color: colors.text },
  meta: { color: colors.muted },
  points: {
    alignSelf: "flex-start",
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pointsText: { color: colors.white, fontWeight: "700", fontSize: 12 },
  section: { gap: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  progressFill: {
    width: "64%",
    height: "100%",
    backgroundColor: colors.green,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  muted: { color: colors.muted, fontSize: 13 },
  primaryBtn: {
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: colors.white, fontWeight: "700" },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryBtnText: { color: colors.text, fontWeight: "700" },
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    padding: 14,
  },
  cardLabel: { color: colors.muted, marginBottom: 4 },
  saved: { fontSize: 22, fontWeight: "800", color: colors.text },
  link: { color: colors.greenDark, fontWeight: "600", fontSize: 13 },
  cartRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.placeholder,
  },
  cartName: { fontWeight: "700", color: colors.text },
  footer: { textAlign: "center", color: colors.muted, fontSize: 12, marginTop: 8 },
});
