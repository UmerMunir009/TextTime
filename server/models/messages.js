"use strict";
const { Model,Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User,{ foreignKey: "senderId", as: "sender"});
      Message.belongsTo(models.User, {foreignKey: "recieverId",as: "reciever"});
    }
  }
  Message.init(
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      senderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users", //provide name of table present in database
          key: "id",
        },
      },
      recieverId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users", //provide name of table present in database
          key: "id",
        },
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
    }
  );
  return Message;
};
