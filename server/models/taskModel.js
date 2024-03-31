const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Project, {
        foreignKey: 'Project_id',
      });

      Task.belongsToMany(models.User, {
        through: 'TaskUser',
        foreignKey: 'task_id',
      });

      Task.hasMany(models.Comment, {
        foreignKey: 'task_id',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }

  Task.init(
    {
      taskID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      taskName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      status: DataTypes.STRING,
      assignedUser: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );

  return Task;
};