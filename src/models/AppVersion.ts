import sequelize from "@/utils/dbConn";
import { DataTypes, Model } from "sequelize";

class AppVersion extends Model {
    declare FileName: string
    declare FilePath: string
}

AppVersion.init({
    Id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    FileData:{
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    FileName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    FilePath:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Version:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}, {
    sequelize,
    modelName: 'appversion',
});


export default AppVersion