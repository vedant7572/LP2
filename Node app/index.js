const express=require('express')
const app=express()

app.use(express.static('public'))

app.listen(4000,()=>{
    console.log("Server started on port 4000")
})

// npm init
// npm install express --save
// localhots:4000