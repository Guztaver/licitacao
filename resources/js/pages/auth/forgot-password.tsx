import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { AuthFormField, AuthNavigationLink, AuthStatusMessage, AuthSubmitButton } from '@/components/auth';
import { AUTH_MESSAGES, FORM_FIELD_CONFIGS } from '@/constants/auth/constants';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { email: emailConfig } = FORM_FIELD_CONFIGS.FORGOT_PASSWORD;

    return (
        <AuthLayout title={AUTH_MESSAGES.FORGOT_PASSWORD_TITLE} description={AUTH_MESSAGES.FORGOT_PASSWORD_DESCRIPTION}>
            <Head title="Forgot password" />

            <AuthStatusMessage message={status} />

            <div className="space-y-6">
                <Form {...PasswordResetLinkController.store.form()}>
                    {({ processing, errors }) => (
                        <>
                            <AuthFormField config={emailConfig} error={errors.email} />

                            <div className="my-6 flex items-center justify-start">
                                <AuthSubmitButton processing={processing}>{AUTH_MESSAGES.SEND_RESET_LINK_BUTTON}</AuthSubmitButton>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>{AUTH_MESSAGES.BACK_TO_LOGIN_TEXT}</span>
                    <AuthNavigationLink href={login()}>{AUTH_MESSAGES.BACK_TO_LOGIN}</AuthNavigationLink>
                </div>
            </div>
        </AuthLayout>
    );
}
