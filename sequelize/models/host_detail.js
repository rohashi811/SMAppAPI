const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HostDetail extends Model {
  static associate(models) {
    this.belongsTo(models.Host, { foreignKey: 'host_id' });
  }
  }
  HomestayDetail.init(
    {
      host_id: { 
          type: DataTypes.INTEGER.UNSIGNED, 
          primaryKey: true 
      },
      email: { 
          type: DataTypes.STRING(100), 
          allowNull: true 
      },
      num_of_room: { 
          type: DataTypes.INTEGER, 
          allowNull: true 
      },
      housemates: { 
          type: DataTypes.TEXT, 
          allowNull: true 
      },
      pet: { 
          type: DataTypes.BOOLEAN, 
          defaultValue: false 
      },
    },
    {
      sequelize,
      modelName: 'HostDetail',
      tableName: 'Host_Details',
      timestamps: false,
    }
  );
  return HostDetail;
}