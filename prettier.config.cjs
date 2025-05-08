module.exports = {
  printWidth: 130, // Max line length
  tabWidth: 4, // How many spaces a tab equals (important for alignment)
  useTabs: true, // **** Use actual tab characters for indentation ****
  semi: false, // **** No semicolons at the end of statements ****
  singleQuote: true, // Use single quotes instead of double quotes
  trailingComma: "es5", // Add trailing commas where valid in ES5 (objects, arrays, etc.) 'all' is also an option.
  bracketSpacing: true, // Print spaces between brackets in object literals -> { foo: bar }
  arrowParens: "avoid", // Omit parens when possible for single arrow function args -> x => x*x
  endOfLine: "lf", // Use Unix line endings (LF, \n)

  // Keep other sensible defaults or add more as needed:
  // jsxSingleQuote: false,  // Use double quotes in JSX
  // proseWrap: 'preserve', // How to wrap markdown text
  // htmlWhitespaceSensitivity: 'css', // How to handle whitespace in HTML
};
