import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Home Page");
});

router.get("/:db", (req, res) => {
  const { db } = req.params;

  switch (db.toLowerCase()) {
    case "alpha":
      res.send(`Connected to '${db}' database`);
      return;

    default:
      res.send(`'${db}' database is not there.`);
      return;
  }
});

// router.post("/signin");

export default router;
