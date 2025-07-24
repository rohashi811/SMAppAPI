const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Host extends Model {
    static associate(models) {
      this.hasOne(models.HostDetail, { foreignKey: 'host_id' });
      this.hasMany(models.HostFamily, { foreignKey: 'host_id' });
      this.hasMany(models.AcceptanceSchedule, { foreignKey: "host_id" });
  }
  }
  Host.init(
    {
      id: { 
          type: DataTypes.INTEGER.UNSIGNED, 
          autoIncrement: true, 
          primaryKey: true 
      },
      first_name: { 
          type: DataTypes.STRING(100), 
          allowNull: false 
      },
      last_name: { 
          type: DataTypes.STRING(100), 
          allowNull: false 
      },
      phone: { 
          type: DataTypes.STRING(15), 
          allowNull: true 
      },
      address: { 
          type: DataTypes.TEXT, 
          allowNull: false 
      },
      status: {
          type: DataTypes.ENUM('Great', 'Ok', 'NG'),
          allowNull: false,
          defaultValue: 'Ok',
      },
    },
    {
      sequelize,
      modelName: 'Host',
      tableName: 'Host',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Host;
}