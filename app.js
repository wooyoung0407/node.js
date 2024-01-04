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

app.get("/wise-sayings", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM wise_saying ORDER BY id DESC");

  res.json(rows);
});

app.post("/wise-sayings", async (req, res) => {
  const { author, content } = req.body;

  if (!author) {
    res.status(400).json({
      msg: "작가가 없습니다. 실패 ",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "내용이 없습니다. 실패",
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
    msg : `${id}번을 생성하였습니다.`
  });
});

app.patch("/wise-sayings/:id", async (req, res) => {
  const { id } = req.params;

  const { author, content } = req.body;

  const [rows] = await pool.query("SELECT * FROM wise_saying WHERE id = ?", [
    id,
  ]);

  if (rows.length == 0) {
    res.status(404).send("없음");
    return;
  }

  if (!author) {
    res.status(400).json({
      msg: "작가 없습니다. 업데이트실패",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "내용 없습니다. 업데이트실패",
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
    author,
    content,
    msg : `${id}를 수정하였습니다.`
  });
});

app.delete("/wise-sayings/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query("SELECT * FROM wise_saying WHERE id = ?", [
    id,
  ]);

  if (rows.length == 0) {
    res.status(404).send("없음");
    return;
  }

  const [rs] = await pool.query(
    `
    DELETE FROM wise_saying
    WHERE id = ?
    `,
    [id]
  );

  res.status(200).json({
    msg : `${id}번을 삭제하였습니다.`
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
