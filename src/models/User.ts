
import sequelize from '@/utils/dbConn';
import { Sequelize, DataTypes, Model, BOOLEAN } from 'sequelize';
import md5 from 'md5'
import { NextFunction } from 'express';
import ErrorHandler from '@/utils/ErrorHandler';

class User extends Model {
  declare Id: number
  declare Password: string
  declare Email: string
  declare OTP: string | null
  declare OTPSentAt: Date | null
  declare IsDeleted: number
  comparePassword(enteredPassword: string) {
    return md5(enteredPassword) === this.Password
  }
}
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  // Model attributes are defined here
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUnique: function(value: string, next: NextFunction) {
          User.findOne({
              where: {username: value},
              attributes: ['id']
          }).then((user: any) => {
              if (user)
                  next(new ErrorHandler('This username is taken', 400))
              next();
          });
      }
    }
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  FullName: {
    type: DataTypes.STRING
  },
  Email: {
    type: DataTypes.STRING,
    validate: {
      isUnique: function(value: string, next: NextFunction) {
          User.findOne({
              where: {email: value},
              attributes: ['id']
          }).then((user: any) => {
              if (user)
                  next(new ErrorHandler('This email is taken', 400))
              next();
          });
      }
    }
  },
  Gender: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  Birthday: {
    type: DataTypes.TIME
  },
  IsPremiumUser: {
    type: BOOLEAN,
    defaultValue: false,
  },
  OTP: {
    type: DataTypes.STRING,
  },
  OTPSentAt: {
    type: DataTypes.TIME,
  },
  IsDeleted: {
    type: DataTypes.TINYINT
  }
}, {
  sequelize,
  modelName: 'user',
});



export default User;