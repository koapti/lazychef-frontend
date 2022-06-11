const express = require('express')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const app = express()
const port = 3001

const liveReloadServer = livereload.createServer({port: 8082});
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

app.get('/ownerAddEmp', (req, res) => {
  // check AUTH
  res.render('ownerAddEmp')
})

app.get('/rejestration', (req, res) => {
  // check AUTH
  res.render('rejestration')
})

app.get('/ownerEditMenu', (req, res) => {
  // check AUTH
  res.render('ownerEditMenu')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})