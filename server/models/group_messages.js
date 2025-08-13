'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group_Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Group_Message.belongsTo(models.Group, {foreignKey: "groupId",as: "group"});
        Group_Message.belongsTo(models.User,{ foreignKey: "senderId", as: "sender"});

    }
  }
  Group_Message.init({
       id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      groupId: {
        type:Sequelize.UUID,
        allowNull:false,
        references: {
          model: "groups",//provide name of table present in database
          key: "id",
        },
      },
      senderId: {
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
      }
   }, {
    sequelize,
    modelName: 'Group_Message',
    tableName:'group_messages'
  });
  return Group_Message;
};