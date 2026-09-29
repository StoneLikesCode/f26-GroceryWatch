import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SETTINGS_ROWS } from "../data/mockHome";
import type { HealthState } from "../hooks/useHealth";
import { colors } from "../theme";
import { HealthChip } from "../components/Chrome";

type Props = {
  health: HealthState;
  onClose: () => void;
};

export function SettingsScreen({ health, onClose }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Settings</Text>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>

        {SETTINGS_ROWS.map((row) => (
          <Pressable
            key={row.id}
            accessibilityRole="button"
            accessibilityLabel={row.label}
            style={styles.row}
            onPress={() => {
              if (row.id === "about") {
                Alert.alert(
                  "About GroceryWatch",
                  `CS 411W · ODU\nTeam Iron GroceryWatch\n\n${health.label}`
                );
                return;
              }
              Alert.alert(row.label, `${row.hint}\n\nComing soon.`);
            }}
          >
            <Text style={styles.rowIcon}>{row.icon}</Text>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}

        <View style={styles.aboutBox}>
          <Text style={styles.aboutTitle}>System status</Text>
          <HealthChip health={health} />
          <Text style={styles.aboutBody}>
            GroceryWatch proof of concept. Live API health is shown above; settings
            preferences are not wired yet.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Home"
          style={styles.homeBtn}
          onPress={onClose}
        >
          <Text style={styles.homeBtnText}>Home</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  content: { paddingHorizontal: 16, paddingBottom: 28, gap: 4 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { color: colors.muted, fontSize: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  rowIcon: { fontSize: 18, width: 28, textAlign: "center" },
  rowLabel: { flex: 1, fontSize: 16, color: colors.text, fontWeight: "500" },
  chevron: { fontSize: 22, color: colors.muted },
  aboutBox: {
    marginTop: 16,
    backgroundColor: colors.greenSoft,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  aboutTitle: { fontWeight: "700", color: colors.text },
  aboutBody: { color: colors.muted, lineHeight: 20 },
  homeBtn: {
    marginTop: 16,
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  homeBtnText: { color: colors.white, fontWeight: "700", fontSize: 16 },
});
