const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const Visualization = sequelize.define('Visualization', {
    VisualizationID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataSource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Visualization.associate = (models) => {
    // Define associations here
    Visualization.belongsTo(models.Project, {
      foreignKey: {
        name: 'projectId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
    });
  };

  return Visualization;
};