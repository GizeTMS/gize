const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsToMany(models.User, {
        through: 'UserProjects',
        foreignKey: 'ProjectID',
      });

      Project.hasMany(models.Task, {
        foreignKey: 'ProjectID',
        onDelete: 'CASCADE',
        hooks: true,
      });

      Project.hasMany(models.DataVisual, {
        foreignKey: 'ProjectID',
      });

      Project.hasMany(models.Comment, {
        foreignKey: 'ProjectID',
      });
    }
  }

  Project.init(
    {
      ProjectID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ProjectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      StartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      EndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Status: {
        type: DataTypes.ENUM('Active', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Active',
      },
    },
    {
      sequelize,
      modelName: 'Project',
      timestamps: true,
    }
  );

  return Project;
};