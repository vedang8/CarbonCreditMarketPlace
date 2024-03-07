const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
require("./db/conn");
const port = 8009;

// Creating a write stream for logging
const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });

app.use(express.json());
app.use(cookieParser());
app.use(cors());
// Using morgan middleware to log incoming requests
app.use(morgan('combined', { stream: accessLogStream }));

// app.use(fileupload({
//     useTempFiles: true,
//     tempFileDir: "D:/Projects/CCMP/server/uploads",
// }));
const userRoute = require("./routes/userRoute");
const creditsFormRoute = require("./routes/creditsFormRoute");
const creditsRoute = require("./routes/creditsRoute");
const sellCreditsRoute = require("./routes/sellCreditsRoute");
const bidsRoute = require("./routes/bidsRoute");
const notificationRoute = require("./routes/notificationRoute");

app.use(userRoute);
app.use(creditsFormRoute);
app.use(creditsRoute);
app.use(sellCreditsRoute);
app.use(bidsRoute);
app.use(notificationRoute);

app.listen(port, ()=>{
    console.log(`server start at port no: ${port}`);
})