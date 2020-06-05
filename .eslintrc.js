module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      tsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'prettier', 'react-hooks', 'jsx-a11y'],
  extends: [
    // Airbnb style guide
    'airbnb',
    'airbnb/hooks',
    // TypeScript ESLint recommanded style
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:react/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/react-in-jsx-scope': 'off', // nextjs projects only
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true, packageDir: './' },
    ],
    'react/jsx-props-no-spreading': ['off'],
    'import/prefer-default-export': 'off',
  },
  globals: {
    React: 'writable', // nextjs projects only
  },
};
