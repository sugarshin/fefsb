module.exports = {
  parser: 'sugarss',
  plugins: [
    require('autoprefixer')({ browsers: ['last 3 versions'] }),
    require('postcss-flexbugs-fixes'),
    require('postcss-partial-import')(),
    require('postcss-nested'),
    require('css-mqpacker')(),
  ],
}
