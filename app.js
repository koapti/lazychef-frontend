const express = require('express')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const app = express()
const port = 3000

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/cook");
  }, 100);
});

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(connectLiveReload());

//app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  if(true) {
    // redirect to waitress/cook/owner if authorized
    res.render('index')
  }else {
    // redirect to login page
    res.redirect('/login')
  }
  
})

app.get('/waitress', (req, res) => {
  // check AUTH
  res.render('waitress')
})

app.get('/cook', (req, res) => {
  // check AUTH
  res.render('cook')
})

app.get('/owner', (req, res) => {
  // check AUTH
  res.render('owner')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})