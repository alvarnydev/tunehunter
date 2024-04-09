/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import config from "./next-i18next.config.mjs";
import { withAxiom } from "next-axiom";

// @ts-check
import("./src/env.js");

/** @type {import("next").NextConfig} */
const NextConfig = {
  reactStrictMode: true,
  i18n: config.i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/image/**",
      },
    ],
  },
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default withAxiom(NextConfig);
