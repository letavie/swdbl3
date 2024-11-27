import { Button, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { removeDupplicate } from '../../../utils';
import { useAuthContext } from '../../Contexts/AuthContext';
import { useWebSocket } from '../../Contexts/SockContext';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 400px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  padding: 10px;
  background-color: #1890ff;
  color: white;
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ChatMessages = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eaeaea;
`;

const ChatInput = styled(Input.TextArea)`
  flex-grow: 1;
  margin-right: 10px;
`;

const SendButton = styled(Button)`
  flex-shrink: 0;
`;

const ChatBox = ({ visible, onClose, receiver }) => {
  const socket = useWebSocket();
  const auth = useAuthContext();
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState('');
  const [insideVisible, setInsideVisible] = useState(false);

  useEffect(() => {
    // Kết nối WebSocket khi component được mount
    socket?.connect?.(onMessageReceived);

    // Ngắt kết nối WebSocket khi component bị unmount
    return () => {
      socket?.disconnect?.();
    };
  }, []);

  const onMessageReceived = (res) => {
    const result = JSON.parse(res.body);

    setMessage('');

    if (auth?.user?.login === result?.receiver && !insideVisible) {
      setInsideVisible(true);
    }

    setMessageList((prev) => {
      return [...prev, result];
    });
  };

  const handleSendMessage = (payload) => {
    socket?.sendMessage?.(payload);
  };

  const handleSend = () => {
    const payload = {
      sender: auth?.user?.login,
      receiver: receiver,
      content: message.trim(),
      messageId: uuidv4(),
    };

    handleSendMessage(payload);
  };

  const handleClose = () => {
    onClose?.();
    setInsideVisible(false);
  };

  const removeDupplicateList = removeDupplicate(messageList);

  return (
    <Modal
      title='Chat'
      visible={visible || insideVisible}
      onCancel={handleClose}
      footer={null}
      width={400}
    >
      <ChatContainer>
        <ChatHeader>Chat with Tutor</ChatHeader>
        <ChatMessages>
          {removeDupplicateList.map((msg, index) => (
            <div
              style={{
                display: 'flex',
                justifyContent:
                  msg?.sender === auth?.user?.login ? 'flex-end' : 'unset',
                marginBottom: '4px',
              }}
              key={index}
            >
              <span
                style={{
                  background:
                    msg?.sender !== auth?.user?.login ? '#303030' : '#0084FF',
                  padding: '5px',
                  borderRadius: '5px',
                  color: '#fff',
                }}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </ChatMessages>
        <ChatInputContainer>
          <ChatInput
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message...'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <SendButton type='primary' onClick={handleSend}>
            Send
          </SendButton>
        </ChatInputContainer>
      </ChatContainer>
    </Modal>
  );
};

export default ChatBox;
