const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Homestay extends Model {
    static associate(models) {
      this.hasOne(models.HomestayDetail, { foreignKey: 'homestay_id' });
      this.hasMany(models.HomestayFamily, { foreignKey: 'homestay_id' });
      this.hasOne(models.StudentHomestay, { foreignKey: "student_id" });
  }
  }
  Homestay.init(
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
      modelName: 'Homestay',
      tableName: 'Homestay',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Homestay;
}