import { Building, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DestinatarisInfoCardProps {
	title: string;
	content: string;
	icon?: React.ComponentType<{ className?: string }>;
	variant?: "info" | "tip" | "warning";
}

const variantConfig = {
	info: {
		bgColor: "bg-blue-50 dark:bg-blue-950/20",
		iconColor: "text-blue-400",
		titleColor: "text-blue-800 dark:text-blue-200",
		contentColor: "text-blue-700 dark:text-blue-300",
		defaultIcon: Info,
	},
	tip: {
		bgColor: "bg-blue-50 dark:bg-blue-950/20",
		iconColor: "text-blue-400",
		titleColor: "text-blue-800 dark:text-blue-200",
		contentColor: "text-blue-700 dark:text-blue-300",
		defaultIcon: Building,
	},
	warning: {
		bgColor: "bg-amber-50 dark:bg-amber-950/20",
		iconColor: "text-amber-400",
		titleColor: "text-amber-800 dark:text-amber-200",
		contentColor: "text-amber-700 dark:text-amber-300",
		defaultIcon: AlertTriangle,
	},
} as const;

export default function DestinatarisInfoCard({
	title,
	content,
	icon,
	variant = "tip",
}: DestinatarisInfoCardProps) {
	const config = variantConfig[variant];
	const IconComponent = icon || config.defaultIcon;

	return (
		<Card className={config.bgColor}>
			<CardContent className="pt-6">
				<div className="flex">
					<div className="flex-shrink-0">
						<IconComponent className={`h-5 w-5 ${config.iconColor}`} />
					</div>
					<div className="ml-3">
						<h3 className={`text-sm font-medium ${config.titleColor}`}>
							{title}
						</h3>
						<div className={`mt-2 text-sm ${config.contentColor}`}>
							{content.split("\n").map((line, index) => (
								<p key={index}>{line}</p>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
