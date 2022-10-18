const express = require("express");
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
        const dbQuery = {};
        if (req.query.username) {
            dbQuery.username = req.query.username;
        }
        if (req.query.updatedFrom && req.query.updatedTo) {
            dbQuery.updated = {
                $between: [req.query.updatedFrom && req.query.updatedTo],
            };
        }
        if (req.query.updatedFrom || req.query.updatedTo) {
            dbQuery.updated = req.query.updatedFrom || req.query.updatedTo;
        }

        const users = await db.User.findAll({
            attributes: ["username", "id"],
            where: dbQuery,
        });
        res.status(200).send({
            data: users,
        });
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
        const user = await db.User.create({
            username,
        });
        res.status(200).send({
            data: user,
        });
    }
);

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await db.User.findOne({ where: { id }, attributes: ["username"] });
    res.status(200).send({
        data: user,
    });
});

router.post(
    "/:id/exercises",
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
        },
        true
    ),
    async (req, res) => {
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
        const id = parseInt(req.params.id);

        const exerciseQuery = {
            userId: id,
        };
        if (req.query.from && req.query.to) {
            exerciseQuery.updated = {
                $between: [req.query.from && req.query.to],
            };
        }
        if (req.query.from || req.query.to) {
            exerciseQuery.updated = req.query.from || req.query.to;
        }

        const user = await db.User.findOne({ where: { id }, attributes: ["username"] });
        const exercises = await db.Exercise.findAll({ where: exerciseQuery, limit: req.query.limit || null , attributes: ["duration", "description", 'date']});
        res.status(200).send({
            data: { ...user.dataValues, logs: exercises || [], count: exercises.length },
        });
    }
);

module.exports = router;
