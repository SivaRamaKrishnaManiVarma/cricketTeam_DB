const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");

const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());
const InitializeDBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log(`server running at  http://localhost:3001/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

InitializeDBServer();

app.get("/players/", async (request, response) => {
  const getPlayersDetails = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const playersArray = await db.all(getPlayersDetails);
  response.send(playersArray);
});

//Post
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayer = `
    INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES ('${playerName}',${jerseyNumber},'${role})';`;
  dbResponse = await db.run(addPlayer);
  const player_id = dbResponse.lastID;
  response.send("Player Added to Team");
});

//get PlayerDetails

app.get("/players/:playerId/", async (request, response) => {
  const { player_id } = request.params;
  const getPlayerDetails = `SELECT * FROM cricket_team where player_id= ${player_id};`;
  const playerArray = await db.get(getPlayerDetails);
  response.send(playerArray);
});

//update playerDetails(PUT)
app.put("/players/:playerId/", async (request, response) => {
  const { player_id } = request.params;
  const playerDetails = request.body;

  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayer = `
    UPDATE cricket_team
    SET player_name='${playerName}',jersey_number=${jerseyNumber},role= '${role}' WHERE
     player_id=${player_id};`;
  dbResponse = await db.run(updatePlayer);

  response.send("Player Details Updated");
});

//delete player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `DELETE FROM cricket_team where player_id=${playerId};`;
  await db.run(deletePlayer);
  response.send("Player Removed");
});
