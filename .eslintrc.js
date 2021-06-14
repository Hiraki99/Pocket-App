module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react-native',
    "react-hooks",
    'import',
  ],
  rules:{
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    'global-require': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    semi: 0,
    'react/prefer-stateless-function': 0,
    'import/prefer-default-export': 0,
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-props-no-spreading': 0,
    "object-shorthand": 0,
    "react/forbid-prop-types": 0,
    "no-duplicate-imports": ["error", {"includeExports": true}],
    "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "parent", "sibling", "index"],
        "newlines-between": "always"
      }
    ]
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        root: ['./src'],
        alias: {
          "~": "./src"
        },
      },
    },
  }
};
