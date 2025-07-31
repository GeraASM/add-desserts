const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '')));


app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "./index.html"));
})

app.post ("/save-desserts", (req, res) => {
    const dta = req.body;
    console.log(dta);
})

app.listen(4440, () => {
    console.log("Server running at http://localhost:4440");
})