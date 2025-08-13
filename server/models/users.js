"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Message, {foreignKey: "senderId",as: "senderMessages"});
      User.hasMany(models.Message, {foreignKey: "recieverId",as: "recieverMessages"});
      User.hasMany(models.Friend, {foreignKey: "user_id",as: "user_friends"});
      User.hasMany(models.Friend, { foreignKey: "friend_id", as: "friends" });
      User.hasMany(models.Group, { foreignKey: "created_by", as: "group_creator" });
      User.hasMany(models.Group_Member, { foreignKey: "user_id", as: "group_members" });
      User.hasMany(models.Group_Message, {foreignKey: "senderId",as: "senderGroupMsgs"});

    }
  }
  User.init(
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profilePic: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      last_seen: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
