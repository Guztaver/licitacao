export const AUTH_MESSAGES = {
    // Page titles and descriptions
    LOGIN_TITLE: 'Log in to your account',
    LOGIN_DESCRIPTION: 'Enter your email and password below to log in',
    REGISTER_TITLE: 'Create an account',
    REGISTER_DESCRIPTION: 'Enter your details below to create your account',
    FORGOT_PASSWORD_TITLE: 'Forgot password',
    FORGOT_PASSWORD_DESCRIPTION: 'Enter your email to receive a password reset link',
    RESET_PASSWORD_TITLE: 'Reset password',
    RESET_PASSWORD_DESCRIPTION: 'Please enter your new password below',
    CONFIRM_PASSWORD_TITLE: 'Confirm your password',
    CONFIRM_PASSWORD_DESCRIPTION: 'This is a secure area of the application. Please confirm your password before continuing.',
    VERIFY_EMAIL_TITLE: 'Verify email',
    VERIFY_EMAIL_DESCRIPTION: 'Please verify your email address by clicking on the link we just emailed to you.',

    // Button labels
    LOGIN_BUTTON: 'Log in',
    REGISTER_BUTTON: 'Create account',
    CONFIRM_PASSWORD_BUTTON: 'Confirm password',
    RESET_PASSWORD_BUTTON: 'Reset password',
    SEND_RESET_LINK_BUTTON: 'Email password reset link',
    RESEND_VERIFICATION_BUTTON: 'Resend verification email',

    // Links and navigation
    FORGOT_PASSWORD_LINK: 'Forgot password?',
    BACK_TO_LOGIN: 'log in',
    BACK_TO_LOGIN_TEXT: 'Or, return to',
    SIGN_UP_LINK: 'Sign up',
    SIGN_UP_TEXT: "Don't have an account?",
    LOGIN_LINK: 'Log in',
    LOGIN_TEXT: 'Already have an account?',
    LOGOUT_LINK: 'Log out',
    REMEMBER_ME: 'Remember me',

    // Status messages
    VERIFICATION_LINK_SENT: 'A new verification link has been sent to the email address you provided during registration.',

    // Field labels
    NAME_LABEL: 'Name',
    EMAIL_LABEL: 'Email address',
    PASSWORD_LABEL: 'Password',
    CONFIRM_PASSWORD_LABEL: 'Confirm password',
} as const;

export const AUTH_PLACEHOLDERS = {
    EMAIL: 'email@example.com',
    PASSWORD: 'Password',
    CONFIRM_PASSWORD: 'Confirm password',
    FULL_NAME: 'Full name',
} as const;

export const FORM_FIELD_CONFIGS = {
    LOGIN: {
        email: {
            type: 'email' as const,
            name: 'email',
            label: AUTH_MESSAGES.EMAIL_LABEL,
            placeholder: AUTH_PLACEHOLDERS.EMAIL,
            autoComplete: 'email',
            required: true,
            autoFocus: true,
        },
        password: {
            type: 'password' as const,
            name: 'password',
            label: AUTH_MESSAGES.PASSWORD_LABEL,
            placeholder: AUTH_PLACEHOLDERS.PASSWORD,
            autoComplete: 'current-password',
            required: true,
        },
    },
    REGISTER: {
        name: {
            type: 'text' as const,
            name: 'name',
            label: AUTH_MESSAGES.NAME_LABEL,
            placeholder: AUTH_PLACEHOLDERS.FULL_NAME,
            autoComplete: 'name',
            required: true,
            autoFocus: true,
        },
        email: {
            type: 'email' as const,
            name: 'email',
            label: AUTH_MESSAGES.EMAIL_LABEL,
            placeholder: AUTH_PLACEHOLDERS.EMAIL,
            autoComplete: 'email',
            required: true,
        },
        password: {
            type: 'password' as const,
            name: 'password',
            label: AUTH_MESSAGES.PASSWORD_LABEL,
            placeholder: AUTH_PLACEHOLDERS.PASSWORD,
            autoComplete: 'new-password',
            required: true,
        },
        password_confirmation: {
            type: 'password' as const,
            name: 'password_confirmation',
            label: AUTH_MESSAGES.CONFIRM_PASSWORD_LABEL,
            placeholder: AUTH_PLACEHOLDERS.CONFIRM_PASSWORD,
            autoComplete: 'new-password',
            required: true,
        },
    },
    FORGOT_PASSWORD: {
        email: {
            type: 'email' as const,
            name: 'email',
            label: AUTH_MESSAGES.EMAIL_LABEL,
            placeholder: AUTH_PLACEHOLDERS.EMAIL,
            autoComplete: 'off',
            autoFocus: true,
        },
    },
    RESET_PASSWORD: {
        email: {
            type: 'email' as const,
            name: 'email',
            label: AUTH_MESSAGES.EMAIL_LABEL,
            autoComplete: 'email',
            readOnly: true,
        },
        password: {
            type: 'password' as const,
            name: 'password',
            label: AUTH_MESSAGES.PASSWORD_LABEL,
            placeholder: AUTH_PLACEHOLDERS.PASSWORD,
            autoComplete: 'new-password',
            autoFocus: true,
        },
        password_confirmation: {
            type: 'password' as const,
            name: 'password_confirmation',
            label: AUTH_MESSAGES.CONFIRM_PASSWORD_LABEL,
            placeholder: AUTH_PLACEHOLDERS.CONFIRM_PASSWORD,
            autoComplete: 'new-password',
        },
    },
    CONFIRM_PASSWORD: {
        password: {
            type: 'password' as const,
            name: 'password',
            label: AUTH_MESSAGES.PASSWORD_LABEL,
            placeholder: AUTH_PLACEHOLDERS.PASSWORD,
            autoComplete: 'current-password',
            autoFocus: true,
        },
    },
} as const;

export type FormFieldConfig = {
    type: 'text' | 'email' | 'password';
    name: string;
    label: string;
    placeholder?: string;
    autoComplete?: string;
    required?: boolean;
    autoFocus?: boolean;
    readOnly?: boolean;
};

export type AuthFormType = keyof typeof FORM_FIELD_CONFIGS;
