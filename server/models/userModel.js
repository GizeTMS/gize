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
      FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      LastName: {
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
  
// Create a Admin user after the model is synced
User.afterSync(() => {
  User.findOne({ where: { Role: 'SuperAdmin' } }).then((superAdmin) => {
    if (!superAdmin) {
      const superAdminData = {
        FirstName: 'Super',
        LastName: 'Admin',
        Password: bcrypt.hashSync('password', 10), // Set the hashed password
        Email: 'superadmin@example.com',
        Role: 'SuperAdmin',
      };

      User.create(superAdminData)
        .then(() => {
          console.log('Super admin user created successfully.');
        })
        .catch((error) => {
          console.error('Error creating super admin user:', error);
        });
    }
  });
});


  return User;
};