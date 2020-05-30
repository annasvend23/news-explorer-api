module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      "no-underscore-dangle": ["error", { "allow": ["_id"] }],
      "no-console": ["error", { "allow": ["warn", "error"] }],
      "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    }
};
