const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      additionalEntryPoints:
        process.env['NODE_ENV'] === 'production'
          ? [
              {
                entryName: 'cli',
                entryPath: './src/cli/main.ts',
              },
            ]
          : [],
      assets: [],
      compiler: 'tsc',
      generatePackageJson: true,
      main: './src/app/main.ts',
      optimization: false,
      outputHashing: 'none',
      sourceMap: true,
      target: 'node',
      tsConfig: './tsconfig.app.json',
    }),
  ],
};
