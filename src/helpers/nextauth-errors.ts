export const NextAuthErrors = [
  "OAuthSignin", // Error in constructing an authorization URL (1, 2, 3)
  "OAuthCallback", // Error in handling the response (1, 2, 3) from an OAuth provider.
  "OAuthCreateAccount", // Could not create OAuth provider user in the database.
  "EmailCreateAccount", // Could not create email provider user in the database.
  "Callback", // Error in the OAuth callback handler route
  "OAuthAccountNotLinked", // If the email on the account is already linked, but not with this OAuth account
  "EmailSignin", // Sending the e-mail with the verification token failed
  "CredentialsSignin", // The authorize callback returned null in the Credentials provider. We don't recommend providing information about which part of the credentials were wrong, as it might be abused by malicious hackers.
  "SessionRequired", // The content of this page requires you to be signed in at all times. See useSession for configuration.
  "Default", // Catch all, will apply, if none of the above matched
] as const;

export type NextAuthError = (typeof NextAuthErrors)[number];
export const isNextAuthError = (error: string): error is NextAuthError =>
  NextAuthErrors.includes(error as NextAuthError);
