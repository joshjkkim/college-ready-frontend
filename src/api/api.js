// api.js
import axios from "axios";
import { auth } from "../firebase.js"

const apiLink = "https://dumdum.work"

axios.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
  };
// Function to search for a college
export const searchCollege = async (collegeName) => {

    try {
      const response = await axios.get(
        `${apiLink}/search-college`, 
        {
          params: { name: collegeName }, // Using params to send query parameters
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      // Make sure the backend response is structured properly
      if (response.data.message === "College found") {
        return { success: true, data: response.data.data }; // Return success and data if found
      } else {
        return { success: false, message: "College not found" };
      }
    } catch (error) {
      console.error("Error searching college:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };
  
  

// Function to add a new college
export const addCollege = async (collegeName) => {
  try {
    const response = await axios.post(
      `${apiLink}/add-college`, // Your add college endpoint
      { name: collegeName },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding college:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};



// Main function to handle both actions (search and add)
// api.js
export const handleCollegeSearchOrAdd = async (collegeName) => {
    // Attempt to search for the college first
    const searchResult = await searchCollege(collegeName);
  
    if (searchResult.success) {
      // College is found, return the data
      const message = searchResult.data ? "College found" : "College found, but no data available";
      return {
        success: true,
        message: message,
        data: searchResult.data || {}, // Return empty object if no data
      };
    } 
  
    // College not found, proceed to add it
    const addResult = await addCollege(collegeName);
    
    if (addResult.success) {
      // After adding, re-fetch to get the complete data
      return handleCollegeSearchOrAdd(collegeName); 
    } else {
      // Adding failed, return the error
      return { success: false, message: addResult.message };
    }
  };

  export const addUserCollege = async (collegeName) => {
    const userId = getUserId();
    if (!userId) {
      console.error("User not authenticated");
      return { success: false, message: "User not authenticated" };
    }
  
    try {
      const response = await axios.post(
        `${apiLink}/add-user-college`, // New endpoint for adding to userColleges
        { userId, collegeName }, // Send both userId and collegeName
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        return { success: true, message: "College added to your profile", data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
  
    } catch (error) {
      console.error("Error adding college to user's profile:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  export const addNote = async (note) => {
    const userId = getUserId();
    if (!userId) {
      console.error("User not authenticated");
      return { success: false, message: "User not authenticated" };
    }
  
    try {
      const response = await axios.post(
        `${apiLink}/add-note`, // New endpoint for adding to userColleges
        { userId, note }, // Send both userId and collegeName
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        return { success: true, message: "Note Added to Profile", data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
  
    } catch (error) {
      console.error("Error adding note to user's profile:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  export const removeUserCollege = async (collegeName) => {
    const userId = getUserId();
    if (!userId) {
        console.error("User not authenticated");
        return { success: false, message: "User not authenticated" };
    }

    try {
        const response = await axios.post(
            `${apiLink}/remove-user-college`, // New endpoint for removing from userColleges
            { userId, collegeName }, // Send both userId and collegeName
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.data.success) {
            return { success: true, message: "College removed from your profile", data: response.data.data };
        } else {
            return { success: false, message: response.data.message };
        }

    } catch (error) {
        console.error("Error removing college from user's profile:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const removeNote = async (noteTitle) => {
  const userId = getUserId();
  if (!userId) {
      console.error("User not authenticated");
      return { success: false, message: "User not authenticated" };
  }

  try {
      const response = await axios.post(
          `${apiLink}/remove-note`, // New endpoint for removing from userColleges
          { userId, noteTitle }, // Send both userId and collegeName
          {
              headers: {
                  "Content-Type": "application/json",
              },
          }
      );

      if (response.data.success) {
          return { success: true, message: "Note removed from your profile", data: response.data.data };
      } else {
          return { success: false, message: response.data.message };
      }

  } catch (error) {
      console.error("Error removing note from user's profile:", error);
      return { success: false, message: error.response?.data?.message || error.message };
  }
};

  
  export const getCollegesForUser = async (userId) => {
    try {
      const response = await axios.get(
        `${apiLink}/get-user-colleges`,
        {
          params: { userId }, // Using params to send userId
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      // Check the backend response for success
      if (response.data.message === "Colleges Found For User") {
        return { success: true, data: response.data.colleges, message: response.data.message }; // Corrected access to 'colleges'
      } else {
        return { success: false, message: "Colleges not found for user" };
      }
    } catch (error) {
      console.error("Error fetching college:", error);
      throw error;
    }
  };

  export const getNotesForUser = async (userId) => {
    try {
      const response = await axios.get(
        `${apiLink}/get-notes`,
        {
          params: { userId }, // Using params to send userId
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data.message === "Notes Found For User") {
        return { success: true, data: response.data.notes, message: response.data.message }; 
      } else {
        return { success: false, message: "Notes not found for user" };
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw error;
    }
  };

  export const getCollegeChecklist = async (userId, collegeName) => {
    try {
      const response = await axios.get(`${apiLink}/get-college-checklist`, {
        params: { userId, collegeName },
      });
      if (response.data.message === "Checklist found") {
        return { success: true, data: response.data.checklist, message: response.data.message }; // Corrected access to 'colleges'
      } else {
        return { success: false, message: "Colleges not found for user" };
      }
    } catch (error) {
      console.error("Error fetching college checklist:", error);
      throw error;
    }
  };

  export const getDeadlinesForUser = async (userId) => {
    try {
      const response = await axios.get(`${apiLink}/get-deadlines`, {
        params: { userId },
      });
      if (response.data.message === "Deadlines found") {
        return { success: true, data: response.data.deadlines, message: response.data.message }; // Corrected access to 'colleges'
      } else {
        return { success: false, message: "Deadlines not found for user" };
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
      throw error;
    }
  };

  export const updateChecklist = async (userId, collegeName, section, itemIndex, completed, checklist) => {
    try {
      const requestData = checklist
        ? { // If the checklist is provided, update the whole checklist
            userId,
            collegeName,
            checklist, // Send the entire checklist
          }
        : { // If the checklist isn't provided, update just the specific item
            userId,
            collegeName,
            section,
            itemIndex,
            completed,
          };
  
      const response = await axios.post(`${apiLink}/update-checklist`, requestData);
      
      return response.data; // { success: true, message: "Checklist updated successfully." }
    } catch (error) {
      console.error("Error updating checklist:", error);
      return { success: false, message: "Failed to update checklist." };
    }
  };

  export const updateNote = async (userId, noteTitle, noteContent) => {
    try {
      const response = await axios.post(
        `${apiLink}/update-note`, // New endpoint for removing from userColleges
        { userId, noteTitle, noteContent }, // Send both userId and collegeName
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (response.data.success) {
      return { success: true, message: "Note updated successfully", data: response.data.data };
    } else {
        return { success: false, message: response.data.message };
    }
    } catch (error) {
      console.error("Error updating checklist:", error);
      return { success: false, message: "Failed to update note." };
    }
  };

  export const getCollegeResourcesDemographics = async (userId, collegeName) => {
    try {
      const response = await axios.get(`${apiLink}/get-college-resources-demographics`, {
        params: { userId, collegeName },
      });
      if (response.data.message === "Resources and Demographics found") {
        return { success: true, resources: response.data.resources, demographics: response.data.demographics, message: response.data.message }; // Corrected access to 'colleges'
      } else {
        return { success: false, message: "Colleges not found for user" };
      }
    } catch (error) {
      console.error("Error fetching college resources:", error);
      throw error;
    }
  };

  export const getMajorStats = async (collegeName, major) => {
    try {
      const response = await axios.get(
        `${apiLink}/get-major-profile`, // Replace with your backend endpoint
        {
          params: { collegeName, major }, // Send collegeName and major as query parameters
        }
      );
  
      // Check the backend response for success
      if (response.data.message === "Major Stats Found") {
        return { success: true, data: response.data.data, message: response.data.message };
      } else {
        return { success: false, message: "Major stats not found for the given college and major" };
      }
    } catch (error) {
      console.error("Error fetching major stats:", error);
      throw error;
    }
  };

  export const getCollegesForEssays = async () => {
    try {
      const response = await axios.get(`${apiLink}/get-colleges-essays`, {
      });
  
      if (response.data.success) {
        return { success: true, data: response.data.colleges, message: "Colleges retrieved successfully" };
      } else {
        return { success: false, message: "No prompts found for the given college" };
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
      throw error;
    }
  };
  
  export const getPrompts = async (collegeName) => {
    try {
      const response = await axios.get(`${apiLink}/get-prompts`, {
        params: { collegeName },
      });
  
      if (response.data.success) {
        return { success: true, data: response.data.prompts, message: "Prompts retrieved successfully" };
      } else {
        return { success: false, message: "No prompts found for the given college" };
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
      throw error;
    }
  };
  
  export const getEssays = async (collegeName, prompt) => {
    try {
      const response = await axios.get(`${apiLink}/get-essays`, {
        params: { collegeName, prompt },
      });
  
      if (response.data.success) {
        return { success: true, data: response.data.essays, message: "Essays retrieved successfully" };
      } else {
        return { success: false, message: "No essays found for the given prompt" };
      }
    } catch (error) {
      console.error("Error fetching essays:", error);
      throw error;
    }
  };
  
export const getMajorSuggestions = async (query) => {
  try {
    const response = await axios.get(`${apiLink}/get-major-suggestions`, {
      params: { query }, 
    });

    if (response.data.message === "Suggestions found") {
      return { success: true, data: response.data.suggestions, message: response.data.message };
    } else {
      return { success: false, message: "No suggestions found" };
    }
  } catch (error) {
    console.error("Error fetching major suggestions:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getCollegeSuggestions = async (query) => {
  try {
    const response = await axios.get(`${apiLink}/get-college-suggestions`, {
      params: { query }, 
    });

    if (response.data.message === "Suggestions found") {
      return { success: true, data: response.data.suggestions, message: response.data.message };
    } else {
      return { success: false, message: "No suggestions found" };
    }
  } catch (error) {
    console.error("Error fetching major suggestions:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getStaffRoles = async (userId) => {
  try {
    const response = await axios.get(`${apiLink}/get-staff-roles`, {
      params: { userId }, 
    });

    if (response.data.message === "Staff Role Found for User") {
      return { success: true, data: response.data.role, message: response.data.message };
    } else {
      return { success: false, message: "No Staff Roles Found" };
    }
  } catch (error) {
    console.error("Error fetching major suggestions:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getAdminMetrics = async (userId) => {
  try {
    const response = await axios.get(`${apiLink}/admin/metrics`, {
      params: { userId },
    });
    if (response.data.success) {
      return { success: true, metrics: response.data.metrics };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};


// Function to get a list of all colleges (admin view)
export const getAdminColleges = async (userId) => {
  try {
    const response = await axios.get(`${apiLink}/admin/colleges`, {
      params: { userId },
    });
    if (response.data.success) {
      return { success: true, colleges: response.data.colleges };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error fetching admin colleges:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Function to get a list of all staff members (admin view)
export const getAdminStaff = async (userId) => {
  try {
    const response = await axios.get(`${apiLink}/admin/staff`, {
      params: { userId },
    });
    if (response.data.success) {
      return { success: true, staff: response.data.staff };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error fetching admin staff:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// NEW: Function to get a list of all major colleges (admin view)
export const getAdminMajorColleges = async (userId) => {
  try {
    const response = await axios.get(`${apiLink}/admin/major-colleges`, {
      params: { userId },
    });
    if (response.data.success) {
      return { success: true, majorColleges: response.data.majorColleges };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error fetching admin major colleges:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// NEW: Function to get a list of all user colleges (admin view)
export const getAdminUserColleges = async (userId) => {
  try {
    const response = await axios.get(`${apiLink}/admin/user-colleges`, {
      params: { userId },
    });
    if (response.data.success) {
      return { success: true, userColleges: response.data.userColleges };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error fetching admin user colleges:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// NEW: Function to get profile notes for all users (admin view)
export const getAdminProfileNotes = async (userId) => {
  try {
    const response = await axios.get(`${apiLink}/admin/profile-notes`, {
      params: { userId },
    });
    if (response.data.success) {
      return { success: true, profileNotes: response.data.profileNotes };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error fetching admin profile notes:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};
