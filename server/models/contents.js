'use strict';
module.exports = (sequelize, DataTypes) => {
    const Contents = sequelize.define('Contents', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        like_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        comment_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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
        tableName: 'contents'
    });
    Contents.associate = function(models) {
        // associations can be defined here

        Contents.belongsTo(models.Users, {
            foreignKey: 'user_id'
        });

        Contents.hasMany(models.Comments, {
            foreignKey: 'content_id'
        });

        Contents.hasMany(models.Likes, {
            foreignKey: 'content_id'
        });
    };
    return Contents;
};