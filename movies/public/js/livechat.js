$(function () {
      let socket = io(), userName = document.querySelector("#messages-container").dataset.user;

      $("form").submit(function () {
            if ($("#m").val() !== "") {
                  let msg = {
                        user: "User",
                        timestamp: new Date(),
                        message: $("#m").val()
                  }
                  // let tmpName = faker.name.firstName();
                  // console.log(tmpName);
                  msg.user = userName;
                  socket.emit("chat message", msg);
            }
            $("#m").val("");
            return false;
      });

      socket.on("chat message", (msg) => {
            if (msg !== "") {
                  let time = new Date(msg.timestamp).toLocaleTimeString();
                  let timeSpan = moment().fromNow();
                  $("#messages")
                        .append($("<li>")
                              .addClass("list-group-item")
                              .html(`
                                          <span class="chat-time">${timeSpan}</span>
                                          <span class="chat-user">${msg.user}</span>
                                          <span class="chat-msg">${msg.message}</span>`
                              ));

                  window.scrollTo(0, document.body.scrollHeight);
            }
      });

      socket.on("connect", (message) => {
            console.log("Connected to chat as " + userName + "!");
            socket.emit("add user", userName);
      });
});