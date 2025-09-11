import ConfirmablePasswordController from '@/actions/App/Http/Controllers/Auth/ConfirmablePasswordController';
import { AuthFormField, AuthSubmitButton } from '@/components/auth';
import { AUTH_MESSAGES, FORM_FIELD_CONFIGS } from '@/constants/auth/constants';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { password: passwordConfig } = FORM_FIELD_CONFIGS.CONFIRM_PASSWORD;

    return (
        <AuthLayout title={AUTH_MESSAGES.CONFIRM_PASSWORD_TITLE} description={AUTH_MESSAGES.CONFIRM_PASSWORD_DESCRIPTION}>
            <Head title="Confirm password" />

            <Form {...ConfirmablePasswordController.store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <AuthFormField config={passwordConfig} error={errors.password} />

                        <div className="flex items-center">
                            <AuthSubmitButton processing={processing}>{AUTH_MESSAGES.CONFIRM_PASSWORD_BUTTON}</AuthSubmitButton>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
