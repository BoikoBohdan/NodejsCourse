const express = require("express");
const router = express.Router();
const validator = require('../middleware/validate')
const db = require('../models');

router.get("/api/exercise", (req, res) => {
    // TODO: retreive exercise and send to requester
});


module.exports = router;