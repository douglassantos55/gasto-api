'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users_friends', {
            friend_id: {
                type: Sequelize.DataTypes.STRING,
                references: {
                    model: {
                        tableName: 'users',
                    },
                    key: 'id'
                },
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
            createdAt: Sequelize.DataTypes.DATE,
            updatedAt: Sequelize.DataTypes.DATE,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users_friends');
    }
};
