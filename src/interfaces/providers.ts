export interface Providers {
  email: Provider;
  spotify: Provider;
}

export interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}
