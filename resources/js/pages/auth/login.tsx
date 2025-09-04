import AuthenticatedSessionController from "@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";
import { password, register } from "@/routes";
import { Form, Head } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { useId } from "react";

interface LoginProps {
	status?: string;
	canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
	const emailId = useId();
	const passwordId = useId();
	const rememberId = useId();

	return (
		<AuthLayout
			title="Log in to your account"
			description="Enter your email and password below to log in"
		>
			<Head title="Log in" />

			<Form
				{...AuthenticatedSessionController.store.form()}
				resetOnSuccess={["password"]}
				className="flex flex-col gap-6"
			>
				{({ processing, errors }) => (
					<>
						<div className="grid gap-6">
							<div className="grid gap-2">
								<Label htmlFor={emailId}>Email address</Label>
								<Input
									id={emailId}
									type="email"
									name="email"
									required
									autoFocus
									tabIndex={0}
									autoComplete="email"
									placeholder="email@example.com"
								/>
								<InputError message={errors.email} />
							</div>

							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor={passwordId}>Password</Label>
									{canResetPassword && (
										<TextLink
											href={password.request()}
											className="ml-auto text-sm"
										>
											Forgot password?
										</TextLink>
									)}
								</div>
								<Input
									id={passwordId}
									type="password"
									name="password"
									required
									tabIndex={0}
									autoComplete="current-password"
									placeholder="Password"
								/>
								<InputError message={errors.password} />
							</div>

							<div className="flex items-center space-x-3">
								<Checkbox id={rememberId} name="remember" />
								<Label htmlFor={rememberId}>Remember me</Label>
							</div>

							<Button
								type="submit"
								className="mt-4 w-full"
								disabled={processing}
							>
								{processing && (
									<LoaderCircle className="h-4 w-4 animate-spin" />
								)}
								Log in
							</Button>
						</div>

						<div className="text-center text-sm text-muted-foreground">
							Don't have an account?{" "}
							<TextLink href={register()}>Sign up</TextLink>
						</div>
					</>
				)}
			</Form>

			{status && (
				<div className="mb-4 text-center text-sm font-medium text-green-600">
					{status}
				</div>
			)}
		</AuthLayout>
	);
}
