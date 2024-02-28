// const { response } = require("express");

// const cloudinary=require("cloudinary").v2

// exports.uploadImageCloudinary=(file,folder,height,qulity)=>{
//     const options={folder}
//     if(height){
//         options.height=height;
//     }
//     if(qulity) {
//         options.qulity=qulity;
//     }

//     options.resource_type="auto";
//     try{
//     return cloudinary.uploader.upload(file.tempFilePath,options);
//     }catch(error){
//         console.log("error occure at uploadImageClodinar function: ",error.message)
//         throw error;
//     }
// }