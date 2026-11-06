import bcrypt from 'bcrypt';
import { DataTypes, Model } from 'sequelize';

export function defineUserModel(sequelize) {
  class User extends Model {
    async comparePassword(candidatePassword) {
      if (typeof this.password !== 'string') {
        return false;
      }

      return bcrypt.compare(candidatePassword, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(60),
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(15),
      },
      password: {
        type: DataTypes.STRING(150),
      },
      address: {
        type: DataTypes.STRING(200),
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      gender: {
        type: DataTypes.STRING(1),
        validate: {
          isIn: [['F', 'M']],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: false,
      hooks: {
        beforeCreate: async (user) => {
          if (typeof user.password === 'string') {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password') && typeof user.password === 'string') {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    },
  );

  return User;
}