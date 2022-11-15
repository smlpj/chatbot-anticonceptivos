class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
      messageButton: document.querySelectorAll(".message_button"),
    };

    this.state = false;
    this.messages = [
      { name: "Sam", message: "Hola, ¿en qué te puedo ayudar?" },
    ];
    this.intents = [
      {
        question: "Tipos de anticonceptivos",
        answers: ["¿Que es el VIH?", "Hola"],
      },
      { question: "¿Qué es el VIH?", answers: ["Hola", "Chao"] },
    ];
  }

  display() {
    const { openButton, chatBox, sendButton, messageButton } = this.args;

    openButton.addEventListener("click", () => this.toggleState(chatBox));

    sendButton.addEventListener("click", () => this.onSendButton(chatBox));

    messageButton.forEach((button) => {
      button.addEventListener("click", () =>
        this.onMessageButton(chatBox, button)
      );
    });

    const node = chatBox.querySelector("input");
    node.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        this.onSendButton(chatBox);
      }
    });
  }

  toggleState(chatbox) {
    this.state = !this.state;

    // show or hides the box
    if (this.state) {
      chatbox.classList.add("chatbox--active");
    } else {
      chatbox.classList.remove("chatbox--active");
    }
  }

  onSendButton(chatbox) {
    var textField = chatbox.querySelector("input");
    let text1 = textField.value;
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "User", message: text1 };
    this.messages.push(msg1);

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify({ message: text1 }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        let msg2 = { name: "Sam", message: r.answer };
        this.messages.push(msg2);
        this.updateChatText(chatbox);
        textField.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText(chatbox);
        textField.value = "";
      });
  }

  onMessageButton(chatbox, button) {
    console.log("click");
    let text1 = button.textContent;
    if (text1 === "") {
      return;
    }
    if (button.classList.contains("messages__item--visitor")) {
      let msg1 = { name: "Sam", message: text1 };
      this.messages.push(msg1);
    } else {
      let msg1 = { name: "User", message: text1 };
      this.messages.push(msg1);
    }
    console.log(this.messages);
    this.updateChatText(chatbox);
    this.intents.find((intent) => {
      if (intent.question === text1) {
        intent.answers.forEach((answer) => {
          if (button.classList.contains("messages__item--visitor")) {
            let msg2 = { name: "User", message: answer };
            this.messages.push(msg2);
          } else {
            let msg2 = { name: "Sam", message: answer };
            this.messages.push(msg2);
          }
          this.updateChatText2(chatbox);
        });
      }
    });
  }

  updateChatMessages(chatbox) {
    var html = "";
    this.messages
      .slice()
      .reverse()
      .forEach(function (item, index) {
        if (item.name === "Sam") {
          html +=
            '<div class="message_button messages__item--visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="message_button messages__item--operator">' +
            item.message +
            "</div>";
        }
      });

    const chatmessage = chatbox.querySelector(".chatbox__messages");
    chatmessage.innerHTML = html;
  }

  updateChatText(chatbox) {
    var html = "";
    this.messages
      .slice()
      .reverse()
      .forEach(function (item, index) {
        if (item.name === "Sam") {
          html +=
            '<div class="messages__item messages__item--visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="messages__item messages__item--operator">' +
            item.message +
            "</div>";
        }
      });

    const chatmessage = chatbox.querySelector(".chatbox__messages");
    chatmessage.innerHTML = html;
  }

  updateChatText2(chatbox) {
    var html = chatbox.querySelector(".chatbox__messages").innerHTML;
    console.log(html);

    if (this.messages.slice(-1).pop().name === "Sam") {
      var s =
        '<div class="message_button messages__item--visitor">' +
        this.messages.slice(-1).pop().message +
        "</div>";
      var temp = document.createElement("div");
      temp.innerHTML = s;
      var node = temp.firstChild;
      node.addEventListener("click", () => this.onMessageButton(chatbox, node));
      chatbox
        .querySelector(".chatbox__messages")
        .insertBefore(
          node,
          chatbox.querySelector(".chatbox__messages").firstChild
        );
    } else {
      var s =
        '<div class="message_button messages__item--operator">' +
        this.messages.slice(-1).pop().message +
        "</div>";
      var temp = document.createElement("div");
      temp.innerHTML = s;
      var node = temp.firstChild;
      node.addEventListener("click", () => this.onMessageButton(chatbox, node));
      chatbox
        .querySelector(".chatbox__messages")
        .insertBefore(
          node,
          chatbox.querySelector(".chatbox__messages").firstChild
        );
    }

    console.log(html);
  }
}

const chatbox = new Chatbox();
chatbox.display();
