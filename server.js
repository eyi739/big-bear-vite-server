const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"]
}

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/bigBearVite')
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch(err => {
        console.log("THERE WAS AN ERROR");
        console.log(err)
    });

app.use(cors(corsOptions));

app.get("/api", (req,res) => {
    res.json({fruits: ["apple", "orange", "banana", "green grapes", "guavas" ]});
})

app.get('/', (req, res) => {
    res.send("HI")
})

app.listen(8080, () => {
    console.log("Server started on port 8080");
})