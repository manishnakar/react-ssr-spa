const path = require('path');
const webpack = require('webpack');

const karmaAuto = process.env.KARMA_AUTOWATCH;
const travis = process.env.TRAVIS_CI;
const singleRun = karmaAuto !== 'on';
const autoWatch = karmaAuto === 'on';

// TODO: http://nicolasgallagher.com/how-to-test-react-components-karma-webpack/
module.exports = function karmaConfIntegration(config) {
  const conf = {
    browsers: travis ? ['Chrome_travis_ci'] : ['Chrome'],
    // karma only needs to know about the test bundle
    files: [path.join(__dirname, '../../test/client/integration/**/*')],
    frameworks: ['mocha'],
    plugins: [
      // 'karma-chai',
      'karma-mocha',
      'karma-chrome-launcher',
      // 'karma-sourcemap-loader',
      'karma-webpack'
    ],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {},
    reporters: ['dots'],
    singleRun,
    autoWatch,
    // webpack config object
    webpack: {
      devtool: 'sourcemap',
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('development'),
            RUNTIME_ENV: JSON.stringify('browser')
          }
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
      ],
      module: {
        rules: [
          {
            test: /\.js?$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['react'],
                    [
                      'env',
                      {
                        targets: {
                          browsers: ['last 2 versions']
                        }
                      }
                    ]
                  ],
                  plugins: [
                    'syntax-dynamic-import',
                    'transform-react-jsx-source'
                  ]
                }
              }
            ],
            exclude: /node_modules/
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  };

  conf.preprocessors[
    path.join(__dirname, '../../test/client/integration/**/*')
  ] = [
    'webpack'
    // 'sourcemap'
  ];
  config.set(conf);
};
