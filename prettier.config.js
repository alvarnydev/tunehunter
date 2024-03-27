/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindAttributes: ['className'],
  tailwindFunctions: ['clsx', 'cl', 'tw'],
  printWidth: 100,
};

module.exports = config;
