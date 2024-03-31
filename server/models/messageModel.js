const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: 'senderUserID',
      });

      Message.belongsTo(models.User, {
        foreignKey: 'receiverUserID',
      });
    }
  }

  Message.init(
    {
      messageID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      senderUserID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverUserID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeStamp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Message',
    }
  );

  return Message;
};