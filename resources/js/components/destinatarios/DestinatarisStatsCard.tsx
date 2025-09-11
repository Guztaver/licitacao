import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DestinatarisStatsCardProps {
	title: string;
	value: number | string;
	description: string;
	icon?: React.ComponentType<{ className?: string }>;
	color?: string;
}

export default function DestinatarisStatsCard({
	title,
	value,
	description,
	icon,
	color = "blue",
}: DestinatarisStatsCardProps) {
	const IconComponent = icon || MapPin;

	const colorClasses = {
		blue: "text-blue-600",
		green: "text-green-600",
		purple: "text-purple-600",
		gray: "text-gray-600",
		yellow: "text-yellow-600",
	};

	const textColor =
		colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<IconComponent className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className={`text-2xl font-bold ${textColor}`}>
					{typeof value === "number" ? value.toLocaleString("pt-BR") : value}
				</div>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}
