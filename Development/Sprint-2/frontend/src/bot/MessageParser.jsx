import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message.includes('hello')) {
      actions.handleHello();
    }
    else if (/(add|make|insert)\s+collection/i.test(message)) {
      actions.handleCreateCollection();
    }
    else if (/delete\s+collection/i.test(message)) {
      actions.handleDeleteCollection();
    }
    else if (/add\s+record/i.test(message)) {
      actions.handleAddRecord();
    }
    else if (/record\s+field\s+types/i.test(message)) {
      actions.handleRecordFieldTypes();
    }
    else if (/side\s+rail/i.test(message)) {
      actions.handleSideRail();
    }
    else if (/db\s+icon/i.test(message)) {
      actions.handleDatabaseIcon();
    }
    else if (/logs/i.test(message)) {
      actions.handleLogs();
    }
    else if (/data\s+(received|sent)/i.test(message)) {
      actions.handleDataReceivedSent();
    }
    else if (/realtime\s+collection/i.test(message)) {
      actions.handleRealtimeCollection();
    }
    else if (/functions/i.test(message) | /play/i.test(message)) {
      actions.handleFunctions();
    }
    else if (/edit|change\s+(doc|document)|edit\s+record/i.test(message)) {
      actions.handleDocEdit();
    }
    else if (/who\s+are\s+you|what\s+are\s+you|what\s+is\s+your\s+name|your\s+name/i.test(message)) {
      actions.handleIdentityInquiry();
    }
    else {
      actions.handleElse(message);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;
