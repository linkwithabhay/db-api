import mysql from "mysql";
import SqlModel from "../models/SQL_USER.js";
import dotenv from "dotenv";
dotenv.config();

// const handshake = () => {
//   return mysql.createConnection({
//     host: "database-insaid.cxf1myfevh6c.ap-south-1.rds.amazonaws.com",
//     user: "insaid",
//     password: "helloworld",
//     database: "students",
//   });
// };

/**
 * Establish a MySQL connection.
 * @return mysql.Connection
 */
const handshake = () => {
  return mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB,
  });
};

const userExists = (email) => {
  const connection = handshake();
  connection.query(`SELECT email FROM users WHERE email = '${email}'`, (err, result) => {
    if (err) {
      connection.end();
      const { code, errno, sqlMessage, sqlState } = err;
      console.log({ error: { code, errno, sqlMessage, sqlState } });
      return false;
    }
    connection.end();
    if (result[0]) return true;
    return false;
  });
};

/**
 * This will show all the entries.
 * @deprecated Take care of this
 */
const showAll = () => {
  const connection = handshake();
  // connection.query(`SELECT * FROM EMPLOYEES`, (err, result) => {
  //   if (err) {
  //     const { code, errno, sqlMessage, sqlState } = err;
  //     console.log({ error: { code, errno, sqlMessage, sqlState } });
  //     connection.end();
  //     return;
  //   }
  //   console.log(result);
  //   connection.end();
  // });
  connection.query(`SELECT * FROM users`, (err, result) => {
    if (err) {
      const { code, errno, sqlMessage, sqlState } = err;
      console.log({ error: { code, errno, sqlMessage, sqlState } });
      connection.end();
      return;
    }
    console.log(result);
    connection.end();
  });
};

/**
 * This will add one user.
 * @returns null
 */
const addOne = async () => {
  const user = new SqlModel("Firstname", "Lastname", "first@last.email", "pass", "user ID");
  const connection = handshake();
  if (await userExists(user.email)) {
    console.log(user.email, "already exists!");
    connection.end();
    return;
  }
  // const list = [
  //   ["Surya Kant Karanwal", "Saharanpur"],
  //   ["Abhay Kumar", "Muzaffarnagar"],
  //   ["Siddharth Mistri", "Modinagar"],
  //   ["Akanksha Baneni", "Muzaffarnagar"],
  //   ["Kashika Dhachu", "Meerut"],
  // ];
  // for (let item of list) {
  //   connection.query(
  //     `INSERT into EMPLOYEES (NAME, ADDRESS)
  //     VALUES ('${item[0]}', '${item[1]}')`
  //   );
  // }
  // connection.end();

  connection.query(
    `INSERT into users (firstname, lastname, email, password, uid) VALUES ('Firstname', 'Lastname', 'first@last.email', 'pass', 'user ID')`,
    (err, result) => {
      if (err) {
        const { code, errno, sqlMessage, sqlState } = err;
        console.log({ error: { code, errno, sqlMessage, sqlState } });
        connection.end();
        return;
      }
      console.log(result);
      connection.end();
    }
  );
};

const showTable = () => {
  const connection = handshake();
  console.log(process.env.SQL_HOST);
  connection.query(`select * from tblUsers`, (err, result) => {
    connection.end();
    if (err) {
      const { code, errno, sqlMessage, sqlState } = err;
      console.log({ error: { code, errno, sqlMessage, sqlState } });
      return false;
    }
    if (result) console.log(result);
  });
};

showTable();

// showAll();
// addOne();
