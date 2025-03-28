import { app } from "./app";
import { Database } from "./db/dbConnect";

const port = process.env.PORT || 8080;
const database = new Database();

database
  .connectWithRetry()
  .then(() => {
    app.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`)
    );
  })
  .catch((error: Error) => {
    console.error("Error on Server", error);
  });
