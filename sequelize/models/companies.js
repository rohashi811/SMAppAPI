const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      // 必要に応じて他のモデルとの関連を定義
      // 例: this.hasMany(models.Student, { foreignKey: 'company_id' });
    }
  }

  Company.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '会社名',
        validate: {
          notEmpty: {
            msg: '会社名は必須です'
          },
          len: {
            args: [1, 255],
            msg: '会社名は1文字以上255文字以下である必要があります'
          }
        }
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '住所'
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '電話番号',
        validate: {
          is: {
            args: /^[\d\-\+\(\)\s]+$/,
            msg: '有効な電話番号形式で入力してください'
          }
        }
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'メールアドレス',
        validate: {
          isEmail: {
            msg: '有効なメールアドレス形式で入力してください'
          }
        }
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'ウェブサイトURL',
        validate: {
          isUrl: {
            msg: '有効なURL形式で入力してください'
          }
        }
      },
      industry: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '業界'
      },
      size: {
        type: DataTypes.ENUM('small', 'medium', 'large'),
        allowNull: true,
        comment: '会社規模',
        validate: {
          isIn: {
            args: [['small', 'medium', 'large']],
            msg: '会社規模は small, medium, large のいずれかである必要があります'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '会社説明'
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending'),
        defaultValue: 'active',
        comment: 'ステータス',
        validate: {
          isIn: {
            args: [['active', 'inactive', 'pending']],
            msg: 'ステータスは active, inactive, pending のいずれかである必要があります'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Company',
      tableName: 'companies',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'idx_name',
          fields: ['name']
        },
        {
          name: 'idx_status',
          fields: ['status']
        },
        {
          name: 'idx_industry',
          fields: ['industry']
        }
      ]
    }
  );

  return Company;
}; 