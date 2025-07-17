const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
        Group.hasMany(models.Student, { foreignKey: 'group_id', as: 'students' });
        models.Student.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });
    }
  }
  Group.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Group',
      tableName: 'Groups',
      timestamps: false,
    }
  );
  return Group;
}