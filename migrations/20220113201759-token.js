'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('tokens', {
            token: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.DataTypes.TEXT,
            },
            user_id: {
                type: Sequelize.DataTypes.STRING,
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
        await queryInterface.dropTable('tokens');
    }
};
