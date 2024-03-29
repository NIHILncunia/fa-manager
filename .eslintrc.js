module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es2022: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: [ 'import', ],
  rules: {
    // 일반 규칙
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'no-unexpected-multiline': 'off',
    'no-use-before-define': 'off',
    'spaced-comment': 'off',
    'no-param-reassign': 'off',
    'eol-last': [ 'warn', 'always', ],
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'array-callback-return': 'off',
    'consistent-return': 'off',
    'no-nested-ternary': 'off',
    quotes: [ 'warn', 'single', { allowTemplateLiterals: true, }, ],
    semi: 'off',
    'no-extra-semi': 'off',
    'array-bracket-spacing': [
      'warn',
      'always',
      {
        arraysInArrays: true,
        singleValue: true,
        objectsInArrays: true,
      },
    ],
    'object-curly-spacing': [ 'warn', 'always', ],
    'no-shadow': 'off',
    indent: [ 'warn', 2, {
      SwitchCase: 1,
      FunctionExpression: {
        parameters: 1,
      },
      ignoredNodes: [
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
        'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
      ],
    }, ],
    'comma-dangle': [ 'warn', {
      arrays: 'always',
      functions: 'never',
      objects: 'always',
      imports: 'never',
      exports: 'never',
    }, ],
    'jsx-quotes': [ 'error', 'prefer-single', ],
    'linebreak-style': 'off',
    'prefer-const': 'off',
    'max-len': 'off',
    'no-else-return': 'off',
    'no-lonely-if': 'off',
    'global-require': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'no-useless-return': 'off',
    'lines-between-class-members': 'off',
    'arrow-body-style': 'off',
    'no-tabs': [ 'warn', { allowIndentationTabs: true, }, ],

    // 임포트 규칙
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/no-dynamic-require': 'off',
    'import/prefer-default-export': 'off',
  },
};
