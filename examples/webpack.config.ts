import * as path from 'path';

type Env = {
  mode?: 'development' | 'production' | 'none';
};
function makeConfig(env: Env = {}) {
  return {
    mode: env.mode,

    entry: {
      '01-simple': './examples/js/01-simple.ts',
      '02-no-initialize': './examples/js/02-no-initialize',
      '03-react': './examples/js/03-react',
    },

    output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/dist/',
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: require.resolve('ts-loader'),
          options: {
            configFile: path.resolve(__dirname, './tsconfig.json'),
          },
        },
      ],
    },
  };
}

export default makeConfig;
