// HTML ROUTES

const router = require("express").Router();
const { Outfits, User } = require("../models");
const withAuth = require("../utils/auth"); 
const fileUpload = require('express-fileupload');

router.use(fileUpload({
    useTempFiles : false
}));

// DISPLAY ALL OUTFITS ON HOMEPAGE

router.get("/", async (req, res) => {

    // Get all outfits and join with User Data
    try {
        const outfitsData = await Outfits.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
            ],
        });

        // serialises outfits data for handlebars template
        const outfits = outfitsData.map((outfit) => outfit.get({ plain: true }));

        // passes data into homepage handlebars template
        res.render('homepage', {
            outfits,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// ONE OUTFIT

router.get("/outfits/:id", async (req, res) => {

    // Get one outfit and join with User Data
    try {
        const outfitsData = await Outfits.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
            ],
        });

        // serialises data for one outfit into handlebars template
        const outfits = outfitsData.get({ plain: true });

        // passes data for one outfit into single-outfit handlebars template
        res.render('single-outfit', {
            ...outfits,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// DASHBOARD - PREVENT ROUTE ACCESS USING WITHAUTH MIDDLEWARE

router.get("/dashboard", withAuth, async (req, res) => {

    try {
        const outfitsData = await Outfits.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
            ],
        });

        // serialises outfits data for handlebars template
        const outfits = outfitsData.map((outfit) => outfit.get({ plain: true }));

        // passes data into homepage handlebars template
        res.render('dashboard', {
            outfits,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// LOGIN - Redirects user to dashboard page if already logged_in
router.get("/login", (req, res) => {

    if (req.session.logged_in) {
        res.redirect("/dashboard");
        return;
    }
    res.render("login");
})

// SIGNUP - Redirects user to dashboard page if already logged_in
router.get('/signup', async (req, res) => {
    res.render('signup');
});

// ADD OUTFIT - Render Get Outfit form once logged in

router.get("/outfits", withAuth, async (req, res) => {

    // Find user logged_in data from session ID
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: 
            { 
                exclude: ["password"]
            },
           include: [
                {
                    model: Outfits,
                },
            ],
        });

        // serialises data specific to user into dashboard handlebars template
        const user = userData.get({ plain: true });

        // passes data for one outfit into single-outfit handlebars template
        res.render('addoutfit', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/upload-file', (req, res) => {
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Accessing the file by the <input> File name="target_file"
    let targetFile = req.files.image_name;
    console.log(targetFile);

});


module.exports = router;