const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const authenticate = require("../middleware/authMiddleware");

router.get("/test", (req, res) => res.send("Card routes are working"));

router.get("/", cardController.getCards);
router.post("/", cardController.createCard);
router.put("/:id", cardController.updateCard);
router.delete("/:id", cardController.deleteCard);
router.post("/check", cardController.checkStock);
router.get("/search", cardController.searchCards);


module.exports = router;
