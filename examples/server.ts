import express from 'express';
import webpack from 'webpack';
import makeConfig from './webpack.config';

const app = express();
const port = 4000;
const webpackConfig = makeConfig({
  mode: 'development',
});

const compiler = webpack(webpackConfig);
app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  })
);

// Using ejs as the template engine https://www.npmjs.com/package/ejs
app.set('view engine', 'ejs');

// Add the templates dir
app.set('views', './examples/pages');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/pages/:page', (req, res) => {
  res.render(req.params.page);
});

// Fire up the server
app.listen({ port }, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
