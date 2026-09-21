import { Add, ChatBubble, KeyboardArrowDown, NotificationsUnread, School } from "@/components/icons";
import { ButtonGhost, ButtonIcon, ButtonRounded } from "@/components/ui/Button";
import { isModerator } from "@/services/authService";
import { boxShadows, colors, radius, responsive, spacing, typography } from "@/theme";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

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
	const sessionUser = useAuthStore((state) => state.currentUser);
	const signOut = useAuthStore((state) => state.signOut);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const { width } = useWindowDimensions();
	const isMobile = responsive.isTabletDown(width);

	const isLogged = variant === "logged" || Boolean(sessionUser);
	const goToMarketplace = onCategoriesPress ?? (() => router.push("/marketplace"));
	const goToPublishProduct = onPublishPress ?? (() => router.push(sessionUser ? "/publishproduct" : "/auth"));
	const goToLogin = onLoginPress ?? (() => router.push("/auth"));
	const goToHome = onLogoPress ?? (() => router.push("/"));
	const resolvedNotificationIcon = notificationIcon ?? <NotificationsUnread size={24} color={colors.text.primary} />;
	const resolvedChatIcon = chatIcon ?? <ChatBubble size={24} color={colors.text.primary} />;
	const goToChat = onChatPress ?? (() => router.push("/chat"));
	const isModeratorUser = isModerator(sessionUser);

	const toggleProfileMenu = () => {
		if (onProfilePress) {
			onProfilePress();
			return;
		}
		setIsProfileMenuOpen((open) => !open);
	};

	const navigateFromProfileMenu = (path: "/publications" | "/operations" | "/chat" | "/dispute") => {
		setIsProfileMenuOpen(false);
		router.push(path);
	};

	const handleSignOut = () => {
		setIsProfileMenuOpen(false);
		signOut();
		router.push("/");
	};

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
						<ButtonIcon icon={resolvedNotificationIcon} color="ghost" onPress={onNotificationsPress} />
						<ButtonIcon icon={resolvedChatIcon} color="ghost" onPress={goToChat} />

						<View style={styles.divider} />

						<View style={styles.profileMenuAnchor}>
							<Pressable
								accessibilityLabel="Abrir menú de usuario"
								onPress={toggleProfileMenu}
								style={[styles.profile, isMobile && styles.mobileProfile]}
							>
								<View style={styles.avatar}>
									<Text style={styles.avatarText}>{userInitials || sessionUser?.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("") || "U"}</Text>
								</View>

								<View style={styles.profileInfo}>
									<Text numberOfLines={1} style={styles.profileName}>
										{userName || sessionUser?.fullName || "Usuario"}
									</Text>

									<Text numberOfLines={1} style={styles.profileEmail}>
										{userEmail || sessionUser?.email || "Cuenta institucional"}
									</Text>
								</View>
								<KeyboardArrowDown size={18} color={colors.text.secondary} />
							</Pressable>

							{isProfileMenuOpen && (
								<View accessibilityLabel="Menú de usuario" style={styles.profileMenu}>
									<Pressable accessibilityRole="button" onPress={() => navigateFromProfileMenu("/publications")} style={styles.menuItem}>
										<Text style={styles.menuItemText}>Mis publicaciones</Text>
									</Pressable>
									<Pressable accessibilityRole="button" onPress={() => navigateFromProfileMenu("/operations")} style={styles.menuItem}>
										<Text style={styles.menuItemText}>Mis operaciones</Text>
									</Pressable>
									<Pressable accessibilityRole="button" onPress={() => navigateFromProfileMenu("/chat")} style={styles.menuItem}>
										<Text style={styles.menuItemText}>Chat</Text>
									</Pressable>
									{isModeratorUser && (
										<Pressable accessibilityRole="button" onPress={() => navigateFromProfileMenu("/dispute")} style={styles.menuItem}>
											<Text style={styles.menuItemText}>Resolver disputas</Text>
										</Pressable>
									)}
									<Pressable accessibilityRole="button" onPress={handleSignOut} style={[styles.menuItem, styles.signOutItem]}>
										<Text style={styles.signOutText}>Cerrar sesión</Text>
									</Pressable>
								</View>
							)}
						</View>

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

	maxWidth: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	left: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: spacing["2xl"],
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

	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},

	loggedActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
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

	profileMenuAnchor: {
		position: "relative",
		zIndex: 2,
	},

	profileMenu: {
		position: "absolute",
		top: 50,
		right: 0,
		width: 220,
		paddingVertical: spacing.xs,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.md,
		boxShadow: boxShadows.default,
	},

	menuItem: {
		minHeight: 40,
		justifyContent: "center",
		paddingHorizontal: spacing.md,
	},

	menuItemText: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		fontWeight: typography.weight.medium,
		color: colors.text.primary,
	},

	signOutItem: {
		marginTop: spacing.xs,
		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},

	signOutText: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		fontWeight: typography.weight.medium,
		color: colors.action.primary,
	},

	// Mobile Responsive
	mobileHeader: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
		paddingBottom: spacing.lg,
	},

	mobileNavigation: {
		display: "none",
	},

	mobileProfile: {
		flex: 1,
		minWidth: 0,
	},

	mobileLoggedPublishButton: {
		width: "100%",
	},

	mobileActions: {
		width: "100%",
		flexDirection: "column",
	},

	mobileLoggedActions: {
		width: "100%",
		flexWrap: "wrap",
		justifyContent: "flex-end",
	},

	mobileActionButton: {
		width: "100%",
	},

	mobileMaxWidth: {
		flexDirection: "column",
		alignItems: "stretch",
		gap: spacing.sm,
	},

	mobileLeft: {
		width: "100%",
		flex: 0,
		justifyContent: "space-between",
	},
});
