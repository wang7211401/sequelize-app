'use strict';
module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define('Likes', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        content_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Contents",
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: 'id'
            }
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
        tableName: 'likes'
    });
    Likes.associate = function(models) {
        // associations can be defined here

        Likes.belongsTo(models.Users, {
            foreignKey: 'user_id'
        });

        Likes.belongsTo(models.Contents, {
            foreignKey: 'content_id'
        });
    };
    return Likes;
};