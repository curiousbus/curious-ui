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
  AuthAppleButton,
  AuthEmailPasswordForm,
  AuthFacebookButton,
  AuthFooter,
  AuthGoogleButton,
  AuthMagicLinkForm,
  AuthProviderGroup,
  AuthSeparator,
  AuthSignInCard,
  AuthSignInContent,
  AuthSignInHeader,
  AuthXButton,
} from "../auth-sign-in";

const overviewDocs = [
  "## Overview",
  "",
  "This block is intentionally **composable + transport-agnostic**:",
  "",
  "- UI components only collect input and fire callbacks.",
  "- You can include/exclude any login method (social, magic link, password) without patching internals.",
  "- Better Auth integration stays in your app layer.",
].join("\n");

const compositionExampleCode = [
  "import {",
  "  AuthSignInCard,",
  "  AuthSignInHeader,",
  "  AuthSignInContent,",
  "  AuthProviderGroup,",
  "  AuthGoogleButton,",
  "  AuthAppleButton,",
  "  AuthSeparator,",
  "  AuthEmailPasswordForm,",
  "  AuthFooter,",
  '} from "@ftb/blocks";',
  "",
  "export function SignIn() {",
  "  return (",
  "    <AuthSignInCard>",
  "      <AuthSignInHeader",
  '        title="Welcome back"',
  '        description="Use social sign-in or your email/password."',
  "      />",
  '      <AuthSignInContent className="grid gap-6">',
  "        <AuthProviderGroup>",
  "          <AuthGoogleButton onProviderSignIn={() => {}} />",
  "          <AuthAppleButton onProviderSignIn={() => {}} />",
  "        </AuthProviderGroup>",
  "",
  "        <AuthSeparator />",
  "",
  "        <AuthEmailPasswordForm",
  "          onSubmitCredentials={({ email, password }) => {",
  "            // Your own auth service call",
  "          }}",
  "        />",
  "",
  "        <AuthFooter>",
  '          New here? <a className="underline underline-offset-4" href="/sign-up">Create account</a>',
  "        </AuthFooter>",
  "      </AuthSignInContent>",
  "    </AuthSignInCard>",
  "  );",
  "}",
].join("\n");

const betterAuthClientCode = [
  'import { createAuthClient } from "better-auth/react";',
  "",
  "const authClient = createAuthClient();",
  "",
  "<AuthGoogleButton",
  "  onProviderSignIn={() =>",
  "    authClient.signIn.social({",
  '      provider: "google",',
  '      callbackURL: "/dashboard",',
  "    })",
  "  }",
  "/>;",
  "",
  "<AuthXButton",
  "  onProviderSignIn={() =>",
  "    authClient.signIn.social({",
  '      provider: "twitter", // X uses twitter provider id in Better Auth',
  '      callbackURL: "/dashboard",',
  "    })",
  "  }",
  "/>;",
  "",
  "<AuthEmailPasswordForm",
  "  onSubmitCredentials={({ email, password }) =>",
  "    authClient.signIn.email({ email, password })",
  "  }",
  "/>;",
  "",
  "<AuthMagicLinkForm",
  "  onSubmitMagicLink={({ email }) =>",
  "    authClient.signIn.magicLink({",
  "      email,",
  '      callbackURL: "/dashboard",',
  "    })",
  "  }",
  "/>;",
].join("\n");

const betterAuthServerCode = [
  'import { betterAuth } from "better-auth";',
  'import { magicLink } from "better-auth/plugins";',
  "",
  "export const auth = betterAuth({",
  "  emailAndPassword: {",
  "    enabled: true,",
  "  },",
  "  socialProviders: {",
  "    google: {",
  "      clientId: process.env.GOOGLE_CLIENT_ID,",
  "      clientSecret: process.env.GOOGLE_CLIENT_SECRET,",
  "    },",
  "    apple: {",
  "      clientId: process.env.APPLE_CLIENT_ID,",
  "      clientSecret: process.env.APPLE_CLIENT_SECRET,",
  "    },",
  "    twitter: {",
  "      clientId: process.env.TWITTER_CLIENT_ID,",
  "      clientSecret: process.env.TWITTER_CLIENT_SECRET,",
  "    },",
  "    facebook: {",
  "      clientId: process.env.FACEBOOK_CLIENT_ID,",
  "      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,",
  "    },",
  "  },",
  "  plugins: [",
  "    magicLink({",
  "      sendMagicLink: async ({ email, url }) => {",
  "        // send email with magic link url",
  "      },",
  "    }),",
  "  ],",
  "});",
].join("\n");

export default {
  title: "Blocks/Auth Sign In",
  component: AuthSignInCard,
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
          <Markdown>{overviewDocs}</Markdown>
          <Markdown>{"## Composition Example"}</Markdown>
          <Source code={compositionExampleCode} language="tsx" />
          <Markdown>{"## Better Auth Client Integration"}</Markdown>
          <Source code={betterAuthClientCode} language="tsx" />
          <Markdown>{"## Better Auth Server Setup (example)"}</Markdown>
          <Source code={betterAuthServerCode} language="ts" />
          <StoriesBlock />
        </>
      ),
    },
  },
};

export const FullyComposed = {
  render: () => {
    const [mode, setMode] = React.useState("password");

    return (
      <div className="mx-auto w-full max-w-md">
        <AuthSignInCard>
          <AuthSignInHeader
            title="Welcome back"
            description="Sign in with social providers, magic link, or your password."
          />
          <AuthSignInContent className="grid gap-6">
            <AuthProviderGroup>
              <AuthGoogleButton />
              <AuthAppleButton />
              <AuthXButton />
              <AuthFacebookButton />
            </AuthProviderGroup>

            <AuthSeparator />

            <div className="grid gap-3">
              <div className="inline-flex rounded-md border bg-muted/30 p-1">
                <button
                  type="button"
                  className={`rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    mode === "password"
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMode("password")}
                >
                  Email + Password
                </button>
                <button
                  type="button"
                  className={`rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    mode === "magic"
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMode("magic")}
                >
                  Magic Link
                </button>
              </div>

              {mode === "password" ? (
                <AuthEmailPasswordForm forgotPasswordHref="/forgot-password" />
              ) : (
                <AuthMagicLinkForm />
              )}
            </div>

            <AuthFooter>
              No account yet?{" "}
              <a href="/sign-up" className="underline underline-offset-4 hover:text-foreground">
                Create one
              </a>
            </AuthFooter>
          </AuthSignInContent>
        </AuthSignInCard>
      </div>
    );
  },
};

export const SocialOnly = {
  render: () => {
    return (
      <div className="mx-auto w-full max-w-md">
        <AuthSignInCard>
          <AuthSignInHeader
            title="Continue with your provider"
            description="Choose only the providers your product supports."
          />
          <AuthSignInContent className="grid gap-6">
            <AuthProviderGroup>
              <AuthGoogleButton />
              <AuthXButton />
            </AuthProviderGroup>
          </AuthSignInContent>
        </AuthSignInCard>
      </div>
    );
  },
};

export const EmailPasswordOnly = {
  render: () => {
    return (
      <div className="mx-auto w-full max-w-md">
        <AuthSignInCard>
          <AuthSignInHeader
            title="Sign in"
            description="Use your email and password."
            align="left"
          />
          <AuthSignInContent>
            <AuthEmailPasswordForm forgotPasswordHref="/forgot-password" />
          </AuthSignInContent>
        </AuthSignInCard>
      </div>
    );
  },
};

export const MagicLinkOnly = {
  render: () => {
    return (
      <div className="mx-auto w-full max-w-md">
        <AuthSignInCard>
          <AuthSignInHeader
            title="Passwordless sign in"
            description="Receive a secure one-time sign-in link in your inbox."
          />
          <AuthSignInContent>
            <AuthMagicLinkForm />
          </AuthSignInContent>
        </AuthSignInCard>
      </div>
    );
  },
};
