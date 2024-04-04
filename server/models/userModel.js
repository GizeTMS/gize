const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Project, {
        through: 'UserProjects',
        foreignKey: 'UserID',
      });

      User.belongsToMany(models.Task, {
        through: 'TaskUser',
        foreignKey: 'UserID',
      });

      User.belongsToMany(models.Document, {
        through: 'UserDocuments',
        foreignKey: 'UserID',
      });

      User.hasMany(models.Comment, {
        foreignKey: 'UserID',
      });
    }
  }

  User.init(
    {
      UserID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      FullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
     PhoneNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Role: {
        type: DataTypes.ENUM('Admin', 'User'),
        defaultValue: 'User',
      },
      ProfilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
    }
  );
  

  return User;
};