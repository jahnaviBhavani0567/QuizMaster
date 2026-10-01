const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const games = {};

function generatePin() {
  let pin;

  do {
    pin = String(
      Math.floor(100000 + Math.random() * 900000)
    );
  } while (games[pin]);

  return pin;
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  /*
   * HOST CREATES GAME
   */

  socket.on("create-game", ({ title, questions }) => {
    const pin = generatePin();

    games[pin] = {
      pin,
      title,
      questions,
      hostId: socket.id,
      players: [],
      currentQuestion: 0,
      started: false,
    };

    socket.join(pin);

    socket.emit("game-created", {
      pin,
      game: games[pin],
    });

    console.log(
      `Game created: ${pin}`
    );
  });

  /*
   * PLAYER JOINS GAME
   */

  socket.on(
    "join-game",
    ({ pin, name }) => {
      const game = games[pin];

      if (!game) {
        socket.emit(
          "join-error",
          "Game not found."
        );
        return;
      }

      const player = {
        id: socket.id,
        name,
        score: 0,
      };

      game.players.push(player);

      socket.join(pin);

      socket.emit("joined-game", {
        pin,
        title: game.title,
        player,
      });

      io.to(game.hostId).emit(
        "players-updated",
        game.players
      );

      console.log(
        `${name} joined game ${pin}`
      );
    }
  );

  /*
   * HOST STARTS GAME
   */

  socket.on("start-game", ({ pin }) => {
    const game = games[pin];

    if (!game) return;

    game.started = true;
    game.currentQuestion = 0;

    io.to(pin).emit(
      "game-started",
      {
        question:
          game.questions[0],
        questionNumber: 1,
        totalQuestions:
          game.questions.length,
      }
    );
  });

  /*
   * PLAYER ANSWERS
   */

  socket.on(
    "submit-answer",
    ({
      pin,
      answerIndex,
    }) => {
      const game = games[pin];

      if (!game) return;

      const player =
        game.players.find(
          (p) => p.id === socket.id
        );

      if (!player) return;

      const question =
        game.questions[
          game.currentQuestion
        ];

      if (
        answerIndex ===
        question.correctAnswer
      ) {
        player.score += 100;
      }

      socket.emit(
        "answer-result",
        {
          correct:
            answerIndex ===
            question.correctAnswer,
          score: player.score,
        }
      );
    }
  );

  /*
   * NEXT QUESTION
   */

  socket.on(
    "next-question",
    ({ pin }) => {
      const game = games[pin];

      if (!game) return;

      game.currentQuestion++;

      if (
        game.currentQuestion >=
        game.questions.length
      ) {
        io.to(pin).emit(
          "game-finished",
          {
            players:
              game.players,
          }
        );

        return;
      }

      const question =
        game.questions[
          game.currentQuestion
        ];

      io.to(pin).emit(
        "next-question",
        {
          question,
          questionNumber:
            game.currentQuestion + 1,
          totalQuestions:
            game.questions.length,
        }
      );
    }
  );

  /*
   * PLAYER DISCONNECT
   */

  socket.on("disconnect", () => {
    console.log(
      "Disconnected:",
      socket.id
    );

    for (const pin in games) {
      const game = games[pin];

      const oldLength =
        game.players.length;

      game.players =
        game.players.filter(
          (player) =>
            player.id !== socket.id
        );

      if (
        oldLength !==
        game.players.length
      ) {
        io.to(game.hostId).emit(
          "players-updated",
          game.players
        );
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send(
    "QuizMaster server is running!"
  );
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `QuizMaster server running on port ${PORT}`
  );
});