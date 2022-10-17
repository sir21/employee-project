const esModules = ['axios'].join('|')

module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    ["babel-plugin-transform-require-ignore",
      {
        "extensions": [".less"]
      }],
  ],
  transformIgnorePatterns: [`node_modules/(?!(${esModules}))`]
}