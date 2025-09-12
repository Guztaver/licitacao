import { Form, Head } from '@inertiajs/react';
import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { AuthFormField, AuthNavigationLink, AuthSubmitButton } from '@/components/auth';
import { AUTH_MESSAGES, FORM_FIELD_CONFIGS } from '@/constants/auth/constants';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

export default function Register() {
    const { name, email, password, password_confirmation } = FORM_FIELD_CONFIGS.REGISTER;

    return (
        <AuthLayout title={AUTH_MESSAGES.REGISTER_TITLE} description={AUTH_MESSAGES.REGISTER_DESCRIPTION}>
            <Head title="Register" />

            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <AuthFormField config={name} error={errors.name} />

                            <AuthFormField config={email} error={errors.email} />

                            <AuthFormField config={password} error={errors.password} />

                            <AuthFormField config={password_confirmation} error={errors.password_confirmation} />

                            <AuthSubmitButton processing={processing} className="mt-2">
                                {AUTH_MESSAGES.REGISTER_BUTTON}
                            </AuthSubmitButton>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {AUTH_MESSAGES.LOGIN_TEXT} <AuthNavigationLink href={login()}>{AUTH_MESSAGES.LOGIN_LINK}</AuthNavigationLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
