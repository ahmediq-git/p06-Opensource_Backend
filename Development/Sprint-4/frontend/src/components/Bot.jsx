import config from '../bot/config.js';
import MessageParser from '../bot/MessageParser.jsx';
import ActionProvider from '../bot/ActionProvider.jsx';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

export default function Bot() {
  return (
    <div className='text-black text-xl font-semibold'>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
};