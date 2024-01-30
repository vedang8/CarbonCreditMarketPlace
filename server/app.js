const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("./db/conn");
const port = 8009;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const userRoute = require("./routes/userRoute");
const creditsRoute = require("./routes/creditsRoute");

app.use(userRoute);
app.use(creditsRoute);

app.listen(port, ()=>{
    console.log(`server start at port no: ${port}`);
})