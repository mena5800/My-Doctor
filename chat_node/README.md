# Chat API Documentation

## Overview

This API provides endpoints to manage users, chats, and messages for a chat application. It supports operations such as creating users, logging in, managing chats, and sending or retrieving messages.

## User Endpoints

### 1. Create User

- **Endpoint:** `POST /auth/register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "user2",
    "password": "testpassword"
  }
  ```
- **Response:** Success or error message.

### 2. Log In User

- **Endpoint:** `POST /auth/login`
- **Description:** Logs in an existing user.
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "password": "testpassword"
  }
  ```
- **Response:** Authentication token or error message.

### 3. Delete User

- **Endpoint:** `DELETE /users/:userId`
- **Description:** Deletes a user by their ID.
- **URL Parameter:**
  - `userId` (e.g., `66b9a8912224e3433686a4b4`)
- **Response:** Success or error message.

### 4. Get All Users

- **Endpoint:** `GET /users`
- **Description:** Retrieves a list of all users.
- **Response:** List of users.

## Chat Endpoints

### 1. Create Chat

- **Endpoint:** `POST /chat`
- **Description:** Creates a new chat with specified participants.
- **Request Body:**
  ```json
  {
    "participants": ["66b9a9d6d41488902731cf23", "66b9a9dcd41488902731cf25"]
  }
  ```
- **Response:** Chat details or error message.

### 2. Get Chat by ID

- **Endpoint:** `GET /chat/:chatId`
- **Description:** Retrieves a chat by its ID.
- **URL Parameter:**
  - `chatId` (e.g., `66b9ab10dc0bfd5e1a857ef8`)
- **Response:** Chat details.

### 3. Get Chats by User ID

- **Endpoint:** `GET /chat/user/:userId`
- **Description:** Retrieves all chats for a specific user.
- **URL Parameter:**
  - `userId` (e.g., `66b9a9d6d41488902731cf23`)
- **Response:** List of chats for the user.

## Message Endpoints

### 1. Send Message

- **Endpoint:** `POST /messages`
- **Description:** Sends a message to a chat.
- **Request Body:**
  ```json
  {
    "chatId": "66b9ab10dc0bfd5e1a857ef8",
    "senderId": "66b9a9d6d41488902731cf23",
    "content": "Hello my Friend"
  }
  ```
- **Response:** Message details or error message.

### 2. Get Messages by Chat ID

- **Endpoint:** `GET /messages/chat/:chatId`
- **Description:** Retrieves all messages in a specific chat.
- **URL Parameter:**
  - `chatId` (e.g., `66b9ab10dc0bfd5e1a857ef8`)
- **Response:** List of messages in the chat.

### 3. Edit Message

- **Endpoint:** `PUT /messages/:messageId`
- **Description:** Edits a specific message.
- **URL Parameter:**
  - `messageId` (e.g., `66b9c1f3c5fb36fe986a4ba1`)
- **Request Body:**
  ```json
  {
    "content": "test edit message api"
  }
  ```
- **Response:** Updated message details or error message.

### 4. Delete Message

- **Endpoint:** `DELETE /messages/:messageId`
- **Description:** Deletes a specific message.
- **URL Parameter:**
  - `messageId` (e.g., `66b9c0265e31cbcef9cab658`)
- **Request Body:**
  ```json
  {
    "content": "test edit message api"
  }
  ```
- **Response:** Success or error message.
