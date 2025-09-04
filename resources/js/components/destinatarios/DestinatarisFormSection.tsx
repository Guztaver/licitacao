import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface DestinatarisFormSectionProps {
	title: string;
	description: string;
	icon?: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
	className?: string;
}

export default function DestinatarisFormSection({
	title,
	description,
	icon: Icon,
	children,
	className = "",
}: DestinatarisFormSectionProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center text-lg">
					{Icon && <Icon className="mr-2 h-5 w-5" />}
					{title}
				</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="space-y-4">{children}</CardContent>
		</Card>
	);
}
