const cloudinary = require('cloudinary').v2;

// configuration
cloudinary.config({ 
    cloud_name: 'drtgq0any', 
    api_key: '427833225974426', 
    api_secret: 'yHl26sTuJtNycg7pxhzVoypRDKk' ,
    timeout: 60000, 
});

module.exports = cloudinary;