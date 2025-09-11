import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { AuthNavigationLink, AuthStatusMessage, AuthSubmitButton } from '@/components/auth';
import { AUTH_MESSAGES } from '@/constants/auth/constants';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const isVerificationLinkSent = status === 'verification-link-sent';

    return (
        <AuthLayout title={AUTH_MESSAGES.VERIFY_EMAIL_TITLE} description={AUTH_MESSAGES.VERIFY_EMAIL_DESCRIPTION}>
            <Head title="Email verification" />

            {isVerificationLinkSent && <AuthStatusMessage message={AUTH_MESSAGES.VERIFICATION_LINK_SENT} />}

            <Form {...EmailVerificationNotificationController.store.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <AuthSubmitButton processing={processing} variant="secondary">
                            {AUTH_MESSAGES.RESEND_VERIFICATION_BUTTON}
                        </AuthSubmitButton>

                        <AuthNavigationLink href={logout()} className="mx-auto block text-sm">
                            {AUTH_MESSAGES.LOGOUT_LINK}
                        </AuthNavigationLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
