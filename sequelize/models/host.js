const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Host extends Model {
    static associate(models) {
      this.hasOne(models.HostDetail, { foreignKey: 'host_id' });
      this.hasMany(models.HostFamily, { foreignKey: 'host_id' });
      this.hasOne(models.HostAccommodations, { foreignKey: "student_id" });
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
          type: DataTypes.STRING(50), 
          allowNull: false 
      },
      last_name: { 
          type: DataTypes.STRING(50), 
          allowNull: false 
      },
      phone: { 
          type: DataTypes.STRING(20), 
          allowNull: false 
      },
      address: { 
          type: DataTypes.STRING(255), 
          allowNull: false 
      },
    },
    {
      sequelize,
      modelName: 'Host',
      tableName: 'Hosts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Host;
}