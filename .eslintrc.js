// https://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parserOptions: {
	  parser: 'babel-eslint'
	},
	env: {
	  browser: true,
	},
	// https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
	// consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
	extends: ['plugin:vue/essential', 'airbnb-base'],
	// required to lint *.vue files
	plugins: [
	  'vue'
	],
	// check if imports actually resolve
	settings: {
	  'import/resolver': {
		webpack: {
		  config: 'build/webpack.base.conf.js'
		}
	  }
	},
	// add your custom rules here
	rules: {
	  // don't require .vue extension when importing
	  'import/extensions': ['error', 'always', {
		js: 'never',
		vue: 'never'
	  }],
	  // disallow reassignment of function parameters
	  // disallow parameter object manipulation except for specific exclusions
	  'no-param-reassign': ['error', {
		props: true,
		ignorePropertyModificationsFor: [
		  'state', // for vuex state
		  'acc', // for reduce accumulators
		  'e' // for e.returnvalue
		]
	  }],
	  // allow optionalDependencies
	  'import/no-extraneous-dependencies': ['error', {
		optionalDependencies: ['test/unit/index.js']
	  }],
	  "no-tabs": 0,
	  "quotes": 0,
	  "indent": ["error",
		"tab",
		{ "ignoreComments": true }
	  ],
	  "radix": ["error", "as-needed"],
	  // allow debugger during development
	  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	  'max-len': ['error', 100, 1, {
		  ignoreUrls: true,
		  ignoreComments: false,
		  ignoreRegExpLiterals: true,
		  ignoreStrings: true,
		  ignoreTemplateLiterals: true,
	  }],
	  'object-curly-newline': ['error', {
		  ObjectExpression: { minProperties: 5, multiline: true, consistent: true },
		  ObjectPattern: { minProperties: 5, multiline: true, consistent: true },
		  ImportDeclaration: { minProperties: 5, multiline: true, consistent: true },
		  ExportDeclaration: { minProperties: 5, multiline: true, consistent: true },
	  }],
	  'comma-dangle': ['error', {
		  arrays: 'always-multiline',
		  objects: 'always-multiline',
		  imports: 'always-multiline',
		  exports: 'always-multiline',
		  functions: 'never',
	  }],
	}
  }
