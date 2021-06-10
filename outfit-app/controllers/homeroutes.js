// HTML ROUTES
const router = require("express").Router();
const { Outfits, User } = require("../models");
const withAuth = require("../utils/auth");
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

// DISPLAY ALL OUTFITS ON HOMEPAGE
router.use(expressCspHeader({
  directives: {
      'img-src': [SELF, 'data:', 'res.cloudinary.com']
  }
}));
router.get("/", async (req, res) => {
  console.log("requestquery", req.query);
  // Get all outfits and join with User Data
  try {
    const outfitsData = await Outfits.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    // serialises outfits data for handlebars template
    const outfits = outfitsData.map((outfit) => outfit.get({ plain: true }));
    // passes data into homepage handlebars template
    if (req.query.price) {
      const sortedOutfits = outfits.sort(
        (firstOutfit, secondOutfit) => firstOutfit.price - secondOutfit.price);
      console.log("sortedOutfits", sortedOutfits);
      res.render("homepage", {
        outfits: sortedOutfits,
        logged_in: req.session.logged_in,
      });
    }
    if (req.query.gender) {
      const filteredOutfits = outfits.filter(
        (outfit) =>
          outfit.gender.toLowerCase() === req.query.gender &&
          outfit.event.toLowerCase() === req.query.event
      );
      console.log("filteredOutfits", filteredOutfits);
      res.render("homepage", {
        outfits: filteredOutfits,
        logged_in: req.session.logged_in,
      });
      // }
      // if (req.query.event) {
      //   const filteredOutfits = outfits.filter(
      //     (outfit) => outfit.event.toLowerCase() === req.query.event
      //   );
      //   res.render("homepage", {
      //     outfits: filteredOutfits,
      //     logged_in: req.session.logged_in,
      //   });
      // }
      // if (req.query.colour) {
      //   const filteredOutfits = outfits.filter(
      //     (outfit) => outfit.colour.toLowerCase() === req.query.colour
      //   );
      //   res.render("homepage", {
      //     outfits: filteredOutfits,
      //     logged_in: req.session.logged_in,
      //   });
    } else {
      res.render("homepage", {
        outfits,
        logged_in: req.session.logged_in,
      });
    }
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
          attributes: ["username"],
        },
      ],
    });

    // serialises data for one outfit into handlebars template
    const outfits = outfitsData.get({ plain: true });

    // passes data for one outfit into single-outfit handlebars template
    res.render("single-outfit", {
      ...outfits,
      logged_in: req.session.logged_in,
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
          attributes: ["username"],
        },
      ],
    });

    // serialises outfits data for handlebars template
    const outfits = outfitsData.map((outfit) => outfit.get({ plain: true }));

    // passes data into homepage handlebars template
    res.render("dashboard", {
      outfits,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//   // FILTER ON DASHBOARD BY 'LIKES' ONLY
// router.get("/dashboard", withAuth, async (req, res) => {

//   try {
//     const outfitsData = await Outfits.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           attributes: ["username"]
//         },
//       ],
//     });
//     // serialises outfits data for handlebars template
//     const outfits = outfitsData.map((outfit) => outfit.get({ plain: true }));
//     // passes data into dashboard handlebars template

//     if (req.params.likes) {
//       const filteredLikes = outfits.filter(
//         (outfit) => outfit.likes.toLowerCase() === req.params.likes
//       );
//       res.render("dashboard", {
//         outfits: filteredLikes,
//         logged_in: req.session.logged_in,
//       });
//     } else {
//       res.render("dashboard", {
//         logged_in: req.session.logged_in,
//       });
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }

// });

// LOGIN - Redirects user to dashboard page if already logged_in
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

// SIGNUP - Redirects user to dashboard page if already logged_in
router.get("/signup", async (req, res) => {
  res.render("signup");
});

// ADD OUTFIT - Render Get Outfit form once logged in
router.get("/outfits", withAuth, async (req, res) => {
  // Find user logged_in data from session ID
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: {
        exclude: ["password"],
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
    res.render("addoutfit", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    console.log('Error', err);
    res.status(500).json(err);
  }
});

// Update outfit - Redirects user to dashboard page if already logged_in
router.get("/editoutfit", async (req, res) => {
  res.render("editoutfit");
});

module.exports = router;
