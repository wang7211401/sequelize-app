'use strict';
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('Users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        password: {
            type: DataTypes.CHAR(32),
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        tableName: 'users'
    });
    users.associate = function(models) {
        // associations can be defined here
        users.hasMany(models.Contents, {
            foreignKey: 'user_id'
        });

        users.hasMany(models.Comments, {
            foreignKey: 'user_id'
        });

    };
    return users;
};