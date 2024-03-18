import { createChatBotMessage } from 'react-chatbot-kit';
let botName = 'Moiz Raza Amir'
const config = {
    botName,
    initialMessages: [createChatBotMessage(`Hi! I'm ${botName}`)],
    customStyles: {
        botMessageBox: {
        backgroundColor: 'blue',
        },
        chatButton: {
        backgroundColor: 'red',
        },
    },
};

export default config;