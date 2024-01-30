const router = require('express').Router();
const CreditForm = require('../models/creditForm');
const authenticate = require('../middleware/authenticate');
const genform = require('../models/creditForm')

const { ObjectId } = require('mongoose').Types;

// create a new credit generation form
router.post("/credit-forms", authenticate, async (req,res) => {
    const user = req.rootUser; // Assuming you have a valid user object in req.rootUser
    const formDataWithUser = {
        ...req.body, // Assuming your form data is in the req.body
        user: user._id,
    };
    try{
       const newForm = new CreditForm(formDataWithUser);
       await newForm.save()
       res.send({
        success: true,
        message: "Form Submitted Successfully",
       });

    }catch(error){
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// get all credit generation forms
router.get("/get-credit-forms", async(req, res) => {
    try{
        const forms = await genform.find().sort({createdAt: -1});
        res.send({
         success: true,
         forms
        })
     }catch(error){
        res.send({
            success: false,
            message: error.message
        })
     }
});

// edit form
router.put("/edit-credit-forms/:id",authenticate, async(req,res) => {
    try{
        const { id } = req.params;
        const existingForm = await CreditForm.findById(req.params.id);
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        // update the form
        const updatedForm = await CreditForm.findByIdAndUpdate(id, req.body, {new: true});
        res.send({
            success: true,
            message: "Form Updated Successfully",
            updatedForm,
        });
    }catch(error){
        res.send({
            success: false,
            message: error.message
        });
    }
});

// delete the form
router.delete("/delete-credit-forms/:id", authenticate, async(req,res) =>{
    try{
        await CreditForm.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Form deleted successfully",
        });
    }catch(error){
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// get a specific credit generation form by ID
router.get("/credit-forms/:id", async(req,res) => {
    try{
       const form = await CreditForm.findById(req.params.id).populate("user");
       res.send({
        success: true,
        data: form,
       })
    }catch(error){
       res.send({
        success: false,
        message: error.message,
       });
    }
});

module.exports = router;

