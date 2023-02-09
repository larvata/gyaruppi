// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const sharp = require('sharp');
const pkg = require('./package.json');
const PROVIDERS = require('./src/common/providers');

const isProduction = process.env.NODE_ENV === 'production';
const stylesHandler = MiniCssExtractPlugin.loader;

const pluginResizeAndCopyIcons = () => {
  const METADATA = [{
    name: 'app-icon-16',
    size: 16,
  }, {
    name: 'app-icon-48',
    size: 48,
  }, {
    name: 'app-icon-64',
    size: 64,
  }, {
    name: 'app-icon-128',
    size: 128,
  }];

  return METADATA.map((md) => ({
    from: 'src/live.png',
    to: `icons/${md.name}.png`,
    transform: (content) => sharp(content).resize(md.size).toBuffer(),
  }));
};

const getSiteAddonsEntrypoints = () => PROVIDERS.reduce((output, provider) => {
  const entry = `${provider.name}_inject`;
  output[`site_addons/${entry}`] = `./src/site_addons/${entry}.js`;
  return output;
}, {
  'site_addons/script_injector': './src/site_addons/script_injector.js',
});

const config = {
  entry: {
    background: './src/background.js',
    popup: './src/Popup.jsx',
    ...getSiteAddonsEntrypoints(),
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
  },

  devServer: {
    open: true,
    host: 'localhost',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['popup'],
      filename: 'popup.html',
      templateContent:
`<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Extension Popup</title>
        <link rel="stylesheet" href="public/styles/pure-min.css">
    </head>
    <body>
      <div id="root" />
    </body>
</html>`,
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/manifest.json',
          transform: (content) => {
            const manifest = JSON.parse(content.toString());
            manifest.version = pkg.version;

            // generate host_permissions, enternally_connectable, content_scripts
            PROVIDERS.forEach((provider) => {
              manifest.host_permissions.push(provider.host_permissions);
              manifest.externally_connectable.matches.push(provider.content_scripts);
              manifest.content_scripts[0].matches.push(provider.content_scripts);
              manifest.web_accessible_resources.push({
                resources: [`site_addons/${provider.name}_inject.js`],
                matches: [provider.content_scripts],
              });
            });

            return JSON.stringify(manifest, null, 2);
          },
        },
        {
          from: './src/_locales',
          to: '_locales',
        },
        {
          from: './src/public',
          to: 'public',
        },
        ...pluginResizeAndCopyIcons(),
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },

  devtool: 'cheap-module-source-map',
};

module.exports = () => {
  config.mode = isProduction ? 'production' : 'development';
  return config;
};
