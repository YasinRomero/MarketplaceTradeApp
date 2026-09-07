import { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { School } from "@/components/icons";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type FooterAction = () => void;

interface FooterProps {
  onLoginPress?: FooterAction;
  onCategoryPress?: (category: string) => void;
  onHelpPress?: (item: string) => void;
  onSocialPress?: (network: string) => void;
}

const categories = [
  "Deportes y Equipamiento",
  "Mobiliario y Estudio",
  "Material de Laboratorio y Salud",
  "Libros y Textos Académicos",
  "Tecnología y Gadgets",
];

const helpItems = [
  "Política de Privacidad y Datos",
  "Contacto con Soporte Campus",
  "Preguntas Frecuentes (FAQ)",
  "Términos y Condiciones de Uso",
  "Guía para nuevos usuarios",
];

function FooterLink({
  children,
  onPress,
}: {
  children: string;
  onPress?: FooterAction;
}) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={styles.linkButton}
    >
      <Text style={styles.link}>{children}</Text>
    </Pressable>
  );
}

function SocialMark({ children }: { children: string }) {
  return <Text style={styles.socialMark}>{children}</Text>;
}

export function Footer({
  onLoginPress,
  onCategoryPress,
  onHelpPress,
  onSocialPress,
}: FooterProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  return (
    <View style={styles.footer}>
      <View style={[styles.container, isCompact && styles.containerCompact]}>
        <View style={[styles.information, isCompact && styles.columnCompact]}>
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <School color={colors.action.primaryForeground} size={24} />
            </View>
            <Text style={styles.logoText}>CampusTrade</Text>
          </View>

          <Text style={styles.description}>
            Plataforma oficial de comercio e intercambio estudiantil verificado
            para optimizar los recursos académicos universitarios.
          </Text>

          <View style={styles.socials}>
            {[
              ["LinkedIn", "in"],
              ["X", "X"],
              ["Facebook", "f"],
            ].map(([network, mark]) => (
              <Pressable
                accessibilityLabel={network}
                accessibilityRole="link"
                key={network}
                onPress={() => onSocialPress?.(network)}
                style={({ pressed }) => [
                  styles.social,
                  pressed && styles.socialPressed,
                ]}
              >
                <SocialMark>{mark}</SocialMark>
              </Pressable>
            ))}
          </View>
        </View>

        <FooterSection title="Categorías" compact={isCompact}>
          {categories.map((category) => (
            <FooterLink
              key={category}
              onPress={() => onCategoryPress?.(category)}
            >
              {category}
            </FooterLink>
          ))}
        </FooterSection>

        <FooterSection title="Ayuda" compact={isCompact}>
          {helpItems.map((item) => (
            <FooterLink key={item} onPress={() => onHelpPress?.(item)}>
              {item}
            </FooterLink>
          ))}
        </FooterSection>

        <View style={[styles.loginSection, isCompact && styles.columnCompact]}>
          <Text style={styles.loginTitle}>¿Ya tienes una cuenta?</Text>
          <Text style={styles.description}>
            Inicia sesión para gestionar tus publicaciones, intercambios y
            mensajes.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onLoginPress}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
          >
            <School color={colors.action.primaryForeground} size={16} />
            <Text style={styles.loginLabel}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function FooterSection({
  children,
  compact,
  title,
}: {
  children: ReactNode;
  compact: boolean;
  title: string;
}) {
  return (
    <View style={[styles.section, compact && styles.columnCompact]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.links}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  container: {
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing["2xl"],
    paddingTop: spacing["3xl"],
    paddingHorizontal: spacing["2xl"],
    paddingBottom: spacing["4xl"],
  },
  containerCompact: {
    flexDirection: "column",
    gap: spacing["3xl"],
  },
  information: { flex: 1, gap: spacing.lg },
  section: { flex: 1, gap: spacing.lg },
  loginSection: { flex: 1, gap: spacing.lg },
  columnCompact: { width: "100%", flex: 0 },
  logo: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  logoIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.action.primary,
    borderRadius: radius.lg,
  },
  logoText: {
    fontFamily: typography.family,
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  description: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.regular,
    letterSpacing: 0.12,
    color: colors.text.secondary,
  },
  socials: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  social: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.subtle,
    borderRadius: radius.full,
  },
  socialPressed: { opacity: 0.7 },
  socialMark: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.12,
    color: colors.text.primary,
  },
  links: { gap: spacing.sm },
  linkButton: { minHeight: 20, justifyContent: "center" },
  link: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.regular,
    letterSpacing: 0.12,
    color: colors.text.secondary,
  },
  loginTitle: {
    fontFamily: typography.family,
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  loginButton: {
    width: 112,
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.action.primary,
    borderRadius: radius.sm,
  },
  loginButtonPressed: { backgroundColor: colors.action.primaryActive },
  loginLabel: {
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.regular,
    color: colors.action.primaryForeground,
  },
});
