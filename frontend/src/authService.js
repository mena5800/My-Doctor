let authenticated = false;
let currentUser = null;

// Login function
export const login = async (email, password) => {
  console.log(process.env.API_BASE);
  const response = await fetch(`${process.env.API_BASE}/login`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      credentials: "include", // to send HTTP only cookies

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
      body: JSON.stringify({
          name: patientData.name,
          email: patientData.email,
          password: patientData.password,
          role: patientData.role,
          age: patientData.age,
          gender: patientData.gender,
          medicalHistory: patientData.medicalHistory,
      }),
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

// Check if authenticated
export const isAuthenticated = () => {
    return new Promise((resolve) => {
        resolve(authenticated);
    });
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
export const saveUserProfile = async (profile) => {
    const response = await fetch(`${process.env.API_BASE}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
    });

    if (!response.ok) {
        throw new Error("Failed to save patient profile");
    }

    return response.json();
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

// Profile 
export const getProfile = async () => {
  const response = await fetch(`${process.env.API_BASE}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // to send HTTP only cookies
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
    credentials: "include", // to send HTTP only cookies
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const updatedProfile = await response.json();
  currentUser = updatedProfile; // Update the global state with the updated profile data
  return updatedProfile;
};
