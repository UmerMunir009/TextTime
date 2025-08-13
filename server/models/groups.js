'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(models.User, {foreignKey: "created_by",as: "creator"});
      Group.hasMany(models.Group_Member, { foreignKey: "group_id", as: "group_member" });
      Group.hasMany(models.Group_Message, { foreignKey: "groupId", as: "group_messages" });

    }
  }
  Group.init({
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
      description:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users", //provide name of table present in database
          key: "id",
        },
      },
      group_icon: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
  }, {
    sequelize,
    modelName: 'Group',
    tableName:'groups'
  });
  return Group;
};