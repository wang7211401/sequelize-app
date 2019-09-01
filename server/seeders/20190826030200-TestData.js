'use strict';

const md5 = require('md5');

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */

        return queryInterface.bulkInsert('Users', [{
                username: 'frank2',
                password: md5('123456'),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                username: 'Bob3',
                password: md5('123321'),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {}).then(data => {
            return queryInterface.bulkInsert('Contents', [{
                    user_id: 1,
                    title: 'aaaaa',
                    content: '1111111',
                    comment_count: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    user_id: 2,
                    title: 'bbbbbb',
                    content: '22222222',
                    comment_count: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    user_id: 1,
                    title: 'ccccccc',
                    content: '3333333',
                    comment_count: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    user_id: 2,
                    title: 'ddddd',
                    content: '444444',
                    comment_count: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    user_id: 1,
                    title: 'eeeee',
                    content: '5555555',
                    comment_count: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ], {}).then(data => {
                return queryInterface.bulkInsert('Comments', [{
                        content_id: 1,
                        user_id: 1,
                        content: '评论内容11111111',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        content_id: 1,
                        user_id: 2,
                        content: '评论内容22222',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        content_id: 2,
                        user_id: 1,
                        content: '评论内容33333333',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]);
            })
        });
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        return queryInterface.bulkDelete('Users', null, {})
    }
};