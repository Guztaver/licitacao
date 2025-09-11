import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import { AuthFormField, AuthSubmitButton } from '@/components/auth';
import { AUTH_MESSAGES, FORM_FIELD_CONFIGS } from '@/constants/auth/constants';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { email: emailConfig, password: passwordConfig, password_confirmation: passwordConfirmationConfig } = FORM_FIELD_CONFIGS.RESET_PASSWORD;

    return (
        <AuthLayout title={AUTH_MESSAGES.RESET_PASSWORD_TITLE} description={AUTH_MESSAGES.RESET_PASSWORD_DESCRIPTION}>
            <Head title="Reset password" />

            <Form
                {...NewPasswordController.store.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <AuthFormField config={emailConfig} error={errors.email} value={email} />

                        <AuthFormField config={passwordConfig} error={errors.password} />

                        <AuthFormField config={passwordConfirmationConfig} error={errors.password_confirmation} />

                        <AuthSubmitButton processing={processing} className="mt-4">
                            {AUTH_MESSAGES.RESET_PASSWORD_BUTTON}
                        </AuthSubmitButton>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
