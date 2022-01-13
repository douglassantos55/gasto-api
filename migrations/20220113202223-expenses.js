'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("expenses", {
            id: {
                type: Sequelize.DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            date: Sequelize.DataTypes.DATEONLY,
            description: Sequelize.DataTypes.STRING,
            total: Sequelize.DataTypes.DECIMAL(10, 2),
            type: Sequelize.DataTypes.STRING(),
            user_id: {
                type: Sequelize.DataTypes.STRING,
                references: {
                    model: {
                        tableName: 'users',
                    },
                    key: 'id'
                },
            },
            friend_id: {
                type: Sequelize.DataTypes.STRING,
                references: {
                    model: {
                        tableName: 'users',
                    },
                    key: 'id'
                },
            },
            payment_id: {
                type: Sequelize.DataTypes.STRING,
                references: {
                    model: {
                        tableName: 'expenses',
                    },
                    key: 'id'
                },
            },
        })
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('expenses');
    }
};
