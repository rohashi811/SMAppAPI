const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HomestayFamily extends Model {
  static associate(models) {
    this.belongsTo(models.Homestay, { foreignKey: 'homestay_id' });
  }
  }
  HomestayFamily.init(
    {
      homestay_id: { 
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
      modelName: 'HomestayFamily',
      tableName: 'Homestay_Family',
      timestamps: false,
    }
  );
  return HomestayFamily;
}