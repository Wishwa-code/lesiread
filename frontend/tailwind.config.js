module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        boxShadow: {
          glow: '0 0 12px rgba(0, 123, 255, 0.5)', // Blue glow (adjust color as needed)
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
    
  };
  