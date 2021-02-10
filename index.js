const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
mongoose.connect('mongodb://user:1q2w3e4r5t@test-shard-00-00.j35co.mongodb.net:27017,test-shard-00-01.j35co.mongodb.net:27017,test-shard-00-02.j35co.mongodb.net:27017/Test?ssl=true&replicaSet=atlas-3y14yz-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err))

app.get('/', (req, res) => {res.send('Hello World')})
app.listen(port, () => {console.log(`Exmple app listening on port ${port}!`)})

