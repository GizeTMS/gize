// Import necessary packages and modules
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();

var corOptions = {
  origin: 'https://localhost:3306'
}

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require('./models/index.js')
db.sequelize.sync();

db.sequelize.sync({ force: false })
  .then(() => {

    console.log('it is working');
  });

// Import controllers
const commentController = require('./controllers/commentController')
const messageController = require('./controllers/messageController')
const projectController = require('./controllers/projectController');
const sharedDocumentController = require('./controllers/sharedDocumentController');
const taskController = require('./controllers/taskController');
const userController = require('./controllers/userController')
const visualizationController = require('./controllers/visualizationController');

// Import routes
const commentRoutes = require('./routes/commentRoutes')
const messageRoutes = require('./routes/messageRoutes');
const projectRoutes = require('./routes/projectRoutes');
const sharedDocumentRoutes = require('./routes/sharedDocumentRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const visualizationRoutes = require('./routes/visualizationRoutes');



// Mount routes
app.use('/comment', commentRoutes);
app.use('/message', messageRoutes);
app.use('/project', projectRoutes);
app.use('/sharedDocument', sharedDocumentRoutes);
app.use('/task', taskRoutes);
app.use('/user', userRoutes);
app.use('/visualization', visualizationRoutes);




//testing api
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to gize' })
})

//Port
const PORT = process.env.PORT || 3000


// start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});