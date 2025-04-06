const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/app/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: true,
      additionalEntryPoints:
        process.env['NODE_ENV'] === 'production'
          ? [
              {
                entryName: 'cli',
                entryPath: './src/cli/main.ts',
              },
            ]
          : [],
    }),
  ],
};
