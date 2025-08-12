'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group_Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group_Member.belongsTo(models.User, {foreignKey: "user_id",as: "member"});
      Group_Member.belongsTo(models.Group, {foreignKey: "group_id",as: "group"});
    }
  }
  Group_Member.init({
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      group_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "groups", //provide name of table present in database
          key: "id",
        },
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users", //provide name of table present in database
          key: "id",
        },
      },
  }, {
    sequelize,
    modelName: 'Group_Member',
    tableName:'group_members'
  });
  return Group_Member;
};