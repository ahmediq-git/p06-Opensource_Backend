import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
    const handleHello = () => {
      const botMessage = createChatBotMessage('Hello. Nice to meet you.');
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    };

    const handleCreateCollection = () => {
        const botMessage = createChatBotMessage('Press the New Collection button to add a collection. Add a name, press create and Voila!');
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
    };

    const handleAddRecord = () => {
        const botMessage = createChatBotMessage('Click a collection, press New Document, insert fields and values, press create and a new document will be created.');
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
    };

    const handleDatabaseIcon = () => {
        const botMessage = createChatBotMessage('The DB icon takes you to the collections and documents CRUD page.');
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
    };

    const handleDataReceivedSent = () => {
        const botMessage = createChatBotMessage('Data received and sent show bytes sent to the server and received from the server.');
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
    };

    const handleDeleteCollection = () => {
        const botMessage = createChatBotMessage('Click a collection, press the trash icon in the top right and the collection will be deleted.');
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
    };

    const handleLogs = () => {
        const botMessage = createChatBotMessage('Logs show the time taken for REST requests to return with a response.');
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
    };

    const handleRecordFieldTypes = () => {
        const botMessage = createChatBotMessage('Field types include numbers, booleans, arrays, objects and string.');
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
    };
  
    return (
      <div>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            actions: {
              handleHello,
              handleCreateCollection,
              handleAddRecord,
              handleDatabaseIcon,
              handleDataReceivedSent,
              handleDeleteCollection,
              handleLogs,
              handleRecordFieldTypes,
            },
          });
        })}
      </div>
    );
  };
  
  export default ActionProvider;