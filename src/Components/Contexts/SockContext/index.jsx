import { createContext, useContext, useEffect } from 'react';
import { useCallback, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);

  const connect = useCallback((onMessageReceived) => {
    const socket = new SockJS('http://42.118.207.86:8080/websocket/chat');
    const stompClient = Stomp.over(socket, { protocols: ['v12.stomp'] });
    stompClient.versions = { versions: ['1.1', '1.2'] };

    stompClient.connect(
      {},
      (frame) => {
        console.log('Connected: ' + frame);
        setIsConnected(true);
        stompClient.subscribe('/topic/chatAll', (message) => {
          onMessageReceived(message);
        });
      },
      (error) => {
        console.log('Connection error: ' + error);
        setIsConnected(false);
      }
    );
    stompClientRef.current = stompClient;
  }, []);

  const disconnect = useCallback(() => {
    if (stompClientRef.current && isConnected) {
      stompClientRef.current.disconnect(() => {
        console.log('Disconnected');
        setIsConnected(false);
      });
    }
  }, [isConnected]);

  const sendMessage = useCallback(
    (payload) => {
      if (stompClientRef.current && isConnected) {
        stompClientRef.current.send(
          '/app/chat.sendMessage',
          JSON.stringify(payload),
          {}
        );
      } else {
        console.error(
          'Cannot send message. Connection has not been established.'
        );
      }
    },
    [isConnected]
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <WebSocketContext.Provider
      value={{ connect, disconnect, sendMessage, isConnected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
