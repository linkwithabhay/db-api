import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

class Reply {
  constructor(success, data) {
    this.success = success;
    this.data = data;
  }
}

const collectionsHaveEmail = ["users"];

export const Create = async (collection_name, data) => {
  if (!collection_name || !data) return new Reply(false, { message: "Two arguments are required." });
  if (typeof collection_name !== "string" || typeof data !== "object")
    return new Reply(false, "One or more argument data-type is invalid.");
  if (!data.uid) return new Reply(false, { message: "'uid' property is required and must have a string non-empty value." });
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB);
  const collectionExists = Boolean((await db.listCollections().toArray()).filter((c) => c.name === collection_name).length);
  if (!collectionExists) {
    await client.close();
    return new Reply(false, { message: "Collection does not exists." });
  }
  const collection = db.collection(collection_name);
  const uidExists = await collection.findOne({ uid: data.uid });
  if (uidExists) {
    await client.close();
    return new Reply(false, `Data with uid: ${data.uid} already exists!`);
  }
  if (collectionsHaveEmail.includes(collection_name) && data.email) {
    const emailExists = await collection.findOne({ email: data.email });
    if (emailExists) {
      await client.close();
      return new Reply(false, `Data with email: ${data.email} already exists!`);
    }
  }
  const result = await collection.insertOne({ ...data, createdAt: new Date(), updatedAt: new Date() });
  await client.close();
  //! Handle insert failure
  return new Reply(true, { message: "Data created successfully.", uid: data.uid });
};

export const Read = async (collection_name, search_param) => {
  if (!collection_name || !search_param) return new Reply(false, { message: "Two arguments are required." });
  if (typeof collection_name !== "string" || typeof search_param !== "object")
    return new Reply(false, "One or more argument data-type is invalid.");
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB);
  const collectionExists = Boolean((await db.listCollections().toArray()).filter((c) => c.name === collection_name).length);
  if (!collectionExists) {
    await client.close();
    return new Reply(false, { message: "Collection does not exists." });
  }
  const collection = db.collection(collection_name);
  const result = await collection.findOne(search_param);
  await client.close();
  if (!result) return new Reply(false, "No result found");
  return result;
};

export const Update = async (collection_name, uid, data) => {
  if (!collection_name || !data) return new Reply(false, { message: "Three arguments are required." });
  if (typeof collection_name !== "string" || typeof data !== "object" || typeof uid !== "string")
    return new Reply(false, "One or more argument data-type is invalid.");
  if (!uid) return new Reply(false, { message: "'uid' argument is required and must have a string non-empty value." });
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB);
  const collectionExists = Boolean((await db.listCollections().toArray()).filter((c) => c.name === collection_name).length);
  if (!collectionExists) {
    await client.close();
    return new Reply(false, { message: "Collection does not exists!" });
  }
  const collection = db.collection(collection_name);
  const found = await collection.findOne({ uid });
  if (!found) {
    await client.close();
    return new Reply(false, { message: "Data does not exists!" });
  }
  if (data.uid) delete data.uid; // Do not let uid change
  let proceed = false;
  for (let key in data) {
    if (!found[key] || found[key] !== data[key]) {
      proceed = true;
      break;
    }
  }
  if (!proceed) {
    await client.close();
    return new Reply(false, { message: "There is nothing to update." });
  }
  const result = await collection.updateOne({ uid: data.uid }, { $set: data });
  await client.close();
  if (!result.modifiedCount) return new Reply(false, "Data is not modified.");
  return new Reply(true, { message: "Data updated successfully." });
};

export const Delete = async (collection_name, uid) => {
  if (!collection_name || !uid) return new Reply(false, { message: "Two arguments are required." });
  if (typeof collection_name !== "string" || typeof uid !== "string") return new Reply(false, "One or more argument data-type is invalid.");
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB);
  const collectionExists = Boolean((await db.listCollections().toArray()).filter((c) => c.name === collection_name).length);
  if (!collectionExists) {
    await client.close();
    return new Reply(false, { message: "Collection does not exists." });
  }
  const collection = db.collection(collection_name);
  const result = await collection.deleteOne({ uid: uid });
  await client.close();
  if (!result.deletedCount) {
    return new Reply(false, { message: `No document with uid='${uid}' exist in our universe.` });
  }
  return new Reply(true, { message: "Data removed successfully." });
};

export default { Create, Read, Update, Delete };
