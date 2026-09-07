import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { CardProcedure } from "@/components/common/CardProcedure";
import { Gavel, IdCard2, PhotoCamera } from "@/components/icons";
import { colors, primitives, spacing, typography } from "@/theme";

export function ProceduresSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.section}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Comercio seguro entre{"\n"}
            <Text style={styles.highlightTitle}>compañeros verificados</Text>
          </Text>
          <Text style={styles.description}>
            Implementamos rigurosos estándares de validación para que cada
            transacción dentro del campus sea transparente, segura y
            completamente respaldada.
          </Text>
        </View>

        <View style={[styles.cards, isMobile && styles.mobileCards]}>
          <CardProcedure
            color="green"
            icon={<IdCard2 size={24} color={primitives.green.main} />}
            badge="VALIDACIÓN ACTIVA"
            title="Cuentas Institucionales"
            description="Acceso restringido exclusivamente con correo institucional activo. Verificamos matrícula y estatus regular en cada semestre."
            style={styles.card}
          />
          <CardProcedure
            color="cyan"
            icon={<PhotoCamera size={24} color={primitives.cyan.main} />}
            badge="TRANSPARENCIA"
            title="Evidencias Obligatorias"
            description="Registro fotográfico detallado del estado real y prueba funcional requerida antes de publicar o aceptar cualquier oferta de intercambio."
            style={styles.card}
          />
          <CardProcedure
            color="yellow"
            icon={<Gavel size={24} color={primitives.yellow.main} />}
            badge="SOPORTE ESCOLAR"
            title="Moderación de Disputas"
            description="Mecanismo imparcial de resolución de discrepancias avalado por representantes estudiantiles y la administración universitaria."
            style={styles.card}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingVertical: 80,
    paddingHorizontal: spacing["2xl"],
    backgroundColor: colors.background.page,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.default,
  },

  container: {
    width: "100%",
    maxWidth: 1216,
    alignSelf: "center",
    alignItems: "center",
    gap: 64,
  },

  header: {
    width: "100%",
    alignItems: "center",
    gap: spacing.lg,
  },

  title: {
    maxWidth: 680,
    fontFamily: typography.family,
    fontSize: typography.size["3xl"],
    lineHeight: typography.lineHeight["5xl"],
    fontWeight: typography.weight.bold,
    textAlign: "center",
    color: primitives.neutral[900],
  },

  highlightTitle: {
    color: colors.action.primary,
  },

  description: {
    maxWidth: 673,
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.regular,
    textAlign: "center",
    color: primitives.neutral[900],
  },

  cards: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: spacing.lg,
  },

  mobileCards: {
    flexDirection: "column",
    alignItems: "center",
  },

  card: {
    flex: 1,
    maxWidth: 390,
    minHeight: 235,
  },
});
