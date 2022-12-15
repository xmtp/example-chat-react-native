module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      // Prevents unnecessary babel transform BigInt to number for Hermes.
      {unstable_transformProfile: 'hermes-stable'},
    ],
  ],
};
