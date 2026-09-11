import { ReactNode } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { Add, ChatBubble, NotificationsUnread, School } from "@/components/icons";
import { ButtonGhost, ButtonIcon, ButtonRounded } from "@/components/ui/Button";
import { colors, radius, spacing, typography } from "@/theme";

export type HeaderVariant = "default" | "logged";

export interface HeaderProps {
	variant?: HeaderVariant;
	logoIcon?: ReactNode;
	notificationIcon?: ReactNode;
	chatIcon?: ReactNode;
	addIcon?: ReactNode;
	userName?: string;
	userEmail?: string;
	userInitials?: string;
	onLogoPress?: () => void;
	onCategoriesPress?: () => void;
	onHowItWorksPress?: () => void;
	onHelpPress?: () => void;
	onLoginPress?: () => void;
	onPublishPress?: () => void;
	onNotificationsPress?: () => void;
	onChatPress?: () => void;
	onProfilePress?: () => void;
}

export function Header({
	variant = "default",
	logoIcon = <School size={24} color={colors.action.primaryForeground} />,
	notificationIcon,
	chatIcon,
	addIcon = <Add size={16} color={colors.action.primaryForeground} />,
	userName = "",
	userEmail = "",
	userInitials = "",
	onLogoPress,
	onCategoriesPress,
	onHowItWorksPress,
	onHelpPress,
	onLoginPress,
	onPublishPress,
	onNotificationsPress,
	onChatPress,
	onProfilePress,
}: HeaderProps) {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const isMobile = width < 768;
	const isLogged = variant === "logged";
	const goToMarketplace = onCategoriesPress ?? (() => router.push("/marketplace"));
	const goToPublishProduct = onPublishPress ?? (() => router.push("/publishproduct"));
	const goToLogin = onLoginPress ?? (() => router.push("/auth"));
	const goToHome = onLogoPress ?? (() => router.push("/"));
	const resolvedNotificationIcon = notificationIcon ?? <NotificationsUnread size={24} color={colors.text.primary} />;
	const resolvedChatIcon = chatIcon ?? <ChatBubble size={24} color={colors.text.primary} />;

	return (
		<View style={[styles.header, isMobile && styles.mobileHeader]}>
			<View style={[styles.maxWidth, isMobile && styles.mobileMaxWidth]}>
				<View style={[styles.left, isMobile && styles.mobileLeft]}>
					<Pressable onPress={goToHome} style={styles.logo}>
						<View style={styles.logoIcon}>{logoIcon}</View>

						<Text style={styles.logoText}>Intido</Text>
					</Pressable>

					<View style={[styles.navigation, isMobile && styles.mobileNavigation]}>
						<ButtonGhost onPress={goToMarketplace}>Marketplace</ButtonGhost>

						<ButtonGhost onPress={onHowItWorksPress}>Cómo funciona</ButtonGhost>

						<ButtonGhost onPress={onHelpPress}>Ayuda</ButtonGhost>
					</View>
				</View>

				{!isLogged ? (
					<View style={[styles.actions, isMobile && styles.mobileActions]}>
						<ButtonGhost onPress={goToLogin} style={isMobile && styles.mobileActionButton}>
							Iniciar sesión
						</ButtonGhost>

						<ButtonRounded
							icon={addIcon}
							onPress={goToPublishProduct}
							style={isMobile && styles.mobileActionButton}
						>
							Publicar producto
						</ButtonRounded>
					</View>
				) : (
					<View style={[styles.loggedActions, isMobile && styles.mobileLoggedActions]}>
						<ButtonIcon
							icon={resolvedNotificationIcon}
							accessibilityLabel="Notificaciones"
							variant="ghost"
							onPress={onNotificationsPress}
						/>

						<ButtonIcon
							icon={resolvedChatIcon}
							accessibilityLabel="Mensajes"
							variant="ghost"
							onPress={onChatPress}
						/>

						<View style={styles.divider} />

						<Pressable onPress={onProfilePress} style={[styles.profile, isMobile && styles.mobileProfile]}>
							<View style={styles.avatar}>
								<Text style={styles.avatarText}>{userInitials}</Text>
							</View>

							<View style={styles.profileInfo}>
								<Text numberOfLines={1} style={styles.profileName}>
									{userName}
								</Text>

								<Text numberOfLines={1} style={styles.profileEmail}>
									{userEmail}
								</Text>
							</View>
						</Pressable>

						<ButtonRounded
							icon={addIcon}
							onPress={goToPublishProduct}
							style={isMobile && styles.mobileLoggedPublishButton}
						>
							Publicar producto
						</ButtonRounded>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		width: "100%",
		minHeight: 73,

		justifyContent: "center",

		paddingVertical: spacing.md + 2,
		paddingHorizontal: spacing.xl,

		backgroundColor: colors.background.surface,

		borderBottomWidth: 1,
		borderBottomColor: colors.border.default,
	},

	mobileHeader: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
		paddingBottom: spacing.lg,
	},

	maxWidth: {
		width: "100%",
		maxWidth: 1232,

		alignSelf: "center",

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	mobileMaxWidth: {
		flexDirection: "column",
		alignItems: "stretch",
		gap: spacing.sm,
	},

	left: {
		flex: 1,

		flexDirection: "row",
		alignItems: "center",

		gap: spacing["2xl"],
	},

	mobileLeft: {
		width: "100%",
		flex: 0,
		justifyContent: "space-between",
	},

	logo: {
		flexDirection: "row",
		alignItems: "center",

		gap: spacing.md - 2,
	},

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
		fontSize: typography.size.md,
		lineHeight: typography.lineHeight.xl,
		fontWeight: typography.weight.bold,

		color: colors.text.primary,
	},

	navigation: {
		flexDirection: "row",
		alignItems: "center",
	},

	mobileNavigation: {
		display: "none",
	},

	actions: {
		flexDirection: "row",
		alignItems: "center",

		gap: spacing.sm,
	},

	mobileActions: {
		width: "100%",
		justifyContent: "space-between",
	},

	mobileActionButton: {
		flex: 1,
	},

	loggedActions: {
		flexDirection: "row",
		alignItems: "center",

		gap: spacing.sm,
	},

	mobileLoggedActions: {
		width: "100%",
		flexWrap: "wrap",
		justifyContent: "flex-end",
	},

	divider: {
		width: 1,
		height: 20,
		marginHorizontal: spacing.xs,
		backgroundColor: colors.border.default,
	},

	profile: {
		minWidth: 233,
		height: 44,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.sm,
		gap: spacing.md - 2,
		borderRadius: radius.md,
	},

	mobileProfile: {
		flex: 1,
		minWidth: 0,
	},

	mobileLoggedPublishButton: {
		width: "100%",
	},

	avatar: {
		width: 36,
		height: 36,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background.subtle,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.full,
	},

	avatarText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.md - 2,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},

	profileInfo: {
		flex: 1,
	},

	profileName: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},

	profileEmail: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
		color: colors.text.secondary,
	},
});
