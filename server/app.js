const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
require("./db/conn");
const port = 8009;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use(fileupload({
//     useTempFiles: true,
//     tempFileDir: "D:/Projects/CCMP/server/uploads",
// }));
const userRoute = require("./routes/userRoute");
const creditsRoute = require("./routes/creditsRoute");
const sellCreditsRoute = require("./routes/sellCreditsRoute");
const bidsRoute = require("./routes/bidsRoute");

app.use(userRoute);
app.use(creditsRoute);
app.use(sellCreditsRoute);
app.use(bidsRoute);

app.listen(port, ()=>{
    console.log(`server start at port no: ${port}`);
})