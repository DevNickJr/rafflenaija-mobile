// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    'plugin:prettier/recommended', // Enables Prettier plugin
    'prettier', // Turns off conflicting rules between ESLint and Prettier
  ],
  ignorePatterns: ['/dist/*'],
};
