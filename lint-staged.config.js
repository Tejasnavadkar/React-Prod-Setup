// here we write linting scripts so it checks errors and pass it to pre-commit hooks (husky) so it checks before commit

const config = {
    '*.{js,ts,jsx,tsx}': ['npm run lint:eslint', 'npm run formate:check'], // check eslint and prettier errors
    '*.css': ['npm run lint:stylelint', 'npm run formate:check'], // check stylelint and prettier errors
    '*.{json,html,md,yml,yaml}': ['npm run formate:check'] // only check prettier errors
}

export default config
