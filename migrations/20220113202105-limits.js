'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('limits', {
            total: Sequelize.DataTypes.DECIMAL(15, 2),
            month: {
                type: Sequelize.DataTypes.INTEGER({ unsigned: true }),
                primaryKey: true,
            },
            year: {
                type: Sequelize.DataTypes.INTEGER({ unsigned: true }),
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.DataTypes.STRING,
                primaryKey: true,
                references: {
                    model: {
                        tableName: 'users',
                    },
                    key: 'id'
                },
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('limits');
    }
};
