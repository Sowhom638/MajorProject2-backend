const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(express.json());

const {connectDB} = require('./db/db.connect');

const leadRoutes = require('./routes/lead.route');
const reportRoutes = require('./routes/report.route');
const salesAgentRoutes = require('./routes/salesAgent.route');
const commentRoutes = require('./routes/comment.route');
const tagRoutes = require('./routes/tag.route');

connectDB();


const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use('/leads', leadRoutes);
app.use('/leads', commentRoutes);
app.use('/tags', tagRoutes);
app.use('/report', reportRoutes);
app.use('/agents', salesAgentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});