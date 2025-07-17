import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // adjust path as needed

export class School extends Model {
  static associate(models) {
    School.hasMany(models.Student, { foreignKey: 'school_id', as: 'students' });
    models.Student.belongsTo(School, { foreignKey: 'school_id', as: 'school' });
  }
}
School.init(
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
    category: {
      type: DataTypes.ENUM('Language', 'Secondary', 'College', 'University', 'Graduate'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'School',
    tableName: 'Schools',
    timestamps: false,
  }
);

module.exports =  School;