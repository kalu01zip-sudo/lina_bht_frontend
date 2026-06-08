// module.exports = function (api) {
//   api.cache(true);

//   return {
//     presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
//     plugins: ['react-native-worklets-core/plugin', 'react-native-reanimated/plugin'],
//   };
// };

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      // ❌ REMOVE these lines:
      // 'react-native-worklets-core/plugin',
      // 'react-native-reanimated/plugin',

      // ✅ If you need reanimated for other features (animations, gestures),
      // you can keep it. Remove only worklets-core:
      'react-native-reanimated/plugin', // Keep this if you use reanimated elsewhere
    ],
  };
};
