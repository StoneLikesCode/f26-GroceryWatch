import { Pressable, StyleSheet, Text, View } from "react-native";
import type { HealthState } from "../hooks/useHealth";
import { colors } from "../theme";

type Props = {
  health: HealthState;
};

export function HealthChip({ health }: Props) {
  const tone =
    health.kind === "ok"
      ? styles.ok
      : health.kind === "error"
        ? styles.error
        : styles.checking;
  const dotTone =
    health.kind === "ok"
      ? styles.dotOk
      : health.kind === "error"
        ? styles.dotError
        : styles.dotChecking;

  return (
    <View style={[styles.chip, tone]}>
      <Text style={[styles.dot, dotTone]}>
        {health.kind === "checking" ? "○" : "●"}
      </Text>
      <Text style={styles.label}>{health.label}</Text>
    </View>
  );
}

type HeaderProps = {
  title: string;
  onListPress?: () => void;
  onSettingsPress?: () => void;
  showActions?: boolean;
};

export function ScreenHeader({
  title,
  onListPress,
  onSettingsPress,
  showActions = true,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {showActions ? (
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Shopping list"
            onPress={onListPress}
            style={styles.iconButton}
          >
            <Text style={styles.iconButtonText}>☰</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={onSettingsPress}
            style={styles.iconButton}
          >
            <Text style={styles.iconButtonText}>⚙</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.headerSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  ok: { backgroundColor: colors.okSoft },
  error: { backgroundColor: colors.dangerSoft },
  checking: { backgroundColor: colors.warnSoft },
  dot: { fontSize: 10 },
  dotOk: { color: colors.greenDark },
  dotError: { color: colors.danger },
  dotChecking: { color: colors.warn },
  label: { fontSize: 12, color: colors.text, fontWeight: "500" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  headerActions: { flexDirection: "row", gap: 8 },
  headerSpacer: { width: 88 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
