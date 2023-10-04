
import sequelize from '@/utils/dbConn';
import { Sequelize, DataTypes, Model } from 'sequelize';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

class User extends Model {
  declare id: number
  declare password: string

  getJwtToken() {
    return jwt.sign({
      id: this.id,
    }, process.env.JWT_SECRET!)
  }
  async comparePassword(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
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
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true
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
  modelName: 'User'
});



export default User;