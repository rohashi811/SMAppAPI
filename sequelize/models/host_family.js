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
      relation: { 
          type: DataTypes.STRING(50), 
          allowNull: false 
      },
      phone: { 
          type: DataTypes.STRING(15), 
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
      tableName: 'Host_family',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // 生年月日バリデーションのフック
  HostFamily.beforeCreate(async (hostFamily, options) => {
    if (hostFamily.date_of_birth && hostFamily.date_of_birth > new Date().toISOString().split('T')[0]) {
      throw new Error('Date of birth cannot be in the future');
    }
  });

  HostFamily.beforeUpdate(async (hostFamily, options) => {
    if (hostFamily.date_of_birth && hostFamily.date_of_birth > new Date().toISOString().split('T')[0]) {
      throw new Error('Date of birth cannot be in the future');
    }
  });

  return HostFamily;
}