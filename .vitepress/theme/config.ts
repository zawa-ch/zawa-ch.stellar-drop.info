import { BundledTheme, ThemeRegistrationAny } from "shiki";

export type ThemeConfig = {
	branding?: {
		color?: string;
		logoSrc?: string;
		logoAlt?: string;
		logoWidth?: number;
		logoHeight?: number;
	};
	navigation?: {
		name: string;
		href: string;
	}[];
	footer?: {
		copyright?: string;
		message?: string;
		navigation?: {
			name: string;
			href: string;
		}[];
	};
	markdown?: {
		shikiTheme?: ThemeRegistrationAny | BundledTheme;
	}
};
