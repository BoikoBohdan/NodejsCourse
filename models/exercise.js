"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Exercise extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Exercise.belongsTo(models.User, {
                foreignKey: "userId",
            });
        }
    }
    Exercise.init(
        {
            userId: DataTypes.STRING,
            duration: DataTypes.NUMBER,
            description: DataTypes.STRING,
            date: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Exercise",
        }
    );
    return Exercise;
};
