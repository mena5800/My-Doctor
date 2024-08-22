
# My Doctor API

## Endpoints

### User Endpoints

#### Register as a Patient
- **POST** `http://localhost:5000/api/v1/register`
- **Description**: Register a new patient with the provided details. The request body should include the patient's email, password, name, contact information, gender, and role.
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
- **Description**: Register a new doctor with the provided details. The request body should include the doctor's email, password, department, gender, years of experience, medical license number, contact information, name, and role.
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
- **Description**: Authenticate a user with their email and password. On successful login, a session token will be returned.
- **Body** (raw JSON):
  ```json
  {
    "email": "mina5040d@gmail.com",
    "password": "123"
  }
  ```

#### Get Current User
- **GET** `http://localhost:5000/api/v1/current`
- **Description**: Retrieve information about the currently logged-in user based on the session token.

#### Get Current Profile
- **GET** `http://localhost:5000/api/v1/profile`
- **Description**: Retrieve the profile details of the currently logged-in user. This endpoint returns user-specific information.

#### Edit Profile
- **PUT** `http://localhost:5000/api/v1/profile`
- **Description**: Update the profile details of the currently logged-in user. The request body can include fields such as the user's name or other modifiable information.
- **Body** (raw JSON):
  ```json
  {
    "name": "mina safwat 12"
  }
  ```

#### Check Session
- **GET** `http://localhost:5000/api/v1/session`
- **Description**: Check the validity of the current user session. This endpoint verifies if the session token is still valid and returns session details.

#### Log Out
- **GET** `http://localhost:5000/api/v1/logout`
- **Description**: Log out the currently logged-in user and invalidate the session token. This endpoint ends the user's session.
