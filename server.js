require("dotenv").config();

const connectDB = require("./src/config/db");

const app = require("./src/app");

const PORT = process.env.PORT || 3021;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Api is listening on port ${PORT}`);
});
