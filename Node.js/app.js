let express = require("express")
let app = express()
let router = require("./router/router")

app.use(router)

app.listen(8000,function () {
  console.log("Server is running")
})