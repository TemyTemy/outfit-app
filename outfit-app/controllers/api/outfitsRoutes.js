const router = require("express").Router();
const { Outfits } = require("../../models");
const withAuth = require("../../utils/auth"); 



// POST NEW OUTFIT
router.post('/addoutfit', withAuth, async (req, res) => {
console.log(req, "request data")
    try {
    const newOutfits = await Outfits.create({
        ...req.body,
        user_id: req.session.user_id,
    });
    console.log(...req.body);
    res.status(200).json(newOutfits);
} catch (err) {
    res.status(400).json(err);
}
});


// UPDATE AN OUTFIT BY ITS ID

router.put("/:id", withAuth, async (req, res) => {
    try {
        const updateOutfit = await Outfits.update({
            ...req.body,
            user_id: req.session.user_id,
        }); 

        res.status(200).json(updateOutfit);
    } catch (err) {

    res.status(400).json(err);
    }
});


// DELETE AN OUTFIT BY ITS ID
router.delete("/:id", withAuth, async (req, res) => {
    try {
        const outfitsData = await Outfits.destroy({
            where: {
                id: req.params.id,
                user_id: req.seesion.user_id,
            },
        });

        if (!outfitsData) {
            res.status(404).json({ message: "No Outfit Found"})
        }

        res.status(200).json(outfitsData);

    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;



