const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: 'user_id',
      });

      Comment.belongsTo(models.Task, {
        foreignKey: 'task_id',
      });

      Comment.belongsTo(models.Project, {
        foreignKey: 'project_id',
      });
    }
  }

  Comment.init(
    {
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );

  return Comment;
};