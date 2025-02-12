import flowbite from "flowbite-react/tailwind";
import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",  "node_modules/flowbite/**/*.js", flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [ flowbitePlugin, flowbite.plugin()]
};
