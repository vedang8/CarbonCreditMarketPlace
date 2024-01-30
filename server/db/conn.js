const mongoose = require("mongoose");

const db = "mongodb+srv://vedang:vedang123@cluster0.rxkvpjj.mongodb.net/ccmp?retryWrites=true&w=majority";
mongoose.connect(db,{
    useUnifiedTopology: true,
    useNewUrlParser: true 
}).then(()=> console.log("Database connected")).catch((err)=>{
    console.log(err);
})


