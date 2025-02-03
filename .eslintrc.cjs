/**
 *  @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  plugins: ['perfectionist', 'unused-imports', '@typescript-eslint', 'prettier'],
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  /**
   * 0 ~ 'off'
   * 1 ~ 'warn'
   * 2 ~ 'error'
   */
  rules: {
    // Matikan arrow-body-style yang memaksa penghapusan block statement di arrow function
    'arrow-body-style': 0,
  
    // Matikan peringatan terkait constructed context values
    'react/jsx-no-constructed-context-values': 0,
  
    // Aturan lain yang mungkin terlalu strict
    'react/jsx-props-no-spreading': 0, // Izinkan spreading props
    'react/require-default-props': 0, // Tidak perlu default props di functional component
    '@typescript-eslint/no-unused-vars': 0, // Jangan beri peringatan variabel tidak digunakan
  },
  
};
