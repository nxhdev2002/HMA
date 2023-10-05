
import sequelize from '@/utils/dbConn';
import { Sequelize, DataTypes, Model } from 'sequelize';
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import { NextFunction } from 'express';
import ErrorHandler from '@/utils/ErrorHandler';

class User extends Model {
  declare id: number
  declare password: string

  getJwtToken() {
    return jwt.sign({
      id: this.id,
    }, process.env.JWT_SECRET!)
  }
  comparePassword(enteredPassword: string) {
    return md5(enteredPassword) === this.password
  }
}
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  // Model attributes are defined here
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING
  },
  email: {
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
  birthday: {
    type: DataTypes.TIME
  },
  gender: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  }
}, {
  sequelize,
  modelName: 'User',
});



export default User;