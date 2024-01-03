import express from "express";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "wise_saying",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());
const port = 3000;

const wiseSayings = [
  {
    content: "나는 의적이다.",
    author: "홍길동",
  },
  {
    content: "나는 산적이다.",
    author: "임꺽정",
  },
];

app.get("/wise-sayings", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM wise_saying ORDER BY id DESC");

  res.json(rows);
});

app.post("/wise-sayings", async (req, res) => {
  const { author, content } = req.body;

  if (!author) {
    res.status(400).json({
      msg: "author required",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  const [rs] = await pool.query(
    `
    INSERT INTO wise_saying
    SET reg_date = NOW(),
    content = ?,
    author = ?
    `,
    [content, author]
  );

  res.status(201).json({
    id: rs.insertId,
  });
});

app.patch("/wise-sayings/:id", async (req, res) => {
  const { id } = req.params;

  const { author, content } = req.body;

  const [rows] = await pool.query("SELECT * FROM wise_saying WHERE id = ?", [
    id,
  ]);

  if (rows.length == 0) {
    res.status(404).send("not found");
    return;
  }

  if (!author) {
    res.status(400).json({
      msg: "author required",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  const [rs] = await pool.query(
    `
    UPDATE wise_saying
    SET content = ?,
    author = ?
    WHERE id = ?
    `,
    [content, author, id]
  );

  res.status(200).json({
    id,
    author,
    content,
  });
});

app.get("/wise-sayings/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT * FROM wise_saying WHERE id = ?", [
    id,
  ]);

  if (rows.length == 0) {
    res.status(404).send("not found");
    return;
  }

  res.json(rows[0]);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
