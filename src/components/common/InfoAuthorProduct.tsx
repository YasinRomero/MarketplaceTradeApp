import { Image } from "expo-image";
import { ReactNode } from "react";
import {
	ImageSourcePropType,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

import { AccountCircle, Chronic, Distance, KidStar, School } from "@/components/icons";
import { colors, radius, responsive, spacing, typography } from "@/theme";

import { HeaderSections } from "./HeaderSections";
import { Message } from "./Message";

export interface InfoAuthorProductProps {
	authorName: string;
	institution: string;
	rating: string;
	responseTime: string;
	location: string;
	authorMessage: string;
	exchangesLabel?: string;
	avatar?: ImageSourcePropType;
	institutionIcon?: ReactNode;
	style?: StyleProp<ViewStyle>;
	valueStyle?: StyleProp<TextStyle>;
}

export function InfoAuthorProduct({
	authorName,
	institution,
	rating,
	responseTime,
	location,
	authorMessage,
	exchangesLabel = "28 intercambios",
	avatar,
	institutionIcon = <School size={16} color={colors.text.primary} />,
	style,
	valueStyle,
}: InfoAuthorProductProps) {
	return (
		<View style={[styles.card, style]}>
			<HeaderSections title="Información del autor" size="compact" />

			<View style={styles.authorDisplay}>
				<View style={styles.avatarBorder}>
					{avatar ? (
						<Image contentFit="cover" source={avatar} style={styles.avatar} />
					) : (
						<AccountCircle size={32} color={colors.text.secondary} />
					)}
				</View>

				<View style={styles.authorInfo}>
					<Text style={styles.authorName}>{authorName}</Text>
					<View style={styles.institutionBadge}>
						<View style={styles.badgeContent}>
							{institutionIcon}
							<Text style={styles.institutionText}>{institution}</Text>
						</View>
					</View>
				</View>
			</View>

			<View style={styles.metrics}>
				<MetricRow
					icon={<KidStar size={12} color={colors.card.yellow.foreground} />}
					label="Calificación"
					value={`${rating} (${exchangesLabel})`}
					valueStyle={valueStyle}
				/>

				<MetricRow
					icon={<Chronic size={12} color={colors.text.secondary} />}
					label="Tiempo de respuesta"
					value={responseTime}
					valueStyle={valueStyle}
				/>

				<MetricRow
					icon={<Distance size={12} color={colors.action.primary} />}
					label="Ubicación"
					value={location}
					valueStyle={valueStyle}
				/>
			</View>

			<View style={styles.messageSection}>
				<Message variant="base" message={authorMessage} />
			</View>
		</View>
	);
}

interface MetricRowProps {
	icon: ReactNode;
	label: string;
	value: string;
	valueStyle?: StyleProp<TextStyle>;
}

function MetricRow({ icon, label, value, valueStyle }: MetricRowProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);

	return (
		<View style={[styles.metricRow, isTabletDown && styles.mobileMetricRow]}>
			<View style={styles.metricLabel}>
				{icon}
				<Text style={styles.label}>{label}</Text>
			</View>

			<Text numberOfLines={1} style={[styles.value, valueStyle]}>
				{value}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		maxWidth: 390,
		minHeight: 356,
		padding: spacing.xl,
		gap: spacing.md,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},

	authorDisplay: {
		width: "100%",
		height: 56,
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
	},

	avatarBorder: {
		width: 56,
		height: 56,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.full,
		overflow: "hidden",
	},

	avatar: {
		width: 54,
		height: 54,
	},

	authorInfo: {
		flex: 1,
		gap: spacing.xs,
	},

	authorName: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},

	institutionBadge: {
		width: "100%",
		paddingVertical: 2,
		paddingHorizontal: spacing.sm,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.full,
	},

	badgeContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},

	institutionText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
		color: colors.text.primary,
	},

	metrics: {
		width: "100%",
		paddingTop: spacing.lg,
		gap: spacing.md,
		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},

	metricRow: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},

	metricLabel: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},

	label: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
		color: colors.text.secondary,
	},

	value: {
		maxWidth: "55%",
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.semibold,
		textAlign: "right",
		color: colors.text.primary,
	},

	messageSection: {
		width: "100%",
		paddingTop: spacing.lg,
		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},

	// Mobile Responsive
	mobileMetricRow: {
		flexDirection: "column",
		alignItems: "flex-start",
		gap: spacing.xs,
	},
});
