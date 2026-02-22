import {
  Controls,
  Description,
  Markdown,
  Primary,
  Source,
  Stories as StoriesBlock,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks";
import * as React from "react";
import {
  AuthSignUpCard,
  AuthSignUpContent,
  AuthSignUpFooter,
  AuthSignUpForm,
  AuthSignUpHeader,
} from "../auth-sign-up";

const docsOverview = [
  "## Overview",
  "",
  "`AuthSignUp` is intentionally API-agnostic and callback-driven.",
  "",
  "- Built-in required validation (name/email/password/confirm/terms)",
  "- Optional custom `validate(payload)`",
  "- Async-safe `onSubmitRegistration(payload)`",
  "- Error messages appear next to related fields",
].join("\n");

const usageCode = [
  "import {",
  "  AuthSignUpCard,",
  "  AuthSignUpHeader,",
  "  AuthSignUpContent,",
  "  AuthSignUpForm,",
  "  AuthSignUpFooter,",
  '} from "@curious-ui/blocks";',
  "",
  "export function RegisterView() {",
  "  return (",
  "    <AuthSignUpCard>",
  '      <AuthSignUpHeader title="Create your account" description="Start your free workspace." />',
  '      <AuthSignUpContent className="grid gap-6">',
  "        <AuthSignUpForm",
  "          onSubmitRegistration={async (payload) => {",
  "            await fetch('/api/register', {",
  "              method: 'POST',",
  "              headers: { 'content-type': 'application/json' },",
  "              body: JSON.stringify(payload),",
  "            });",
  "          }}",
  "        />",
  "        <AuthSignUpFooter>",
  '          Already registered? <a href="/sign-in" className="underline">Sign in</a>',
  "        </AuthSignUpFooter>",
  "      </AuthSignUpContent>",
  "    </AuthSignUpCard>",
  "  );",
  "}",
].join("\n");

export default {
  title: "Blocks/Auth Sign Up",
  component: AuthSignUpCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Markdown>{docsOverview}</Markdown>
          <Markdown>{"## API Usage"}</Markdown>
          <Source code={usageCode} language="tsx" />
          <StoriesBlock />
        </>
      ),
    },
  },
};

export const Default = {
  render: () => (
    <div className="mx-auto w-full max-w-md">
      <AuthSignUpCard>
        <AuthSignUpHeader
          title="Create account"
          description="Use work email and strong password to start building."
        />
        <AuthSignUpContent className="grid gap-6">
          <AuthSignUpForm />
          <AuthSignUpFooter>
            Already have an account?{" "}
            <a href="/sign-in" className="underline underline-offset-4 hover:text-foreground">
              Sign in
            </a>
          </AuthSignUpFooter>
        </AuthSignUpContent>
      </AuthSignUpCard>
    </div>
  ),
};

export const CustomValidation = {
  render: () => {
    const [message, setMessage] = React.useState("");

    return (
      <div className="mx-auto w-full max-w-md space-y-4">
        <AuthSignUpCard>
          <AuthSignUpHeader
            title="Create team account"
            description="Company domain and policy checks are enforced before submit."
            align="left"
          />
          <AuthSignUpContent>
            <AuthSignUpForm
              submitLabel="Create workspace"
              validate={(payload) => {
                if (!payload.email.endsWith("@company.com")) {
                  return { email: "Use your @company.com email." };
                }

                if (payload.password.length < 10) {
                  return { password: "Password must be at least 10 characters." };
                }

                return {};
              }}
              onSubmitRegistration={async (payload) => {
                await new Promise((resolve) => {
                  window.setTimeout(resolve, 400);
                });
                setMessage(`Created account for ${payload.email}`);
              }}
            />
          </AuthSignUpContent>
        </AuthSignUpCard>

        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </div>
    );
  },
};
