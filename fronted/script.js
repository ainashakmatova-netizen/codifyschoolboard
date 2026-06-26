const API = "http://127.0.0.1:8000/chat";

let messages = [];

function addMessage(text, sender){

    const chat = document.getElementById("chat-box");

    const div = document.createElement("div");

    div.classList.add("message");

    div.classList.add(sender);

    div.innerText = text;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}

async function sendMessage(){

    const input = document.getElementById("message");

    const text = input.value.trim();

    if(text==="") return;

    addMessage(text,"user");

    messages.push({

        role:"user",

        content:text

    });

    input.value="";

    try{

        const response = await fetch(API,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                messages:messages

            })

        });

        const data = await response.json();

        addMessage(data.answer,"bot");

        messages.push({

            role:"assistant",

            content:data.answer

        });

    }

    catch(error){

        addMessage("Не удалось подключиться к серверу.","bot");

    }

}

document.getElementById("message").addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});

window.onload=function(){

    addMessage("Здравствуйте! 👋 Я AI-помощник Codify. Задайте вопрос о школе, курсах или преподавателях.","bot");

}