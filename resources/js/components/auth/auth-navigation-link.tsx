import TextLink from "@/components/text-link";

interface AuthNavigationLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	tabIndex?: number;
}

export default function AuthNavigationLink({
	href,
	children,
	className,
	tabIndex = 0,
}: AuthNavigationLinkProps) {
	return (
		<TextLink href={href} className={className} tabIndex={tabIndex}>
			{children}
		</TextLink>
	);
}
