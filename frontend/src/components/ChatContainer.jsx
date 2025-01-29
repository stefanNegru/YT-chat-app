import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useChatBotStore } from "../store/useChatBotStore";

import React, { useState } from "react";
import styled from "styled-components";
import "./style.css";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,
    deleteMessage,
  } = useChatStore();

  const {
    history,
    getHistory,
    sendMessageToGeminiAi,
    subscribeToGaminiAiMessages,
    unsubscribeFromGaminiAiMessages,
  } = useChatBotStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [text, setText] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    console.log("history: ", history);
    try {
      if (selectedUser.fullName === "John Doe") {
        await sendMessageToGeminiAi({
          prompt: text.trim(),
        });
      } else {
        await sendMessage({
          text: text.trim(),
        });
      }

      // Clear form
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    getMessages(selectedUser._id);
    getHistory();
    subscribeToMessages();
    //subscribeToGaminiAiMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    getHistory();
  }, []);

  /*useEffect(() => {
    subscribeToGaminiAiMessages();
    getHistory();

    return () => unsubscribeFromGaminiAiMessages();
  }, [
    selectedUser._id,
    subscribeToGaminiAiMessages,
    getHistory,
    unsubscribeFromGaminiAiMessages,
  ]);*/

  useEffect(() => {
    if (messageEndRef.current && (messages || history)) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, history]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const firstExample = (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );

  const secondExample = (
    <div className="chat-container">
      <ChatHeader />
      {selectedUser.fullName !== "John Doe" ? (
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`message ${
                message.senderId === authUser._id ? "you" : "other"
              }`}
            >
              <img
                src={
                  message.senderId === authUser._id
                    ? authUser.profilePic
                    : selectedUser.profilePic
                }
                alt={`${message.senderId} avatar`}
                className="avatar"
              />
              {message.text}
              {/*<i className="bi bi-three-dots-vertical"></i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-three-dots-vertical"
              viewBox="0 0 16 16"
              onClick={() => deleteMessage(message._id)}
            >
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
            </svg>*/}
              <button
                className="hover-button"
                onClick={() => deleteMessage(message._id)}
              >
                delete
              </button>

              <div className="hover-container">
                <span className="hover-text">Hover over this text</span>
                <button
                  className="hover-button"
                  onClick={() => deleteMessage(message._id)}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      ) : (
        <div key="2" className="messages-container">
          {history.map((message) => (
            <div
              key={message._id}
              className={`message ${message.role === "user" ? "you" : "other"}`}
            >
              <img
                src={
                  message.senderId === authUser._id
                    ? authUser.profilePic
                    : selectedUser.profilePic
                }
                alt={`${message.senderId} avatar`}
                className="avatar"
              />
              {message.parts?.[0]?.text || "No content available"}
              {/*<i className="bi bi-three-dots-vertical"></i>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-three-dots-vertical"
            viewBox="0 0 16 16"
            onClick={() => deleteMessage(message._id)}
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          </svg>*/}
              <button
                className="hover-button"
                onClick={() => deleteMessage(message._id)}
              >
                delete
              </button>

              <div className="hover-container">
                {/*<span className="hover-text">Hover over this text</span>*/}
                <button
                  className="hover-button"
                  onClick={() => deleteMessage(message._id)}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      )}

      <div className="input-container">
        <input
          type="text"
          className="message-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );

  return secondExample;
};
export default ChatContainer;
