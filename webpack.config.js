const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const appDir = path.join(__dirname, 'src');
const assetsDir = path.join(__dirname, 'static');
const HTMLRender = require(path.join(appDir, 'render.js'));

module.exports = {
  entry: {
    bundle: path.join(appDir, 'index.js')
  },
  resolve: {
    modules: ['node_modules', appDir, assetsDir]
  },
  plugins: [
    new MiniCSSExtractPlugin({filename: '[name].css'})
  ].concat(HTMLRender),
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      }
    ]
  }
};
