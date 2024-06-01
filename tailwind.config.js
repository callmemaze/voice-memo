/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bgextralight: ["BricolageG-ExtraLight"],
        bglight: ["BricolageG-Light"],
        bgregular: ["BricolageG-Regular"],
        bgmedium: ["BricolageG-Medium"],
        bgsemibold: ["BricolageG-SemiBold"],
        bgbold: ["BricolageG-Bold"],
        bgextrabold: ["BricolageG-ExtraBold"],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
