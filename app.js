const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envLocalPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
dotenv.config();

const createHttpServer = require("./http-server");
const app = require("./express-app");
const mainRouter = require("./app_backend/routes/routes");
const { connectDb } = require("./app_backend/db/models");

const ensurePublicDirectories = () => {
  const baseDirectory = "public";
  const directories = {
    orders: ["proofs"]
  };

  for (const [mainDir, subDirs] of Object.entries(directories)) {
    const mainPath = path.join(__dirname, baseDirectory, mainDir);
    if (!fs.existsSync(mainPath)) {
      fs.mkdirSync(mainPath, { recursive: true });
      console.log(`Created: ${mainPath}`);
    }

    for (const subDir of subDirs) {
      const subPath = path.join(mainPath, subDir);
      if (!fs.existsSync(subPath)) {
        fs.mkdirSync(subPath, { recursive: true });
        console.log(`Created: ${subPath}`);
      }
    }
  }
};

(async () => {
  try {
    ensurePublicDirectories();
    await connectDb();

    app.use("/api", mainRouter);
    app.get("/", (req, res) => {
      res.status(200).send("Delivery API");
    });

    const httpServer = createHttpServer(app);
    const PORT = Number(process.env.PORT || 9091);
    const HOST = process.env.HOST || "0.0.0.0";

    await new Promise((resolve, reject) => {
      httpServer.listen(PORT, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });

    console.log(`Server ready at http://${HOST}:${PORT}`);
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    process.exitCode = 1;
  }
})();
