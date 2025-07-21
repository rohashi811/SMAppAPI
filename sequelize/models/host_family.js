const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HostFamily extends Model {
  static associate(models) {
    this.belongsTo(models.Host, { foreignKey: 'host_id' });
  }
  }
  HostFamily.init(
    {
      host_id: { 
          type: DataTypes.INTEGER.UNSIGNED, 
          primaryKey: true 
      },
      name: { 
          type: DataTypes.STRING(100), 
          allowNull: false 
      },
      relationship: { 
          type: DataTypes.STRING(50), 
          allowNull: false 
      },
      phone: { 
          type: DataTypes.STRING(20), 
          allowNull: true 
      },
      date_of_birth: { 
          type: DataTypes.DATEONLY, 
          allowNull: true 
      },
    },
    {
      sequelize,
      modelName: 'HostFamily',
      tableName: 'Host_Families',
      timestamps: false,
    }
  );
  return HostFamily;
}