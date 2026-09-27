import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export type TabId = "home" | "map" | "search" | "account";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "map", label: "Map", icon: "🗺" },
  { id: "search", label: "Search", icon: "🔍" },
  { id: "account", label: "Account", icon: "👤" },
];

type Props = {
  active: TabId;
  onChange: (tab: TabId) => void;
};

export function BottomTabs({ active, onChange }: Props) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(tab.id)}
            style={styles.item}
          >
            <Text style={[styles.icon, isActive && styles.active]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.active]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    paddingTop: 8,
    paddingBottom: 10,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  icon: {
    fontSize: 18,
    color: colors.muted,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "500",
  },
  active: {
    color: colors.green,
    fontWeight: "700",
  },
});
