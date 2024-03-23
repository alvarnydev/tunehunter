/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// @ts-check
const { i18n } = require("./next-i18next.config.js");
import("./src/env.js");
import { withAxiom } from "next-axiom";

/** @type {import("next").NextConfig} */
const NextConfig = {
  reactStrictMode: true,
  i18n,
};

module.exports = withAxiom(NextConfig);
