const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const exerciseRouter = require("./exercise");

router.use("/users", userRouter);
router.use("/exercise", exerciseRouter);

module.exports = router;
