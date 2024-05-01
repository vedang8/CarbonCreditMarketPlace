const router = require("express").Router();
const CreditForm = require("../models/creditForm");
const authenticate = require("../middleware/authenticate");
const genform = require("../models/creditForm");
const cloudinary = require("../db/cloudinaryConn");
const { ObjectId } = require("mongoose").Types;
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { uploadImageCloudinary } = require("../db/uploadClodinary");
const userdb = require("../models/user");
const creditdb = require("../models/credits");
const { serialize } = require("v8");
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const Notification = require("../models/notification");
// create a new credit generation form
router.post("/credit-forms", authenticate, async (req, res) => {
  const user = req.rootUser; // Assuming you have a valid user object in req.rootUser
  const formDataWithUser = {
    ...req.body, // Assuming your form data is in the req.body
    user: user._id,
  };
  user.rewardCredits += 50;
  await user.save();

  try {
    const newForm = new CreditForm(formDataWithUser);
    await newForm.save();

    // send notification to admin
    const admins = await userdb.find({ role: "admin" });
    admins.forEach(async (admin) => {
      const newNotification = new Notification({
        user: admin._id,
        message: `New Form added by ${user.fname}`,
        title: "Carbon Credits Generation Form",
        onClick: `/admin`,
        read: false,
      });
      await newNotification.save();
    });
    res.send({
      success: true,
      message: "Form Submitted Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all credit generation forms
router.get("/get-credit-forms", async (req, res) => {
  try {
    const forms = await genform
      .find()
      .populate("user", "fname")
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      forms,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// edit form
router.put("/edit-credit-forms/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    // update the form
    const updatedForm = await CreditForm.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.send({
      success: true,
      message: "Form Updated Successfully",
      updatedForm,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete the form
router.delete("/delete-credit-forms/:id", authenticate, async (req, res) => {
  try {
    await CreditForm.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get a specific credit generation form by ID
router.get("/get-credit-forms-user", authenticate, async (req, res) => {
  try {
    const user = req.rootUser;
    const userId = user._id;

    // Fetch forms associated with the specified user ID
    const forms = await genform.find({ user: userId }).sort({ createdAt: -1 });

    // Check if any forms were found
    if (!forms || forms.length === 0) {
      return res.send({
        success: false,
        message: "No credit forms found for the specified user ID.",
      });
    }
    res.send({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.error("Error in fetching credit forms: ", error);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get a specific credit generation form by ID
router.get("/get-credit-forms/:id", async (req, res) => {
  try {
    const formId = req.params.id;
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.send({
        success: false,
        message: "Invalid form ID format",
      });
    }

    // Find the form by ID
    const form = await CreditForm.findById(formId).populate("user", "fname");
    console.log("form", form);
    if (!form) {
      return res.send({
        success: false,
        message: "Form not found",
      });
    }

    res.send({
      success: true,
      data: form,
    });
  } catch (error) {
    console.error("Error in fetching credit form by ID: ", error);
    res.send({
      success: false,
      message: "Internal server error",
    });
  }
});

// get image from pc
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, `image-${Date.now()}.${file.originalname}`); // use the original filename
  },
});

// handle image upload to cloudinary
const upload = multer({ storage: storage });

router.post(
  "/upload-image-to-form",
  authenticate,
  upload.single("photo"),
  async (req, res) => {
    const upload = await cloudinary.uploader.upload(req.file.path);

    const creditId = req.body.creditId;

    try {
      const credits_form = await CreditForm.findById(creditId);
      credits_form.images.push({
        url: req.file.path,
      });
      await credits_form.save();

      res.send({
        success: true,
        message: "Image uploaded scuccessfully",
        data: upload.secure_url,
      });
    } catch (error) {
      res.send({
        success: true,
        message: error.message,
      });
    }
  }
);

// update form status
router.put(
  "/update-credits-forms-status/:id",
  authenticate,
  async (req, res) => {
    try {
      const { status } = req.body;
      const updatedForm = await CreditForm.findByIdAndUpdate(req.params.id, { status });
      
      // send notification to user
      const newNotification = new Notification({
        user: updatedForm.user,
        message: `Your Generation Form has been ${status}`,
        title: "Generation Status Updated",
        onClick: `/profile`,
        read: false,
      });
      await newNotification.save();
      res.send({
        success: true,
        message: "Form status updated Successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

// generate certificate
router.post("/generate-certificate/:id", authenticate, async (req, res) => {
  const user = req.rootUser;
  try {
    const creditForm = await genform.findById(req.params.id);
    console.log("cccrreeddiittsss", creditForm);
    // Generate certificate PDF
    const pdfDoc = new PDFDocument();
    const certificatesDirectory = './certificates';

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(certificatesDirectory)) {
        fs.mkdirSync(certificatesDirectory);
    }
    const filePath = `./certificates/${creditForm._id}.pdf`; // Path to save the PDF
    const writeStream = fs.createWriteStream(filePath); // Create write stream

    // Pipe generated PDF to write stream
    pdfDoc.pipe(writeStream);

    // Set background color
    pdfDoc.rect(0, 0, 612, 792).fill("#f0f0f0");

    // Set font and font size
    pdfDoc.font("Helvetica-Bold");

    // Adding content to the PDF
    pdfDoc.fontSize(24).fillColor("#000").text("Carbon Credit Certificate", { align: "center" });

    // Add separator line
    // pdfDoc
    //   .moveDown()
    //   .strokeColor("#000")
    //   .lineWidth(1)
    //   .moveTo(50, pdfDoc.y)
    //   .lineTo(550, pdfDoc.y)
    //   .stroke();
    
    // Reset font size for regular text
    pdfDoc.font('Helvetica');
    pdfDoc.fontSize(16);
    pdfDoc.moveDown();

    pdfDoc.text(`This certifies that ${creditForm.projectName}, a project initiated by ${creditForm.user.fname}, has successfully contributed to reducing carbon emissions in accordance with the principles of the Carbon Credit Marketplace.`);
    
    pdfDoc.moveDown();
    pdfDoc.fontSize(16).text(`Project Details:`);
    pdfDoc.moveDown();
    // Adding text content
    pdfDoc.fontSize(14).fillColor("#000").text(`Project Name: ${creditForm.projectName}`);
    pdfDoc.text(`Project Type: ${creditForm.projectType}`);
    pdfDoc.text(`Description: ${creditForm.description}`);
    pdfDoc.text(`Start Date: ${creditForm.startDate}`);
    pdfDoc.text(`End Date: ${creditForm.endDate}`);
    // Add more text content here
    pdfDoc.moveDown();
    pdfDoc.fontSize(16).text(`Carbon Reduction Metrics:`);
    pdfDoc.moveDown();
    // Add environmental impact details
    pdfDoc.fillColor("#000").fontSize(14).text(`Baseline Emission Amount: ${creditForm.baselineEmissionAmount} tons CO2`);
    pdfDoc.text(`Project Emission Amount: ${creditForm.projectEmissionAmount} tons CO2`);
    pdfDoc.text(`Reduction Achieved: ${creditForm.baselineEmissionAmount - creditForm.projectEmissionAmount} tons CO2`);
    
    pdfDoc.moveDown();
    pdfDoc.fontSize(16).text(`Environmental Impact:`);
    pdfDoc.moveDown();

    pdfDoc.fontSize(14).text(`Number of Trees Planted: ${creditForm.numOfTrees}`);
    pdfDoc.text(`Number of Solar Panels Installed: ${creditForm.numOfSolarPanels}`);
    pdfDoc.text(`Electricity Generated: ${creditForm.electricity} kWh`);
    
    pdfDoc.moveDown();
    pdfDoc.text(`This certificate acknowledges the positive environmental impact of the project, which includes the reduction of carbon emissions and the implementation of sustainable practices.`);
    pdfDoc.opacity(0.3).text('Confidential', 50, 50, { rotation: 45, opacity: 0.3 }); // Add a watermark text
    pdfDoc.moveDown();
    
    pdfDoc.text(`${user.fname}`);
    // Finalize PDF
    pdfDoc.end();

    // Once the PDF is written, respond with success message
    writeStream.on("finish", async () => {
      // Create a Nodemailer transporter
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'vedang2607@gmail.com', // Your Gmail email address
          pass: 'riiiwuklihrxljuw', // Your Gmail password
        },
      });

      // Send mail with attachment
      let info = await transporter.sendMail({
        from: 'vedang2607@gmail.com', // Your Gmail email address
        to: 'vedang2607@gmail.com', // User's email address
        subject: 'Your Carbon Credit Certificate',
        text: 'Please find your Carbon Credit Certificate attached.',
        attachments: [
          {
            filename: 'certificate.pdf',
            path: filePath,
          },
        ],
      });
      console.log('Email sent: ', info.response);
      res.send({
        success: true,
        message: "Certificate generated successfully and sent to user email",
      });
    });
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      message: "Internal Server error",
    });
  }
});

module.exports = router;
