'use strict';
module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comments', {
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
        content: {
            type: DataTypes.STRING(1000),
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
        tableName: 'comments'
    });
    Comments.associate = function(models) {
        // associations can be defined here
        Comments.belongsTo(models.Contents, {
            foreignKey: 'content_id'
        })

        Comments.belongsTo(models.Users, {
            foreignKey: 'user_id'
        });
    };
    return Comments;
};