import axios from 'axios';

let authenticated = false;
let currentUser = null;

// Check if authenticated
export const isAuthenticated = async () => {
  try {
    const response = await fetch(`${process.env.API_BASE}/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies (including the session token) are sent with the request
    });

    if (response.status === 200) {
      const user = await response.json();
      authenticated = true;
      currentUser = user;
      return true; // Session is valid
    } else {
      authenticated = false;
      currentUser = null;
      return false; // Session is not valid
    }
  } catch (error) {
    console.error("Error checking session:", error);
    authenticated = false;
    currentUser = null;
    return false;
  }
};


// Login function
export const login = async (email, password) => {
  console.log(process.env.API_BASE);
  const response = await fetch(`${process.env.API_BASE}/login`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      credentials: "include", // to send HTTP-only cookies

      body: JSON.stringify({ email, password }), // Send email and password in the body
  });

  if (!response.ok) {
      throw new Error("Email or password is not correct");
  }

  const user = await response.json();

  console.log(user);

  if (user) {
      authenticated = true;
      currentUser = user;
      return {
          ...currentUser, 
          role: user.role, 
          name: user.name, 
      };
  } else {
      authenticated = false;
      currentUser = null;
      throw new Error("Email or password is not correct");
  }
};

// Get current user function
export const getCurrentUser = () => {
  return currentUser;
};

export const registerPatient = async (patientData) => {
  const response = await fetch(`${process.env.API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
    credentials: "include", // to send HTTP-only cookies
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Network response was not ok");
  }

  return response.json();
};

// Logout function
export const logout = async () => {
    const response = await fetch(`${process.env.API_BASE}/logout`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // to send HTTP-only cookies
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
    }

    authenticated = false;
    currentUser = null;

    return response.json();
};



// Get patient profile function
export const getPatientProfile = async () => {
    const response = await fetch(`${process.env.API_BASE}/profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Important: This ensures cookies are sent
    });

    if (!response.ok) {
        return null; // No profile found or error occurred
    }

    const profile = await response.json();
    return profile;
};

// Save patient profile function
export const savePatientProfile = async (profile) => {
  const response = await fetch(`${process.env.API_BASE}/profile`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      credentials: "include", // to send HTTP-only cookies
      body: JSON.stringify(profile),
  });

  if (!response.ok) {
      throw new Error("Failed to update patient profile");
  }

  const updatedProfile = await response.json();
  return updatedProfile;
};

// Save doctor profile function
export const saveDoctorProfile = async (profile) => {
  const response = await fetch(`${process.env.API_BASE}/profile`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      credentials: "include", // to send HTTP-only cookies
      body: JSON.stringify(profile),
  });

  if (!response.ok) {
      throw new Error("Failed to update doctor profile");
  }

  const updatedProfile = await response.json();
  return updatedProfile;
};

// Register doctor function
export const registerDoctor = async (doctorData) => {
    const response = await fetch(`${process.env.API_BASE}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
        credentials: "include", // Important: This ensures cookies are sent
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
    }

    return response.json();
};

// Get doctors by department function
export const getDoctorsByDepartment = async (department) => {
    const response = await fetch(`${process.env.API_BASE}/doctors/department/${encodeURIComponent(department)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Important: This ensures cookies are sent
    });

    if (!response.ok) {
        throw new Error("Failed to fetch doctors by department");
    }

    return response.json();
};

// Get all doctors function
export const getAllDoctors = async () => {
  const response = await fetch(`${process.env.API_BASE}/doctors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // to send HTTP only cookies
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return response.json(); // The data is returned as a JSON object
};


// Profile 
export const getProfile = async () => {
  const response = await fetch(`${process.env.API_BASE}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // to send HTTP-only cookies
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const profile = await response.json();
  currentUser = profile; // Update the global state with the profile data
  return profile;
};

export const updateProfile = async (profileData) => {
  const response = await fetch(`${process.env.API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // to send HTTP-only cookies
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const updatedProfile = await response.json();
  currentUser = updatedProfile; // Update the global state with the updated profile data
  return updatedProfile;
};

// Files upload and delete
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${process.env.API_BASE}/files`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
  });

  if (!response.ok) {
      throw new Error('Failed to upload file');
  }

  return response.json();
};

export const getUserFiles = async () => {
  try {
    const response = await axios.get(`${process.env.API_BASE}/files`, { withCredentials: true });

    if (response.status !== 200) {
      throw new Error('Failed to fetch files');
    }

    return response.data; // Axios stores the data in response.data
  } catch (error) {
    throw new Error('Failed to fetch files');
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await axios.delete(`${process.env.API_BASE}/files/${fileId}`, { withCredentials: true });

    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error.response?.data || error.message);
    throw new Error('Failed to delete file');
  }
};

export const addDoctorToPatient = async (doctorId) => {
  try {
    const response = await axios.post(
      `${process.env.API_BASE}/patients/adddoctor/${doctorId}`,
      {},
      { withCredentials: true } // Ensure cookies (including the session token) are sent with the request
    );
    if (response.status !== 200) {
      throw new Error('Failed to add doctor to patient');
    }

    return response.data; // Return the server response
  } catch (error) {
    // Check if the error message is about the doctor being already added
    if (error.response && error.response.data && error.response.data.message === "Doctor is already assigned to this patient") {
      throw new Error("Doctor is already added to your list");
    } else {
      console.error('Error adding doctor to patient:', error.response?.data || error.message);
      throw new Error('Failed to add doctor to patient');
    }
  }
};


export const removeDoctorFromPatient = async (doctorId) => {
  try {
    const response = await axios.delete(
      `${process.env.API_BASE}/patients/removedoctor/${doctorId}`,
      { withCredentials: true }
    );

    if (response.status !== 200) {
      throw new Error('Failed to remove doctor from patient');
    }

    return response.data; // Return the server response
  } catch (error) {
    console.error('Error removing doctor from patient:', error.response?.data || error.message);
    throw new Error('Failed to remove doctor from patient');
  }
};



export const getPatientDoctors = async () => {
  try {
    // Fetch all doctors
    const allDoctorsResponse = await fetch(`${process.env.API_BASE}/doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!allDoctorsResponse.ok) {
      throw new Error("Failed to fetch all doctors");
    }

    const allDoctorsData = await allDoctorsResponse.json();

    // Flatten the structure to get a single array of all doctors
    const allDoctorsArray = Object.entries(allDoctorsData).flatMap(([department, doctors]) =>
      doctors.map(doctor => ({ ...doctor, department }))
    );

    // Fetch the patient's profile to get their doctors' IDs
    const profile = await getPatientProfile();

    if (!profile) {
      throw new Error("Failed to fetch patient profile");
    }

    const patientDoctorsIds = profile.doctors || [];

    // Filter doctors to get only those in the patient's list
    const patientDoctors = allDoctorsArray.filter((doctor) =>
      patientDoctorsIds.includes(doctor.id) // Use `id` instead of `_id` based on your response
    );

    return patientDoctors;
  } catch (error) {
    console.error("Error fetching doctors from profile:", error);
    throw new Error("Failed to fetch doctors from profile");
  }
};

export const getDoctorPatients = async () => {
  try {
    const response = await axios.get(`${process.env.API_BASE}/doctors/patients`, {
      withCredentials: true, // Ensure cookies (including the session token) are sent with the request
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch patients');
    }

    return response.data; // Return the list of patients with their files
  } catch (error) {
    console.error('Error fetching patients:', error.response?.data || error.message);
    throw new Error('Failed to fetch patients');
  }
};
