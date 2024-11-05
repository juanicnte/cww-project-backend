import mongoose from "mongoose"

const MONGO_URL = "mongodb://192.168.100.200:27017/cww";

const db = async () => {
  await mongoose
    .connect(MONGO_URL)
    .then(() => console.log("DB FUNCIONANDO"))
    .catch((error) => console.error(error));
};

export default db