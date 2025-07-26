const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // 他のモデルとの関連を定義
      this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
      this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
      this.belongsTo(models.Host, { foreignKey: 'host_id', as: 'host' });
    }
  }

  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
        comment: '支払いタイプ（収入/支出）',
        validate: {
          isIn: {
            args: [['income', 'expense']],
            msg: '支払いタイプは income または expense である必要があります'
          }
        }
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: '金額',
        validate: {
          isDecimal: {
            msg: '金額は数値である必要があります'
          },
          min: {
            args: [0.01],
            msg: '金額は0より大きい値である必要があります'
          }
        }
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'JPY',
        comment: '通貨',
        validate: {
          len: {
            args: [3, 3],
            msg: '通貨コードは3文字である必要があります'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '支払い説明'
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'カテゴリ'
      },
      payment_method: {
        type: DataTypes.ENUM('cash', 'bank_transfer', 'credit_card', 'debit_card', 'check', 'other'),
        allowNull: true,
        comment: '支払い方法',
        validate: {
          isIn: {
            args: [['cash', 'bank_transfer', 'credit_card', 'debit_card', 'check', 'other']],
            msg: '有効な支払い方法を選択してください'
          }
        }
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'failed'),
        defaultValue: 'pending',
        comment: '支払いステータス',
        validate: {
          isIn: {
            args: [['pending', 'completed', 'cancelled', 'failed']],
            msg: '有効なステータスを選択してください'
          }
        }
      },
      payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '支払い日',
        validate: {
          isDate: {
            msg: '有効な日付形式で入力してください'
          }
        }
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: '支払期限',
        validate: {
          isDate: {
            msg: '有効な日付形式で入力してください'
          }
        }
      },
      company_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        comment: '関連会社ID'
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '関連学生ID'
      },
      host_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '関連ホストID'
      },
      reference_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '参照番号'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '備考'
      }
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'idx_type',
          fields: ['type']
        },
        {
          name: 'idx_status',
          fields: ['status']
        },
        {
          name: 'idx_payment_date',
          fields: ['payment_date']
        },
        {
          name: 'idx_category',
          fields: ['category']
        },
        {
          name: 'idx_company_id',
          fields: ['company_id']
        },
        {
          name: 'idx_student_id',
          fields: ['student_id']
        },
        {
          name: 'idx_host_id',
          fields: ['host_id']
        }
      ]
    }
  );

  // バリデーションフック
  Payment.beforeCreate(async (payment, options) => {
    // 支払期限が支払い日より前の場合のチェック
    if (payment.due_date && payment.payment_date && payment.due_date < payment.payment_date) {
      throw new Error('支払期限は支払い日以降である必要があります');
    }
  });

  Payment.beforeUpdate(async (payment, options) => {
    // 支払期限が支払い日より前の場合のチェック
    if (payment.due_date && payment.payment_date && payment.due_date < payment.payment_date) {
      throw new Error('支払期限は支払い日以降である必要があります');
    }
  });

  return Payment;
}; 