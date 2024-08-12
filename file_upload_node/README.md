# File Management API Using S3

This API provides endpoints for user management and file handling with AWS S3. The API allows you to create users, upload files, retrieve files, delete files, and update files.

## Endpoints

### **1. Create User**

- **URL**: `http://localhost:3000/api/users`
- **Method**: `POST`
- **Description**: Creates a new user.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Response**:
- Status: `201 Created`
- Body: JSON object with the newly created user's details.

---

### **2. Upload File**

- **URL**: `http://localhost:3000/api/upload/:userId`
- **Method**: `POST`
- **Description**: Uploads a file to S3 and associates it with a user.

**Request Parameters**:
- `userId` (in the URL) - The ID of the user who is uploading the file.

**Request Body**:
- **Form-Data**:
  - Key: `file`, Type: `File`
  - File: Choose the file to upload (e.g., `./README.md`)

**Response**:
- Status: `200 OK`
- Body: JSON object with file details.

---

### **3. Get Files by User ID**

- **URL**: `http://localhost:3000/api/files/:UserId`
- **Method**: `GET`
- **Description**: Retrieves a file from S3 based on User ID.

**Request Parameters**:
- `UserId` (in the URL) - The ID of the User to retrieve all Files.

**Response**:
- Status: `200 OK`
- Body: JSON object with file details.

---

### **4. Delete File**

- **URL**: `http://localhost:3000/api/file/:fileId`
- **Method**: `DELETE`
- **Description**: Deletes a file from S3 and removes its record from the database.

**Request Parameters**:
- `fileId` (in the URL) - The ID of the file to delete.

**Response**:
- Status: `200 OK`
- Body: JSON object with a success message.

---

### **5. Update File**

- **URL**: `http://localhost:3000/api/file/:fileId`
- **Method**: `PUT`
- **Description**: Updates a file in S3 by replacing it with a new file.

**Request Parameters**:
- `fileId` (in the URL) - The ID of the file to update.

**Request Body**:
- **Form-Data**:
  - Key: `file`, Type: `File`
  - File: Choose the new file to upload (e.g., `./README.md`)

**Response**:
- Status: `200 OK`
- Body: JSON object with updated file details.

---

## Testing with Postman

1. **Create User**:
   - Select `POST` method.
   - Set URL to `http://localhost:3000/api/users`.
   - Set `Content-Type` to `application/json`.
   - Provide JSON body to create a new user.

2. **Upload File**:
   - Select `POST` method.
   - Set URL to `http://localhost:3000/api/upload/:userId` (replace `:userId` with the actual user ID).
   - Choose `form-data` and add a file under the key `file`.

3. **Get Files**:
   - Select `GET` method.
   - Set URL to `http://localhost:3000/api/files/:UserId` (replace `:UserId` with the actual User ID).

4. **Delete File**:
   - Select `DELETE` method.
   - Set URL to `http://localhost:3000/api/file/:fileId` (replace `:fileId` with the actual file ID).

5. **Update File**:
   - Select `PUT` method.
   - Set URL to `http://localhost:3000/api/file/:fileId` (replace `:fileId` with the actual file ID).
   - Choose `form-data` and add a file under the key `file`.

