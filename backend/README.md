# My Doctor API

## Endpoints

### User Endpoints

#### Register as a Patient
- **POST** `http://localhost:5000/api/v1/register`
- **Description**: Register a new patient with the provided details.
- **Body** (raw JSON):
  ```json
  {
    "email": "mina5040d@gmail.com",
    "password": "123",
    "name": "mina",
    "contactInfo": "01275418647",
    "gender": "male",
    "role": "Patient"
  }
  ```

#### Register as a Doctor
- **POST** `http://localhost:5000/api/v1/register`
- **Description**: Register a new doctor with the provided details.
- **Body** (raw JSON):
  ```json
  {
    "email": "docd58500@gmail.com",
    "password": "123",
    "department": "Pediatrics",
    "gender": "male",
    "yearsOfExperience": 10,
    "medicalLicenceNumber": 12345,
    "contactInfo": "0127458963",
    "name": "doc mina",
    "role": "Doctor"
  }
  ```

#### Log In as a User
- **POST** `http://localhost:5000/api/v1/login`
- **Description**: Authenticate a user with their email and password.
- **Body** (raw JSON):
  ```json
  {
    "email": "mina5040d@gmail.com",
    "password": "123"
  }
  ```

#### Get Current User
- **GET** `http://localhost:5000/api/v1/current`
- **Description**: Retrieve information about the currently logged-in user.

#### Get Current Profile
- **GET** `http://localhost:5000/api/v1/profile`
- **Description**: Retrieve the profile details of the currently logged-in user.

#### Edit Profile
- **PUT** `http://localhost:5000/api/v1/profile`
- **Description**: Update the profile details of the currently logged-in user.
- **Body** (raw JSON):
  ```json
  {
    "name": "mina safwat 12"
  }
  ```

#### Check Session
- **GET** `http://localhost:5000/api/v1/session`
- **Description**: Check the validity of the current user session.

#### Log Out
- **GET** `http://localhost:5000/api/v1/logout`
- **Description**: Log out the currently logged-in user and invalidate the session.

#### Remove User
- **DELETE** `http://localhost:5000/api/v1/delete`
- **Description**: Remove the currently logged-in user from the system.
- **Response:**
  - Confirmation message of user removal.





## File Management Endpoints
This APIS allows users to upload, retrieve, and delete files from an S3 bucket. It supports different file types such as images, PDFs, and other files.

### 1. Upload a File

- **POST** `/api/v1/files`
- **Description**: Upload a file to the server and store it in an S3 bucket.
- **Body:** 
  - `form-data`: 
    - `file`: Select the file from your local system.

**Example Request:**
```sh
POST /api/v1/files
Body (form-data):
file: /home/mina/Downloads/last_cv/Mina-Safwat-Samy_Resume1.pdf
```

### 2. Get All User Files

- **GET** `/api/v1/files`
- **Description**: Retrieve all files uploaded by the user.

**Example Request:**
```sh
GET /api/v1/files
```

### 3. Get All User Images

- **GET** `/api/v1/files/images`
- **Description**: Retrieve all image files uploaded by the user.

**Example Request:**
```sh
GET /api/v1/files/images
```

### 4. Get All User PDFs

- **GET** `/api/v1/files/pdfs`
- **Description**: Retrieve all PDF files uploaded by the user.

**Example Request:**
```sh
GET /api/v1/files/pdfs
```

### 5. Get All Other Files

- **GET** `/api/v1/files/others`
- **Description**: Retrieve all other file types (non-images, non-PDFs) uploaded by the user.

**Example Request:**
```sh
GET /api/v1/files/others
```

### 6. Delete a File

- **DELETE** `/api/v1/files/:fileId`
- **Description**: Delete a file by its ID.
- **Parameters:**
  - `fileId`: The ID of the file to delete.

**Example Request:**
```sh
DELETE /api/v1/files/66c85e5dfd4b006c3221a15d
```
