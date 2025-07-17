import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class HomestayDetail extends Model {
  static associate(models) {
    this.belongsTo(models.Homestay, { foreignKey: 'homestay_id', as: 'homestay' });
  }
}
HomestayDetail.init(
  {
    homestay_id: { 
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
    modelName: 'HomestayDetail',
    tableName: 'Homestay_Details',
    timestamps: false,
  }
);