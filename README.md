# Real-Time Chat Application

A simple real-time chat application using raw WebSockets in Node.js. This application includes an admin panel to create chat rooms with configurable properties and allows users to join, chat, upvote messages, and interact in real-time.

## Features

- **Admin Room Creation**: Admin can create a new chat session/room with configurable properties.
- **User Participation**: Users can join active rooms to chat and interact.
- **Message Upvoting**: Users can upvote messages, triggering additional actions if the upvotes reach specific thresholds.
- **Admin Alerts**: Messages with high upvotes alert the admin to respond.

## Room Properties

When creating a new room, the admin can set the following properties:

- **Name**: Unique name of the chat room.
- **Start Time**: Time when the chat session is intended to start.
- **Is Open**: Boolean to indicate if the room is currently accepting participants.
- **Cool Down Time**: Time period after which the room closes for new messages.

## Upvote Logic

- Messages with more than **3 upvotes** are moved to a **Highlighted Section**.
- Messages with more than **10 upvotes** trigger an **Admin Alert** to encourage a response.

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/real-time-chat.git
   cd real-time-chat
2. **Install Dependencies**
   ```bash
   npm install

3. **Run the Application**
   ```bash
   npm start
