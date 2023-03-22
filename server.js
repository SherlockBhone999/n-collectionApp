
const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')
require('dotenv').config()

const router = require('./api/router')


mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log('connected to mongodb'))

//mongodb project pw
//n7DkIrPqvjfMFKeV

app.use(cors())
app.use(express.json())
app.use(router)

app.listen( 3000, ()=>{
  console.log('server on 3000')
})

