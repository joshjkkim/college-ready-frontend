import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.js";
import Checklist from "../components/CollegeChecklist.js";
import MajorStats from "../components/MajorStats.js";
import Resources from "../components/CollegeResources.js"
import Demographics from "../components/CollegeDemographics.js";
import { auth } from "../firebase.js";
import LoadingScreen from '../components/LoadingScreen.js'; 
import { getCollegeResourcesDemographics } from "../api/api.js";

const UserPage = () => {
  const user = auth.currentUser;
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [, setColleges] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false); // Track sidebar collapse state
  const [isEditMode, setIsEditMode] = useState(false); 
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState(null);
  const [demographics, setDemographics] = useState(null);

  const handleSelectCollege = (college) => {
    if(!isEditMode){
      setSelectedCollege(college);
      setNotification(null)
    } else {
      setNotification({
        message: "Cannot switch colleges while in edit mode!",
        type: "error",
      });
    }
    
  };

  const handleCollegeRemoved = (collegeToRemove) => {
    setColleges((prevColleges) =>
      prevColleges.filter((college) => college.collegeId !== collegeToRemove.collegeId)
    );

    if (selectedCollege && selectedCollege.collegeId === collegeToRemove.collegeId && selectedCollege.collegeName) {
      setSelectedCollege("");
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      if (selectedCollege) {
        console.log("Fetching resources for user:", user.uid, "college:", selectedCollege.collegeName);
        try {
          const { success, resources, demographics } = await getCollegeResourcesDemographics(user.uid, selectedCollege.collegeName);
          if (success) {
            setResources(resources);
            setDemographics(demographics);
          } else {
            console.error("Failed to fetch resources.");
          }
        } catch (error) {
          console.error("Error fetching resources:", error);
        }
      }
    };

    fetchResources();
  }, [selectedCollege, user.uid]);

  return (
    <div className="flex min-h-screen">
      {loading && <LoadingScreen />}

      <Sidebar
        userId={user.uid}
        onSelectCollege={handleSelectCollege}
        onCollegeRemoved={handleCollegeRemoved}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        loading={loading}
        setLoading={setLoading}
      />

      <div className={`flex-1 p-6 transition-all`}>
        {notification && (
          <div
            className={`p-4 mt-5 mb-4 rounded-lg text-center text-white ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.message}
          </div>
        )}
        <Resources
          userId={user.uid}
          selectedCollege={selectedCollege}
          resources={resources}
        />

        <Demographics
          userId={user.uid}
          selectedCollege={selectedCollege}
          demographics={demographics}
        />

        <Checklist
          userId={user.uid}
          selectedCollege={selectedCollege}
          onCollegeRemoved={handleCollegeRemoved}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />

        <MajorStats selectedCollege={selectedCollege} />

      </div>
    </div>
  );
};

export default UserPage;
