const path = require('path');
const express = require('express');
const cors = require('cors');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const port = 3000;

// app
const app = express();

//webpack-dev-middleware
// const config = require('./webpack.config.js')('dev');
// const compiler = webpack(config);

// app.use(webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath
// }));

app.use('/', express.static(path.join(__dirname)));

//stuffs
app.use(cors());
app.use(compression());
app.use(helmet());

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view engine
// app.set('views', './view/public');
// app.set('view engine', 'pug');

//route
require('./controller/cloudflareController.js')(app);

app.listen(port, () => console.log(`Server is listening on port ${port}`));