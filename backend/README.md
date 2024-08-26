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
    "role": "Patient",
    "age": "10",
    "medicalHistory": "medical issues"
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

Here is the documentation for the `addDoctorToPatient` API with the updated implementation:

---

### **Add Doctor to Patient**

**Endpoint:** `POST /patients/adddoctor/:doctorId`

**Description:**
This endpoint allows a patient to add a doctor to their list of doctors. It also adds the patient to the doctor's list of patients. The patient's ID is retrieved from the session, while the doctor's ID is provided as a URL parameter.

**Request:**

- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`

- **URL Parameters:**
  - `doctorId` (String, Required): The unique identifier of the doctor.

- **Session:**
  - `req.session.user.userId` (String, Required): The unique identifier of the patient, stored in the session.



**Responses:**

- **200 OK:**
  - **Description:** The doctor has been successfully added to the patient's list of doctors, and the patient to the doctor's list of patients.
  - **Response Example:**
    ```json
    {
      "message": "Doctor added to patient successfully"
    }
    ```

- **400 Bad Request:**
  - **Description:** The doctor is already assigned to the patient, or there is an issue with the request.
  - **Response Example:**
    ```json
    {
      "message": "Doctor is already assigned to this patient"
    }
    ```

- **404 Not Found:**
  - **Description:** The specified patient or doctor could not be found in the database.
  - **Response Example:**
    ```json
    {
      "error": "Patient not found"
    }
    ```
    or
    ```json
    {
      "error": "Doctor not found"
    }
    ```

- **500 Internal Server Error:**
  - **Description:** An error occurred on the server while processing the request.
  - **Response Example:**
    ```json
    {
      "error": "An unexpected error occurred"
    }
    ```

Here is the detailed documentation for both the "Remove Patient from Doctor" and "Get All Patients of a Doctor" APIs:

---

### **Remove doctor from patient**

**Endpoint:** `DELETE /patients/removedoctor/:doctorId`

**Description:**
This endpoint allows a patient to remove a doctor from their list of assigned doctors. The patient's ID is retrieved from the session, and the doctor's ID is provided as a URL parameter.

**Request:**

- **Method:** `DELETE`

- **URL Parameters:**
  - `doctorId` (String, Required): The unique identifier of the patient to be removed.

- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (if authentication is required)

- **Session:**
  - `req.session.user.userId` (String, Required): The unique identifier of the patient, stored in the session.


**Responses:**

- **200 OK:**
  - **Description:** The doctor was successfully removed from the patient's list.
  - **Response Example:**
    ```json
    {
      "message": "doctor removed from patient's list successfully"
    }
    ```

- **404 Not Found:**
  - **Description:** The doctor or patient could not be found in the database.
  - **Response Example:**
    ```json
    {
      "error": "Patient or Doctor not found"
    }
    ```

- **400 Bad Request:**
  - **Description:** The doctor is not assigned to the patient.
  - **Response Example:**
    ```json
    {
      "error": "Doctor is not assigned to this patient"
    }
    ```

- **500 Internal Server Error:**
  - **Description:** An error occurred on the server while processing the request.
  - **Response Example:**
    ```json
    {
      "error": "An unexpected error occurred"
    }
    ```

---

### **Get All Patients of a Doctor**

**Endpoint:** `GET doctors/patients`

**Description:**
This endpoint allows a doctor to retrieve a list of all patients assigned to them. The doctor's ID is retrieved from the session.

**Request:**

- **Method:** `GET`

- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (if authentication is required)

- **Session:**
  - `req.session.user.userId` (String, Required): The unique identifier of the doctor, stored in the session.


**Responses:**

- **200 OK:**
  - **Description:** The list of patients assigned to the doctor is returned successfully.
  - **Response Example:**
    ```json
    [
      {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "gender": "male",
        "contactInfo": "123-456-7890"
      },
      {
        "name": "Jane Smith",
        "email": "janesmith@example.com",
        "gender": "female",
        "contactInfo": "098-765-4321"
      }
    ]
    ```

- **404 Not Found:**
  - **Description:** The doctor could not be found in the database.
  - **Response Example:**
    ```json
    {
      "error": "Doctor not found"
    }
    ```

- **500 Internal Server Error:**
  - **Description:** An error occurred on the server while processing the request.
  - **Response Example:**
    ```json
    {
      "error": "An unexpected error occurred"
    }
    ```


---