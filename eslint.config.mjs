import globals from "globals";
import stylisticJs from '@stylistic/eslint-plugin-js'
import js from '@eslint/js'

export default [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "module",
            globals: {
                ...globals.node,
            },
            ecmaVersion: "latest",
        },
        plugins: {
            '@stylistic/js': stylisticJs
        },
        rules: {
            '@stylistic/js/indent': [
                'warn',
                4
            ],
            '@stylistic/js/linebreak-style': [
                'warn',
                'unix'
            ],
            '@stylistic/js/quotes': [
                'warn',
                'double'
            ],
            '@stylistic/js/semi': [
                'never'
            ],
            'eqeqeq': 'error',
            'no-trailing-spaces': 'error',
            'arrow-spacing': [
                'error', {'before': true, 'after': true},
            ],
            'no-console': 'off',
        },
    },
    {
        ignores: ["dist/**", "build/**"],
    },
]
