const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/dbConfig.js');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Comment = require('./commentModel.js')(sequelize, DataTypes);
db.Document = require('./sharedDocumentModel.js')(sequelize, DataTypes);
db.Message = require('./messageModel.js')(sequelize, DataTypes);
db.Project = require('./projectModel.js')(sequelize, DataTypes);
db.Task = require('./taskModel.js')(sequelize, DataTypes);
db.User = require('./userModel.js')(sequelize, DataTypes);
db.Visualization = require('./visualizationModel.js')(sequelize, DataTypes);

// Junction Tables and Associations
const Comments = sequelize.define('comments', {});
const UserProject = sequelize.define('userprojects', {});
const TaskUser = sequelize.define('taskProjects', {});
const userDocument = sequelize.define('userDocuments', {});

// Associations for User model
db.User.associate = (models) => {
    db.User.belongsToMany(models.Project, {
      through: models.userprojects,
      as:  'UserProject',
      foreignKey: 'UserId',
    });
  
    db.User.belongsToMany(models.Task, {
      through: models.taskProjects,
      as:  'UserProject',
      foreignKey: 'UserId',
    });
  
    db.User.belongsToMany(models.Document, {
      through: models.userDocuments,
      foreignKey: 'UserId',
    });
  
    db.User.hasMany(models.Comment, {
      foreignKey: 'user_id',
    });
};

// Associations for Task model
db.Task.associate = (models) => {
    db.Task.belongsTo(models.Project, {
      foreignKey: 'Project_id',
    });
  
    db.Task.belongsToMany(models.User, {
      through: models.taskProjects,
      foreignKey: 'TaskId',
    });
  
    db.Task.hasMany(models.Comment, {
      foreignKey: 'task_id',
      onDelete: 'CASCADE',
      hooks: true,
    });
};

// Associations for Document model
db.Document.associate = (models) => {
    db.Document.belongsTo(models.Project, {
      foreignKey: {
        name: 'projectId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
    });
  
    db.Document.belongsToMany(models.User, {
      through: models.userDocuments,
      foreignKey: 'DocumentId',
      otherKey: 'UserId',
    });
};

// Associations for Project model
db.Project.associate = (models) => {
    db.Project.belongsToMany(models.User, {
      through: models.userprojects,
      foreignKey: 'ProjectID',
    });
  
    db.Project.hasMany(models.Task, {
      foreignKey: 'ProjectID',
      onDelete: 'CASCADE',
      hooks: true,
    });
  
    db.Project.hasMany(models.Document, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
      hooks: true,
    });
};

// Associations for Comment model
db.Comment.associate = (models) => {
    db.Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  
    db.Comment.belongsTo(models.Task, {
      foreignKey: 'task_id',
    });
};

module.exports = db;