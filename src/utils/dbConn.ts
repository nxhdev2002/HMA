import { Sequelize } from 'sequelize'

const SQL_DATABASE = process.env.SQL_DATABASE ?? ''
const sequelize = new Sequelize(
  SQL_DATABASE,
  (process.env.SQL_USERNAME ?? ''),
  (process.env.SQL_PASSWORD ?? ''),
  {
    host: process.env.SQL_ADDRESS ?? '10.8.0.254',
    dialect: 'mysql'
  })

export default sequelize
