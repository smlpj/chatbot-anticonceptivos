class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
      anotherQuestionButton: document.querySelector(".anotherQuestion__button"),
      messageButton: document.querySelectorAll(".message_button"),
    };

    this.state = false;
    this.messages = [
      { name: "Sam", message: "Hola, ¿en qué te puedo ayudar hoy?" },
    ];
    this.intents = [
      {
        question: "Otra pregunta",
        answers: [
          "Edad para empezar a tomar anticonceptivos",
          "Métodos de planificacion",
          "Suspensión de pastillas",
          "Relacionado con la menstruación",
          "Efectos secundarios",
          "Riesgos a tomar",
          "Preguntas relacionadas con enfermedades",
        ],
      },
      {
        question: "Edad para empezar a tomar anticonceptivos",
        answers: [
          "¿Desde qué edad puedo iniciar el consumo de ellos?",
          "Si tengo 12, 13 o 14 años, ¿puedo tomar anticonceptivos?",
        ],
      },
      {
        question: "Métodos de planificacion",
        answers: ["¿Que métodos de planificación existen?"],
      },
      {
        question: "Suspensión de pastillas",
        answers: ["¿Cómo suspender las pastillas?"],
      },
      {
        question: "Relacionado con la menstruación",
        answers: [
          "Tengo 1 meses sin menstruar mientras tomo anticonceptivos. ¿Qué hago?",
          "Desde que empecé la toma de anticonceptivos, el periodo me dura menos tiempo y sangró menos, ¿es normal?",
          "Todos los días estoy manchando mis interiores, ¿por qué?",
          "¿Qué hacer si todos los días estoy manchando mis interiores?",
        ],
      },
      {
        question: "Efectos secundarios",
        answers: [
          "¿Qué efectos secundarios puedo esperar del medicamento?",
          "¿Las pastillas engordan?",
          "¿Es imposible que quede embarazada mientras tome las pastillas?",
        ],
      },
      {
        question: "Riesgos a tomar",
        answers: [
          "¿Mi pareja sexual puede evitar el uso de condon mientras este tomando anticonceptivos?",
        ],
      },
      {
        question: "Preguntas relacionadas con enfermedades",
        answers: [
          "¿Puedo tomar anticonceptivos si soy hipertensa?",
          "¿Puedo tomar anticonceptivos si soy diabética?",
        ],
      },
    ];
  }

  display() {
    const {
      openButton,
      chatBox,
      sendButton,
      anotherQuestionButton,
      messageButton,
    } = this.args;

    openButton.addEventListener("click", () => this.toggleState(chatBox));

    sendButton.addEventListener("click", () => this.onSendButton(chatBox));

    messageButton.forEach((button) => {
      button.addEventListener("click", () =>
        this.onMessageButton(chatBox, button)
      );
    });

    anotherQuestionButton.addEventListener("click", () =>
      this.onAnotherQuestionButton(chatBox, anotherQuestionButton)
    );

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

  onAnotherQuestionButton(chatbox, button) {
    let questions = [
      '<div class="message_button messages__item--visitor">Edad para empezar a tomar anticonceptivos</div>',
      '<div class="message_button messages__item--visitor">Métodos de planificacion</div>',
      '<div class="message_button messages__item--visitor">Suspensión de pastillas</div>',
      '<div class="message_button messages__item--visitor">Relacionado con la menstruación</div>',
      '<div class="message_button messages__item--visitor">Efectos secundarios</div>',
      '<div class="message_button messages__item--visitor">Riesgos a tomar</div>',
      '<div class="message_button messages__item--visitor">Preguntas relacionadas con enfermedades</div>',
    ];
    questions.forEach((question) => {
      var temp = document.createElement("div");
      temp.innerHTML = question;
      var node = temp.firstChild;
      node.addEventListener("click", () =>
        this.onMessageButtonVisitor(chatbox, node)
      );
      chatbox
        .querySelector(".chatbox__messages")
        .insertBefore(
          node,
          chatbox.querySelector(".chatbox__messages").firstChild
        );
    });
  }

  onMessageButtonVisitor(chatbox, button) {
    let text1 = button.textContent;
    if (text1 === "") {
      return;
    }

    this.updateChatText(chatbox);
    this.intents.find((intent) => {
      if (intent.question === text1) {
        intent.answers.forEach((answer) => {
          let msg2 = { name: "User", message: answer };
          this.messages.push(msg2);
          this.updateChatText2(chatbox);
        });
      }
    });
  }

  onMessageButtonOperator(chatbox, button) {
    let text1 = button.textContent;
    if (text1 === "") {
      return;
    }
    this.updateChatText(chatbox);

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
        this.intents.find((intent) => intent.question === r.answer)
          ? this.updateChatText2(chatbox)
          : this.updateChatText(chatbox);
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText(chatbox);
      });
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
    if (this.messages.slice(-1).pop().name === "Sam") {
      var s =
        '<div class="message_button messages__item--visitor">' +
        this.messages.slice(-1).pop().message +
        "</div>";
      var temp = document.createElement("div");
      temp.innerHTML = s;
      var node = temp.firstChild;
      node.addEventListener("click", () =>
        this.onMessageButtonVisitor(chatbox, node)
      );
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
      node.addEventListener("click", () =>
        this.onMessageButtonOperator(chatbox, node)
      );
      chatbox
        .querySelector(".chatbox__messages")
        .insertBefore(
          node,
          chatbox.querySelector(".chatbox__messages").firstChild
        );
    }
  }
}

const chatbox = new Chatbox();
chatbox.display();
