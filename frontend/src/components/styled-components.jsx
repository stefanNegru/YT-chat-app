const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  max-width: 600px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  padding: 16px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin: 8px 0;
  padding: 8px 12px;
  background-color: ${(props) =>
    props.sender === "You" ? "#daf7a6" : "#f1f1f1"};
  border-radius: 12px;
  align-self: ${(props) =>
    props.sender === "You" ? "flex-end" : "flex-start"};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 8px;
  border-top: 1px solid #ddd;
`;

const MessageInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-right: 8px;
`;

const SendButton = styled.button`
  padding: 10px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;
