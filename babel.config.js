module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
      plugins: [
      [
        'module-resolver',
        {
          root: ['./'], // Your project's root directory
          alias: {
            '@components': './src/components',
            '@constants': './src/constants',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};