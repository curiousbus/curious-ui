import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

export type AuthSocialProvider = "google" | "apple" | "twitter" | "x" | "facebook" | (string & {});

type AsyncResult = void | Promise<void>;

type AuthSignInCardProps = React.ComponentPropsWithoutRef<"section">;
type AuthSignInHeaderProps = React.ComponentPropsWithoutRef<"div"> & {
  title: string;
  description?: string;
  align?: "left" | "center";
};
type AuthSignInContentProps = React.ComponentPropsWithoutRef<"div">;
type AuthProviderGroupProps = React.ComponentPropsWithoutRef<"div">;
type AuthSeparatorProps = React.ComponentPropsWithoutRef<"div"> & {
  label?: string;
};
type AuthFooterProps = React.ComponentPropsWithoutRef<"div">;

type AuthProviderButtonProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "onClick" | "children"
> & {
  provider: AuthSocialProvider;
  label?: string;
  icon?: React.ReactNode;
  pending?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onProviderSignIn?: (provider: AuthSocialProvider) => AsyncResult;
};

type AuthPresetProviderButtonProps = Omit<
  AuthProviderButtonProps,
  "provider" | "label" | "icon"
> & {
  label?: string;
};

export type AuthEmailPasswordPayload = {
  email: string;
  password: string;
};

type AuthEmailPasswordFormProps = Omit<
  React.ComponentPropsWithoutRef<"form">,
  "onSubmit" | "children"
> & {
  defaultEmail?: string;
  defaultPassword?: string;
  emailLabel?: string;
  passwordLabel?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  submitLabel?: string;
  pending?: boolean;
  forgotPasswordLabel?: string;
  forgotPasswordHref?: string;
  onForgotPasswordClick?: () => void;
  onSubmitCredentials?: (payload: AuthEmailPasswordPayload) => AsyncResult;
};

export type AuthMagicLinkPayload = {
  email: string;
};

type AuthMagicLinkFormProps = Omit<
  React.ComponentPropsWithoutRef<"form">,
  "onSubmit" | "children"
> & {
  defaultEmail?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  submitLabel?: string;
  pending?: boolean;
  onSubmitMagicLink?: (payload: AuthMagicLinkPayload) => AsyncResult;
};

const CARD_CLASS = "rounded-lg border bg-card text-card-foreground shadow-sm";
const CARD_HEADER_CLASS = "flex flex-col gap-1.5 p-6";
const CARD_CONTENT_CLASS = "p-6 pt-0";
const INPUT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
const LABEL_CLASS =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
const SOLID_BUTTON_CLASS =
  "inline-flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const OUTLINE_BUTTON_CLASS =
  "inline-flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

const SOCIAL_PROVIDER_DEFAULTS: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
  }
> = {
  google: { label: "Continue with Google", icon: <GoogleIcon /> },
  apple: { label: "Continue with Apple", icon: <AppleIcon /> },
  twitter: { label: "Continue with X", icon: <XIcon /> },
  x: { label: "Continue with X", icon: <XIcon /> },
  facebook: { label: "Continue with Facebook", icon: <FacebookIcon /> },
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function normalizeProvider(provider: AuthSocialProvider) {
  if (provider === "x") {
    return "twitter";
  }
  return provider;
}

function isPromiseLike(value: unknown): value is Promise<unknown> {
  return Boolean(value) && typeof (value as Promise<unknown>).then === "function";
}

export function AuthSignInCard({ className, children, ...props }: AuthSignInCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={cn("mx-auto w-full max-w-md", className)}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.28, ease: "easeOut" }}
      {...props}
    >
      <div className={CARD_CLASS}>{children}</div>
    </motion.section>
  );
}

export function AuthSignInHeader({
  className,
  title,
  description,
  align = "center",
  ...props
}: AuthSignInHeaderProps) {
  return (
    <div
      className={cn(CARD_HEADER_CLASS, align === "center" ? "text-center" : "text-left", className)}
      {...props}
    >
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function AuthSignInContent({ className, ...props }: AuthSignInContentProps) {
  return <div className={cn(CARD_CONTENT_CLASS, className)} {...props} />;
}

export function AuthProviderGroup({ className, ...props }: AuthProviderGroupProps) {
  return <div className={cn("flex flex-col gap-3", className)} {...props} />;
}

export function AuthProviderButton({
  provider,
  label,
  icon,
  pending,
  onClick,
  onProviderSignIn,
  disabled,
  className,
  ...props
}: AuthProviderButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isPendingInternal, setIsPendingInternal] = React.useState(false);
  const normalizedProvider = normalizeProvider(provider);
  const isPending = pending ?? isPendingInternal;

  const providerDefaults = SOCIAL_PROVIDER_DEFAULTS[provider] ?? {
    label: `Continue with ${String(provider)}`,
    icon: <ProviderIcon />,
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    onClick?.(event);
    if (event.defaultPrevented || !onProviderSignIn) {
      return;
    }

    const result = onProviderSignIn(normalizedProvider);
    if (!isPromiseLike(result)) {
      return;
    }

    setIsPendingInternal(true);
    try {
      await result;
    } finally {
      setIsPendingInternal(false);
    }
  };

  return (
    <motion.button
      type="button"
      className={cn(OUTLINE_BUTTON_CLASS, className)}
      disabled={disabled || isPending}
      onClick={handleClick}
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      {...props}
    >
      {icon ?? providerDefaults.icon}
      <span>{label ?? providerDefaults.label}</span>
    </motion.button>
  );
}

export function AuthGoogleButton({ label, ...props }: AuthPresetProviderButtonProps) {
  return (
    <AuthProviderButton provider="google" label={label ?? "Continue with Google"} {...props} />
  );
}

export function AuthAppleButton({ label, ...props }: AuthPresetProviderButtonProps) {
  return <AuthProviderButton provider="apple" label={label ?? "Continue with Apple"} {...props} />;
}

export function AuthXButton({ label, ...props }: AuthPresetProviderButtonProps) {
  return <AuthProviderButton provider="twitter" label={label ?? "Continue with X"} {...props} />;
}

export function AuthFacebookButton({ label, ...props }: AuthPresetProviderButtonProps) {
  return (
    <AuthProviderButton provider="facebook" label={label ?? "Continue with Facebook"} {...props} />
  );
}

export function AuthSeparator({
  label = "Or continue with",
  className,
  ...props
}: AuthSeparatorProps) {
  return (
    <div
      className={cn(
        "relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 bg-card px-2 text-muted-foreground">{label}</span>
    </div>
  );
}

export function AuthEmailPasswordForm({
  className,
  defaultEmail,
  defaultPassword,
  emailLabel = "Email",
  passwordLabel = "Password",
  emailPlaceholder = "m@example.com",
  passwordPlaceholder,
  submitLabel = "Sign in",
  pending,
  forgotPasswordLabel = "Forgot your password?",
  forgotPasswordHref,
  onForgotPasswordClick,
  onSubmitCredentials,
  disabled,
  ...props
}: AuthEmailPasswordFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isPendingInternal, setIsPendingInternal] = React.useState(false);
  const emailId = React.useId();
  const passwordId = React.useId();

  const isPending = pending ?? isPendingInternal;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!onSubmitCredentials) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const result = onSubmitCredentials({ email, password });
    if (!isPromiseLike(result)) {
      return;
    }

    setIsPendingInternal(true);
    try {
      await result;
    } finally {
      setIsPendingInternal(false);
    }
  };

  return (
    <form className={cn("grid gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="grid gap-2">
        <label className={LABEL_CLASS} htmlFor={emailId}>
          {emailLabel}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          className={INPUT_CLASS}
          placeholder={emailPlaceholder}
          defaultValue={defaultEmail}
          autoComplete="email"
          required
          disabled={disabled || isPending}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <label className={LABEL_CLASS} htmlFor={passwordId}>
            {passwordLabel}
          </label>
          {forgotPasswordHref ? (
            <a
              href={forgotPasswordHref}
              className="ml-auto text-sm underline-offset-4 hover:underline"
              onClick={(event) => {
                if (!onForgotPasswordClick) {
                  return;
                }
                event.preventDefault();
                onForgotPasswordClick();
              }}
            >
              {forgotPasswordLabel}
            </a>
          ) : onForgotPasswordClick ? (
            <button
              type="button"
              className="ml-auto text-sm underline-offset-4 hover:underline"
              onClick={onForgotPasswordClick}
            >
              {forgotPasswordLabel}
            </button>
          ) : null}
        </div>

        <input
          id={passwordId}
          name="password"
          type="password"
          className={INPUT_CLASS}
          placeholder={passwordPlaceholder}
          defaultValue={defaultPassword}
          autoComplete="current-password"
          required
          disabled={disabled || isPending}
        />
      </div>

      <motion.button
        type="submit"
        className={SOLID_BUTTON_CLASS}
        disabled={disabled || isPending}
        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      >
        {isPending ? "Signing in..." : submitLabel}
      </motion.button>
    </form>
  );
}

export function AuthMagicLinkForm({
  className,
  defaultEmail,
  emailLabel = "Email",
  emailPlaceholder = "m@example.com",
  submitLabel = "Send magic link",
  pending,
  onSubmitMagicLink,
  disabled,
  ...props
}: AuthMagicLinkFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isPendingInternal, setIsPendingInternal] = React.useState(false);
  const emailId = React.useId();
  const isPending = pending ?? isPendingInternal;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!onSubmitMagicLink) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    const result = onSubmitMagicLink({ email });
    if (!isPromiseLike(result)) {
      return;
    }

    setIsPendingInternal(true);
    try {
      await result;
    } finally {
      setIsPendingInternal(false);
    }
  };

  return (
    <form className={cn("grid gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="grid gap-2">
        <label className={LABEL_CLASS} htmlFor={emailId}>
          {emailLabel}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          className={INPUT_CLASS}
          placeholder={emailPlaceholder}
          defaultValue={defaultEmail}
          autoComplete="email"
          required
          disabled={disabled || isPending}
        />
      </div>

      <motion.button
        type="submit"
        className={SOLID_BUTTON_CLASS}
        disabled={disabled || isPending}
        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      >
        <MailIcon />
        <span>{isPending ? "Sending..." : submitLabel}</span>
      </motion.button>
    </form>
  );
}

export function AuthFooter({ className, ...props }: AuthFooterProps) {
  return <div className={cn("text-center text-sm text-muted-foreground", className)} {...props} />;
}

export function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
    >
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AppleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
    >
      <path
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
        fill="currentColor"
      />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
    >
      <path
        d="M18.244 2H21.5L14.385 10.125L22.75 22H16.248L11.157 14.873L4.918 22H1.66L9.27 13.304L1.25 2H7.917L12.519 8.471L18.244 2ZM17.102 20.02H18.906L6.935 3.877H5.001L17.102 20.02Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
    >
      <path
        d="M22 12.073C22 6.509 17.523 2 12 2C6.477 2 2 6.509 2 12.073C2 17.102 5.657 21.27 10.438 22V14.965H7.898V12.073H10.438V9.868C10.438 7.35 11.93 5.958 14.215 5.958C15.31 5.958 16.453 6.155 16.453 6.155V8.628H15.193C13.951 8.628 13.563 9.406 13.563 10.204V12.073H16.336L15.893 14.965H13.563V22C18.343 21.27 22 17.102 22 12.073Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.5 7L12 12.5L19.5 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProviderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8 12H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
