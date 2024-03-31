const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Document extends Model {
    static associate(models) {
      // Define associations here
      Document.belongsTo(models.Project, {
        foreignKey: {
          name: 'projectId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
      });

      Document.belongsToMany(models.User, {
        through: 'UserDocument',
        foreignKey: 'documentId',
        otherKey: 'userId',
      });
    }
  }

  Document.init(
    {
      DocumentID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Document',
    }
  );

  return Document;
};