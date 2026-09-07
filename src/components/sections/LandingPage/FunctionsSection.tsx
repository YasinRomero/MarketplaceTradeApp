import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { LandingParagraph } from "@/components/common/LandingParagraph";
import { StepCard } from "@/components/common/StepCard";
import { colors, primitives, spacing, typography } from "@/theme";

export function FunctionsSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.section}>
      <View style={styles.titleSection}>
        <LandingParagraph
          subtitle="PROCESO SIMPLE Y SEGURO"
          title="¿Cómo funciona el intercambio universitario?"
          style={styles.paragraph}
          subtitleStyle={styles.subtitle}
          titleStyle={styles.title}
        />
        <Text style={styles.description}>
          Una permuta inteligente o compra indirecta diseñada específicamente
          para la economía y confianza de la comunidad estudiantil.
        </Text>
      </View>

      <View style={[styles.cards, isMobile && styles.mobileCards]}>
        <StepCard
          step="01"
          title="Encuentra y revisa el valor"
          description="Explora los productos y revisa su Precio de referencia. Este valor estandarizado sirve como base exacta para calcular equivalencias en intercambios directos."
          tone="red"
        />
        <StepCard
          step="02"
          title="Propón tu trueque u oferta"
          description="Ofrece un artículo propio del mismo valor o complementa la diferencia monetaria de forma segura mediante la plataforma institucional verificada."
          tone="blue"
        />
        <StepCard
          step="03"
          title="Entrega en punto oficial"
          description="Acuerden la entrega presencial dentro del campus institucional (biblioteca central, cafetería principal o caseta de vigilancia autorizada)."
          tone="green"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: spacing["2xl"],
    gap: 64,
    backgroundColor: colors.background.surface,
  },

  titleSection: {
    width: "100%",
    maxWidth: 768,
    alignItems: "center",
  },

  paragraph: {
    alignItems: "center",
    paddingTop: 5,
    gap: 7,
  },

  subtitle: {
    textAlign: "center",
  },

  title: {
    maxWidth: 600,
    fontSize: typography.size["2xl"],
    lineHeight: typography.lineHeight["3xl"],
    textAlign: "center",
  },

  description: {
    maxWidth: 691,
    paddingTop: 10,
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.regular,
    textAlign: "center",
    color: primitives.neutral[900],
  },

  cards: {
    width: "100%",
    maxWidth: 1216,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: spacing["2xl"],
  },

  mobileCards: {
    flexDirection: "column",
    alignItems: "center",
  },

  card: {
    flex: 1,
    maxWidth: 384,
    minHeight: 266,
  },

  blueCard: {
    backgroundColor: colors.background.surface,
  },

  greenCard: {
    backgroundColor: colors.background.surface,
  },

  blueStepText: {
    color: primitives.blue.main,
  },

  greenStepText: {
    color: primitives.green.main,
  },
});
