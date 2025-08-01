"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("messages", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      senderId: {
        type:Sequelize.UUID,
        allowNull:false,
        references: {
          model: "users",//provide name of table present in database
          key: "id",
        },
      },
      recieverId: {
        type:Sequelize.UUID,
        allowNull:false,
        references: {
          model: "users",//provide name of table present in database
          key: "id",
        },
      },
      image: {
        type: Sequelize.STRING,
        allowNull:true
      },
      text: {
        type: Sequelize.STRING,
        allowNull:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("messages");
  },
};
