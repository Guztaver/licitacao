import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ConfigInfoCardProps {
	title: string;
	message: string;
}

export default function ConfigInfoCard({
	title,
	message,
}: ConfigInfoCardProps) {
	return (
		<Card className="bg-blue-50 dark:bg-blue-950/20">
			<CardContent className="pt-6">
				<div className="flex">
					<div className="flex-shrink-0">
						<Settings className="h-5 w-5 text-blue-400" />
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
							{title}
						</h3>
						<div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
							<p style={{ whiteSpace: "pre-line" }}>{message}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
