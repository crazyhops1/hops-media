import conversationModel from "../model/conversation.model.js";
import messageModel from "../model/message.model.js";
import { io } from "../socket/socket.js";
import { onlineUsers } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    const { id } = req.params;  // Receiver's user ID
    const { message } = req.body; // Message content
    const userid = req.id;  // Sender's user ID (from authenticated user)

    // Basic validation for required fields
    if (!id || !userid || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate that the message isn't too short or too long
    if (message.length < 1 || message.length > 500) {
        return res.status(400).json({ message: 'Message must be between 1 and 500 characters long' });
    }

    try {
        // Check if a conversation already exists between the sender and receiver
        let conversation = await conversationModel.findOne({ participants: { $all: [id, userid] } });

        // If the conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = new conversationModel({
                participants: [id, userid],
                messages: []
            });
            await conversation.save();
        }

        // Create a new message
        const newMessage = new messageModel({
            sender: userid,
            receiver: id,
            message: message
        });

        // Save the new message
        await newMessage.save();

        // Add the new message ID to the conversation's messages array
        conversation.message.push(newMessage._id);
        await conversation.save();

        // Handle emitting the message to the specific user (receiver)
       
        const receiverSocketId = onlineUsers.find((item)=>item.userid===id);

        if (receiverSocketId) {
            // Emit the new message to the receiver's socket
            io.to(receiverSocketId.socketId).emit('newMessage', newMessage);
        } else {
            console.log(`Receiver with ID ${id} is not online`);
        }

        // Return success response
        return res.status(201).json({ message: 'Message sent successfully', newMessage});

    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};




export const getMessage = async (req, res) => {
    const { id } = req.params
    const  userid  = req.id

    try {
        const allmsg = await conversationModel.findOne({ participants: { $all: [id, userid] } }).populate('message')

        if (!allmsg) {
            return res.status(400).json({ message: 'message not found' })
        }
        return res.status(200).json(allmsg)

    } catch (error) {
        return res.status(500).json({ message: 'internal server error' })

    }
}


export const getAllUserByhistory = async (req, res) => {
    const  userid  = req.id

    if (!userid) {
        return res.status(400).json({ message: 'all feild are required' })
    }

    try {
        let preMsg = await conversationModel.find({ participants: { $all: [userid] } }).populate({path:"participants",select:["userName","_id","userProfile"]})
        if (!preMsg) {
            return res.status(400).json({ message: 'no history fond' })
        }

        return res.status(200).json({ data: preMsg })

    } catch (error) {
        return res.status(500).json({ message: 'internal server error', error })


    }
}