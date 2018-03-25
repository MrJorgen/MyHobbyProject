app.get("/chat", (req, res) => {

   if (!req.mySession.username) {
      req.mySession.username = "John Doe";
   };
   // socket.username = req.mySession.username;

   // 1000 milli, 60 seconds, 60 minutes = 1 hour
   Message.find({
      timestamp: { $gte: new Date().getTime() - 1000 * 60 * 60 }
   }, (err, messages) => {
      if (err) {
         console.log("Error retrieving data from db: " + err);
      } else {
         res.render("chat", {
            title: "Live Chat",
            messages: messages,
            username: req.mySession.username
         });
      }
   });

});

// Insert chat messages to database and check everytime a new chat message
// is inserted for messages older than 1 hour (and remove them)

io.on('connection', (socket) => {
   console.log("A user connected!");
   users++;
   console.log("Current users: " + users);
   socket.on('chat message', (msg) => {
      let message = new Message();

      // message.user = msg.user;
      message.user = socket.username;
      message.message = msg.message;
      message.timestamp = msg.timestamp;
      message.save((err, msg) => {
         if (err) {
            console.log("Error inserting data to db: " + err);
         }
         else {
            console.log(msg.user + " says " + msg.message);
            io.emit('chat message', msg);
         }
      });
   });

   socket.on("add user", (username) => {
      socket.username = username;
      console.log(username + " connected to chat");
   });

   socket.on('disconnect', () => {
      console.log("User disconnected.");
      users--;
      console.log("Current users: " + users);
   });
});