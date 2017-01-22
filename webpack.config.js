const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkg = require('./package.json')

const PORT = process.env.PORT || 8080
const prod = process.env.NODE_ENV === 'production'

const entry = [
  'whatwg-fetch',
  'babel-polyfill',
  './src/index.js',
]

const htmlWebpackPluginConfig = prod ? {
  title: `${pkg.name} | ${pkg.description}`,
  minify: { collapseWhitespace: true },
} : undefined

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new HtmlWebpackPlugin(htmlWebpackPluginConfig),
]

if (prod) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, screw_ie8: true } }),
    new ExtractTextPlugin({ filename: 'assets/app.[hash].css', disable: false, allChunks: true })
  )
} else {
  entry.unshift(
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch'
  )
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

const cssLoaderOptions = {
  modules: true,
  importLoaders: 1,
  localIdentName: prod ? '[hash:base64:32]' : '[path][name]__[local]___[hash:base64:8]',
  minimize: prod,
}

const cssRule = {}
if (!prod) {
  cssRule.use = [
    'style-loader',
    { loader: 'css-loader', options: cssLoaderOptions },
    'postcss-loader',
  ]
} else {
  cssRule.loader = ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: [
      `css-loader?${JSON.stringify(cssLoaderOptions)}`,
      'postcss-loader',
    ]
  })
}

module.exports = {
  plugins,
  entry,
  cache: true,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: `assets/app${prod ? '.[hash]' : ''}.js`,
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'eslint-loader', options: { configFile: '.eslintrc' } }
        ],
        exclude: /node_modules/,
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      Object.assign(
        { test: /\.css$/ },
        cssRule
      ),
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 102400,
              mimetype: 'application/font-woff',
            },
          },
        ],
      },
      {
        test: /\.(otf|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          { loader: 'url-loader', options: { limit: 102400 } },
          'file-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 102400,
              hash: 'sha512',
              digest: 'hex',
              name: '[name]__[hash].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              bypassOnDebug: true,
              optimizationLevel: 7,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: './build-dev',
    hot: true,
    publicPath: '/',
    host: '0.0.0.0',
    port: parseInt(PORT, 10),
  },
}
