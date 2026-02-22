import * as React from "react";

type AsyncResult = void | Promise<void>;

type AuthSignUpCardProps = React.ComponentPropsWithoutRef<"section">;
type AuthSignUpHeaderProps = React.ComponentPropsWithoutRef<"div"> & {
  title: string;
  description?: string;
  align?: "left" | "center";
};
type AuthSignUpContentProps = React.ComponentPropsWithoutRef<"div">;
type AuthSignUpFooterProps = React.ComponentPropsWithoutRef<"div">;

export type AuthSignUpPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export type AuthSignUpErrors = Partial<Record<keyof AuthSignUpPayload, string>> & {
  form?: string;
};

type AuthSignUpFormProps = Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit" | "children"> & {
  defaultValues?: Partial<AuthSignUpPayload>;
  pending?: boolean;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmPasswordLabel?: string;
  confirmPasswordPlaceholder?: string;
  termsLabel?: React.ReactNode;
  submitLabel?: string;
  requireTerms?: boolean;
  termsHref?: string;
  validate?: (payload: AuthSignUpPayload) => AuthSignUpErrors;
  onSubmitRegistration?: (payload: AuthSignUpPayload) => AsyncResult;
};

const CARD_CLASS = "rounded-lg border bg-card text-card-foreground shadow-sm";
const CARD_HEADER_CLASS = "flex flex-col gap-1.5 p-6";
const CARD_CONTENT_CLASS = "p-6 pt-0";
const LABEL_CLASS =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
const INPUT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
const SOLID_BUTTON_CLASS =
  "inline-flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function isPromiseLike(value: unknown): value is Promise<unknown> {
  return Boolean(value) && typeof (value as Promise<unknown>).then === "function";
}

function toErrorMessage(value: unknown, fallback: string) {
  if (value instanceof Error && value.message.trim().length > 0) {
    return value.message;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  return fallback;
}

function getDefaultErrors(payload: AuthSignUpPayload, requireTerms: boolean): AuthSignUpErrors {
  const errors: AuthSignUpErrors = {};

  if (!payload.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!payload.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!payload.password) {
    errors.password = "Password is required.";
  }

  if (!payload.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  }

  if (payload.password && payload.confirmPassword && payload.password !== payload.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (requireTerms && !payload.acceptTerms) {
    errors.acceptTerms = "Please accept the terms to continue.";
  }

  return errors;
}

export function AuthSignUpCard({ className, children, ...props }: AuthSignUpCardProps) {
  return (
    <section className={cn("mx-auto w-full max-w-md", className)} {...props}>
      <div className={CARD_CLASS}>{children}</div>
    </section>
  );
}

export function AuthSignUpHeader({
  className,
  title,
  description,
  align = "center",
  ...props
}: AuthSignUpHeaderProps) {
  return (
    <div
      className={cn(CARD_HEADER_CLASS, align === "center" ? "text-center" : "text-left", className)}
      {...props}
    >
      <h1 className="text-xl font-semibold text-balance">{title}</h1>
      {description ? (
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      ) : null}
    </div>
  );
}

export function AuthSignUpContent({ className, ...props }: AuthSignUpContentProps) {
  return <div className={cn(CARD_CONTENT_CLASS, className)} {...props} />;
}

export function AuthSignUpForm({
  className,
  defaultValues,
  pending,
  nameLabel = "Full name",
  namePlaceholder = "Ada Lovelace",
  emailLabel = "Email",
  emailPlaceholder = "you@company.com",
  passwordLabel = "Password",
  passwordPlaceholder = "Create a strong password",
  confirmPasswordLabel = "Confirm password",
  confirmPasswordPlaceholder = "Repeat your password",
  termsLabel = "I agree to the terms and privacy policy",
  submitLabel = "Create account",
  requireTerms = true,
  termsHref,
  validate,
  onSubmitRegistration,
  ...props
}: AuthSignUpFormProps) {
  const [isPendingInternal, setIsPendingInternal] = React.useState(false);
  const [errors, setErrors] = React.useState<AuthSignUpErrors>({});
  const isPending = pending ?? isPendingInternal;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload: AuthSignUpPayload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
      acceptTerms: Boolean(formData.get("acceptTerms")),
    };

    const defaultErrors = getDefaultErrors(payload, requireTerms);
    const customErrors = validate?.(payload) ?? {};
    const nextErrors: AuthSignUpErrors = {
      ...defaultErrors,
      ...customErrors,
    };

    const hasErrors = Object.values(nextErrors).some((value) => Boolean(value));

    if (hasErrors) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    if (!onSubmitRegistration) {
      return;
    }

    const result = onSubmitRegistration(payload);
    if (!isPromiseLike(result)) {
      return;
    }

    setIsPendingInternal(true);
    try {
      await result;
    } catch (submissionError) {
      setErrors({
        form: toErrorMessage(submissionError, "Unable to create account. Please try again."),
      });
    } finally {
      setIsPendingInternal(false);
    }
  };

  return (
    <form className={cn("grid gap-4", className)} onSubmit={handleSubmit} noValidate {...props}>
      <div className="grid gap-2">
        <label className={LABEL_CLASS} htmlFor="auth-sign-up-name">
          {nameLabel}
        </label>
        <input
          id="auth-sign-up-name"
          className={INPUT_CLASS}
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={defaultValues?.name}
          placeholder={namePlaceholder}
          disabled={isPending}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "auth-sign-up-name-error" : undefined}
          required
        />
        {errors.name ? (
          <p id="auth-sign-up-name-error" className="text-xs text-destructive">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className={LABEL_CLASS} htmlFor="auth-sign-up-email">
          {emailLabel}
        </label>
        <input
          id="auth-sign-up-email"
          className={INPUT_CLASS}
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={defaultValues?.email}
          placeholder={emailPlaceholder}
          disabled={isPending}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "auth-sign-up-email-error" : undefined}
          required
        />
        {errors.email ? (
          <p id="auth-sign-up-email-error" className="text-xs text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className={LABEL_CLASS} htmlFor="auth-sign-up-password">
          {passwordLabel}
        </label>
        <input
          id="auth-sign-up-password"
          className={INPUT_CLASS}
          name="password"
          type="password"
          autoComplete="new-password"
          defaultValue={defaultValues?.password}
          placeholder={passwordPlaceholder}
          disabled={isPending}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "auth-sign-up-password-error" : undefined}
          required
        />
        {errors.password ? (
          <p id="auth-sign-up-password-error" className="text-xs text-destructive">
            {errors.password}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className={LABEL_CLASS} htmlFor="auth-sign-up-confirm-password">
          {confirmPasswordLabel}
        </label>
        <input
          id="auth-sign-up-confirm-password"
          className={INPUT_CLASS}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          defaultValue={defaultValues?.confirmPassword}
          placeholder={confirmPasswordPlaceholder}
          disabled={isPending}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? "auth-sign-up-confirm-password-error" : undefined
          }
          required
        />
        {errors.confirmPassword ? (
          <p id="auth-sign-up-confirm-password-error" className="text-xs text-destructive">
            {errors.confirmPassword}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label
          className="flex items-start gap-2 text-sm text-muted-foreground"
          htmlFor="auth-sign-up-terms"
        >
          <input
            id="auth-sign-up-terms"
            className="mt-0.5 h-4 w-4 rounded border-input"
            name="acceptTerms"
            type="checkbox"
            defaultChecked={Boolean(defaultValues?.acceptTerms)}
            disabled={isPending}
            aria-invalid={Boolean(errors.acceptTerms)}
            aria-describedby={errors.acceptTerms ? "auth-sign-up-terms-error" : undefined}
          />
          <span>
            {termsHref ? (
              <a href={termsHref} className="underline underline-offset-4">
                {termsLabel}
              </a>
            ) : (
              termsLabel
            )}
          </span>
        </label>
        {errors.acceptTerms ? (
          <p id="auth-sign-up-terms-error" className="text-xs text-destructive">
            {errors.acceptTerms}
          </p>
        ) : null}
      </div>

      {errors.form ? <p className="text-sm text-destructive">{errors.form}</p> : null}

      <button type="submit" className={SOLID_BUTTON_CLASS} disabled={isPending}>
        {isPending ? "Creating account..." : submitLabel}
      </button>
    </form>
  );
}

export function AuthSignUpFooter({ className, ...props }: AuthSignUpFooterProps) {
  return <div className={cn("text-center text-sm text-muted-foreground", className)} {...props} />;
}
