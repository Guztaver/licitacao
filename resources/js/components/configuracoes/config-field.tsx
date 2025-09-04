import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ConfigFieldConfig } from "@/constants/configuracoes/constants";

interface ConfigFieldProps {
	config: ConfigFieldConfig;
	value: string | number | boolean;
	onChange: (value: string | number | boolean) => void;
	error?: string;
	className?: string;
}

export default function ConfigField({
	config,
	value,
	onChange,
	error,
	className,
}: ConfigFieldProps) {
	const fieldId = useId();

	const renderField = () => {
		switch (config.type) {
			case "text":
			case "email":
			case "password":
				return (
					<Input
						id={fieldId}
						type={config.type}
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
						placeholder={config.placeholder}
						className={error ? "border-red-500" : ""}
					/>
				);

			case "number":
				return (
					<Input
						id={fieldId}
						type="number"
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
						placeholder={config.placeholder}
						min={config.min}
						max={config.max}
						className={error ? "border-red-500" : ""}
					/>
				);

			case "textarea":
				return (
					<Textarea
						id={fieldId}
						value={String(value || "")}
						onChange={(e) => onChange(e.target.value)}
						placeholder={config.placeholder}
						rows={config.rows}
						className={error ? "border-red-500" : ""}
					/>
				);

			case "select":
				return (
					<Select value={String(value || "")} onValueChange={onChange}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{config.options?.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);

			case "switch":
				return (
					<Switch
						id={fieldId}
						checked={Boolean(value)}
						onCheckedChange={onChange}
					/>
				);

			default:
				return null;
		}
	};

	if (config.type === "switch") {
		return (
			<div
				className={cn("flex items-center justify-between space-x-2", className)}
			>
				<Label htmlFor={fieldId} className="text-sm font-medium">
					{config.label}
				</Label>
				{renderField()}
			</div>
		);
	}

	return (
		<div className={cn("space-y-2", className)}>
			<Label htmlFor={fieldId}>{config.label}</Label>
			{renderField()}
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}
