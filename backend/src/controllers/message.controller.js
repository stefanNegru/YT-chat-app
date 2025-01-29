import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import History from "../models/history.model.js"

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessageToGeminiAi = async (req, res) => {
  const { prompt } = req.body
  //const senderId = req.user._id;

  const history = await History.find({}).select("-_id");

  console.log("HISTORY: ")
  console.log(history)

  const chat = model.startChat({
    history: history
  });

  const result = await chat.sendMessage(prompt);
  const messageFromUser = new History({
    role: "user",
    parts: [{ text: prompt }],

  })
  await messageFromUser.save()

  const newMessage = new History({
    role: "model",
    parts: [{ text: result.response.text() }],

  })
  await newMessage.save()

  //io.to(senderId).emit("newMessageFromAi", newMessage);
  console.log('newMessage----------------', newMessage)
  res.status(201).json({
    userMessage: messageFromUser,
    aiMessage: newMessage,
  });

};

export const getHistory = async (req, res) => {
  try {
    const history = await History.find({});
    res.status(200).json(history);
  } catch (error) {
    console.error("Error in getHistory:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteMessage = async (req, res) => {
  //const senderId = req.user._id
  /*
    if(!senderId) {
      return res.status(400).json({message: "User ID required"})
    }*/
  const { id } = req.params
  console.log("this is message ID ", id)
  //console.log("this is message senderID ", senderId)

  if (!id) {
    return res.status(400).json({ message: "Message ID Required" })
  }

  const message = await Message.findById(id)

  const result = await message.deleteOne()

  //const reply = `Message with ID ${result._id} was deleted`

  //console.log(reply)
  res.json({ message })

}
