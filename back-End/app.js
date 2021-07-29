var express = require("express");
var cors = require("cors");
//
var app = express();
app.use(cors());
app.use(express.json());
//
let clients = [];
let score = { arsenal: 0, manchister: 0 };
//
app.get("/socers", eventHandler);
app.get("/notification", eventHandler);
//
function eventHandler(req, res, next) {
  const headeers = {
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  };
  /**
   * responed headers for event-stream connection
   * we respond with a specific HTTP header. This informs the browser that this server will
   *  be using sse to send events.
   */
  res.writeHead(200, headeers);
  /**
   * stirngfy a score, because the header Accep text/event-stream not an Array
   *  The double new-line characters at the end of data indicates the end of the message.
   */
  const data = `data: ${JSON.stringify(score)} \n\n`;
  // response the envent to the client

  res.write(data);

  /**
   * set the time to to registor the client depent on timestamp.
   */
  const clientId = Date.now();

  const newClient = {
    id: clientId,
    res,
  };

  clients.push(newClient);
  /**
   * When the connection is closed, e.g. the browser window is closed.
   *  We search through the open connections array and remove this connection.
   */
  //// If client closes connection, stop sending events
  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

// add the event
app.post("/todos", addEvent);

async function addEvent(request, response) {
  /**
   * post request to the endpoing of todos
   */

  const body = request.body;

  // const eventDate = dateFormat(body.date, "dddd, mmmm dS, yyyy, h:MM:ss TT");

  const newScore = {
    arsenal: body.arsenal,
    manchister: body.manchister,
    // date: eventDate,
  };

  /**
   * add the new score
   */

  score = newScore;

  response.json(newScore);

  return sendEventsToListners(newScore);
}

function sendEventsToListners(newScore) {
  clients.forEach((client) =>
    client.res.write(`data: ${JSON.stringify(newScore)}\n\n`)
  );
}

app.listen(3030, () => {
  console.log("the app is running on the port 3030");
});

module.exports = app;
