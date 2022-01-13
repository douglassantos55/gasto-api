'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            name: Sequelize.DataTypes.STRING,
            email: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
            },
            password: Sequelize.DataTypes.STRING,
            picture: Sequelize.DataTypes.STRING,
        })
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable("users");
    }
};
