const path = require('path');
const express = require('express');
const cors = require('cors');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
// const serverless = require("serverless-http");

const port = 3000;

// app
const app = express();

//webpack-dev-middleware
const config = require('./webpack.config.js')('production');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

app.use('/', express.static(path.join(__dirname, 'dist')));

//stuffs
app.use(cors());
app.use(compression());
app.use(helmet());

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view engine
app.set('views', './view/public');
app.set('view engine', 'pug');

//route
// const netlify = '/.netlify/functions/app';
// app.use(netlify, require('./controller/cloudflareController.js')(app));
require('./controller/cloudflareController.js')(app);

// module.exports = app;
// module.exports.handler = serverless(app);

app.listen(port, () => console.log(`Server is listening on port ${port}`));