/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        backgroundColor: '#E8DDD0',
        cardBg: '#F0E6D8',
        buttonBg: '#CAA78933',

        titleTextColor: '#361A0D',
        subTitleTextColor: '#6C524A',
        inputFieldTextColor: '#83735A',


      },
      spacing: {
        container: 16
      },
      fontFamily: {
        didot: ['GFSDidot-Regular'], // 400 Reular

        outfit: ['Outfit-Regular'], // 400 Reular
        outfitMedium: ['Outfit-Medium'], // 500 Medium
        outfitSemi: ['Outfit-SemiBold'], // 600 SemiBold
        OutfitBold: ['Outfit-Bold'], // 700 Bold
        OutfitExtraBold: ['Outfit-ExtraBold'], // 800 Extra Bold

        poppins: ['Poppins-Regular'], // 400
        poppinsItalic: ['Poppins-Italic'], // 400
        poppinsMedium: ['Poppins-Medium'], // 500
        poppinsMediumItalic: ['Poppins-MediumItalic'], // 500
        poppinsSemi: ['Poppins-SemiBold'], // 600
        poppinsSemiItalic: ['Poppins-SemiBoldItalic'], // 600
        poppinsBold: ['Poppins-Bold'], // 700
        poppinsBoldItalic: ['Poppins-BoldItalic'], // 700
        poppinsExtraBold: ['Poppins-ExtraBold'], // 800
        poppinsExtraBoldItalic: ['Poppins-ExtraBoldItalic'], // 800

        primous: ['Primous-Regular'], // 400 regula
        primousItalic: ['Primous-Italic'], // 400 regular italic


      },
      fontSize: {
        btn20: '20px',

        title32: '32px',
        subtitle20: '20px',

        text26: '26px', // used in onboarding card title instead

        authTitle36: '36px',





      },

    },
  },
  plugins: [],
};
