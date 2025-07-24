const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HostDetail extends Model {
  static associate(models) {
    this.belongsTo(models.Host, { foreignKey: 'host_id' });
  }
  }
  HostDetail.init(
    {
      host_id: { 
          type: DataTypes.INTEGER.UNSIGNED, 
          primaryKey: true 
      },
      email: { 
          type: DataTypes.STRING(255), 
          allowNull: true 
      },
      num_of_room: { 
          type: DataTypes.INTEGER, 
          allowNull: true,
          defaultValue: 1
      },
      pet: { 
          type: DataTypes.BOOLEAN, 
          defaultValue: false 
      },
      note: { 
          type: DataTypes.TEXT, 
          allowNull: true 
      },
    },
    {
      sequelize,
      modelName: 'HostDetail',
      tableName: 'Host_details',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return HostDetail;
}