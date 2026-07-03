export default {
    '**/*.php': ['vendor/bin/duster fix'],
    '**/*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
};
