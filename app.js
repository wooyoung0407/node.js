import express from "express";

const app = express();
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

app.get("/wise-sayings", (req, res) => {
  res.json(wiseSayings);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); 