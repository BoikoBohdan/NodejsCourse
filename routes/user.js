const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const validator = require("../middleware/validate");
const db = require("../models");

router.get(
    "/",
    validator({
        username: {
            type: "string",
        },
        updatedFrom: {
            type: "date",
        },
        updatedTo: {
            type: "date",
        },
    }),
    async (req, res) => {
        try {
            const dbQuery = {};
            if (req.query.username) {
                dbQuery.username = req.query.username;
            }
            if (req.query.updatedFrom || req.query.updatedTo) {
                exerciseQuery.updatedAt = {};
            }
            if (req.query.updatedFrom) {
                exerciseQuery.updatedAt[Op.gte] = new Date(req.query.updatedFrom);
            }
            if (req.query.updatedTo) {
                exerciseQuery.updatedAt[Op.lte] = new Date(req.query.updatedTo);
            }
            const users = await db.User.findAll({
                attributes: ["username", "id"],
                where: dbQuery,
            });
            res.status(200).send({
                data: users,
            });
        } catch (e) {
            console.log(e);
            res.status(500).send("Server Error");
        }
    }
);

router.post(
    "/",
    validator(
        {
            username: {
                type: "string",
                required: true,
            },
        },
        true
    ),
    async (req, res) => {
        const { username } = req.body;
        try {
            const existUser = await db.User.findOne({
                where: { username },
            });
            if (existUser) {
                res.status(400).send({ error: "User with such username already exists" });
                return;
            }
            const user = await db.User.create({
                username,
            });
            res.status(200).send({
                data: user,
            });
        } catch (e) {
            console.log(e);
            res.status(500).send("Server Error");
        }
    }
);

router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await db.User.findOne({ where: { id }, attributes: ["username"] });
        res.status(200).send({
            data: user,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send("Server Error");
    }
});

router.post(
    "/:id?/exercises",
    validator(
        {
            description: {
                type: "string",
                required: true,
            },
            duration: {
                type: "number",
                required: true,
            },
            date: {
                type: "date",
            },
            'id': {
                required: true,
            }
        },
        true
    ),
    async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const { date, duration, description } = req.body;
            const user = await db.User.findOne({ where: { id: userId }, attributes: ["username", "id"] });
            if (!user) {
                res.status(400).send({
                    errors: {
                        id: "No user with such id!",
                    },
                });
                return;
            }
            const exercise = await db.Exercise.create({
                date,
                duration,
                description,
                userId,
            });
            res.status(200).send({
                data: {
                    user,
                    exercise,
                },
            });
        } catch (e) {
            console.log(e);
            res.status(500).send("Server Error");
        }
    }
);

router.get(
    "/:id/logs",
    validator({
        limit: {
            type: "number",
        },
        from: {
            type: "date",
        },
        to: {
            type: "date",
        },
    }),
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            const exerciseQuery = {
                userId: id,
            };
            if (req.query.from && req.query.to) {
                exerciseQuery.date = {};
            }
            if (req.query.from) {
                exerciseQuery.date[Op.gte] = new Date(req.query.from);
            }
            if (req.query.to) {
                exerciseQuery.date[Op.lte] = new Date(req.query.to);
            }

            const user = await db.User.findOne({ where: { id }, attributes: ["username"] });
            if (!user) {
                res.status(400).send({ error: "No user with such id" });
                return;
            }
            const exercises = await db.Exercise.findAll({
                where: exerciseQuery,
                limit: req.query.limit || null,
                attributes: ["duration", "description", "date"],
                order: [['date', 'ASC']]
            });
            res.status(200).send({
                data: { ...user.dataValues, logs: exercises || [], count: exercises.length },
            });
        } catch (e) {
            console.log(e);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
