import { Form, Head } from '@inertiajs/react';
import { useCallback, useId } from 'react';
import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import { AuthFormField, AuthNavigationLink, AuthStatusMessage, AuthSubmitButton } from '@/components/auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AUTH_MESSAGES, FORM_FIELD_CONFIGS } from '@/constants/auth/constants';
import AuthLayout from '@/layouts/auth-layout';
import { password, register } from '@/routes';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const rememberId = useId();
    const { email: emailConfig, password: passwordConfig } = FORM_FIELD_CONFIGS.LOGIN;

    const renderForgotPasswordLink = useCallback(() => {
        if (!canResetPassword) return null;

        return (
            <AuthNavigationLink href={password.request()} className="ml-auto text-sm">
                {AUTH_MESSAGES.FORGOT_PASSWORD_LINK}
            </AuthNavigationLink>
        );
    }, [canResetPassword]);

    return (
        <AuthLayout title={AUTH_MESSAGES.LOGIN_TITLE} description={AUTH_MESSAGES.LOGIN_DESCRIPTION}>
            <Head title="Log in" />

            <AuthStatusMessage message={status} />

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <AuthFormField config={emailConfig} error={errors.email} />

                            <AuthFormField config={passwordConfig} error={errors.password}>
                                {renderForgotPasswordLink()}
                            </AuthFormField>

                            <div className="flex items-center space-x-3">
                                <Checkbox id={rememberId} name="remember" />
                                <Label htmlFor={rememberId}>{AUTH_MESSAGES.REMEMBER_ME}</Label>
                            </div>

                            <AuthSubmitButton processing={processing} className="mt-4">
                                {AUTH_MESSAGES.LOGIN_BUTTON}
                            </AuthSubmitButton>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {AUTH_MESSAGES.SIGN_UP_TEXT} <AuthNavigationLink href={register()}>{AUTH_MESSAGES.SIGN_UP_LINK}</AuthNavigationLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
