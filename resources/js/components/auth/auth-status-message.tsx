import { cn } from "@/lib/utils";

interface AuthStatusMessageProps {
	message?: string;
	type?: "success" | "error" | "info";
	className?: string;
}

export default function AuthStatusMessage({
	message,
	type = "success",
	className,
}: AuthStatusMessageProps) {
	if (!message) return null;

	const typeStyles = {
		success: "text-green-600",
		error: "text-red-600",
		info: "text-blue-800",
	};

	return (
		<div
			className={cn(
				"mb-4 text-center text-sm font-medium",
				typeStyles[type],
				className,
			)}
		>
			{message}
		</div>
	);
}
