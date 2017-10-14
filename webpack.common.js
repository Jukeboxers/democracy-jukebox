const path = require('path');

module.exports = {
  entry: [
    './src/components/Accounts/Login.jsx',
    './src/components/Accounts/Signup.jsx',
    './src/components/Bling/Banner.jsx',
    './src/components/Host/Dashboard.jsx',
    './src/components/Playlist/Player.jsx',
    './src/components/Playlist/PlaylistEntry.jsx',
    './src/components/Search/AddSongEntry.jsx',
    './src/components/Container.jsx',
    './src/components/Navbar.jsx',
    './src/components/App.jsx',
    './src/main.js'
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-decorators-legacy']
        }
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'svg-react-loader',
        query: {
          classIdPrefix: '[name]-[hash:8]__',

          propsMap: {
            fillRule: 'fill-rule'
          },
          xmlnsTest: /^xmlns.*$/
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  node: {
    fs: 'empty'
  }
};
