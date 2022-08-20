/** Import node modules */
import express from 'express'
import cors from 'cors'
let app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());


import github from './routes/github.js';

// app.use((req, res, next) => {
//   console.log(req.originalUrl);
//   next();
// });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
})

app.use(github);

//400
app.use((req, res, next) => {
  res.status(400).send("400 : Page not found !");
});

// 500
app.use((err, req, res, next) => {
  res.status(500).send("500 : Interval server error !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Listening at port ${PORT}...`));