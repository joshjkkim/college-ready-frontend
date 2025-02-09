import React, { useState } from "react";
import Sidebar from "../components/Sidebar.js";
import Checklist from "../components/CollegeChecklist.js";
import MajorStats from "../components/MajorStats.js";
import Resources from "../components/CollegeResources.js"
import { auth } from "../firebase.js";

const UserPage = () => {
  const user = auth.currentUser;
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [, setColleges] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false); // Track sidebar collapse state

  const handleSelectCollege = (college) => {
    setSelectedCollege(college);
  };

  const handleCollegeRemoved = (collegeToRemove) => {
    setColleges((prevColleges) =>
      prevColleges.filter((college) => college.collegeId !== collegeToRemove.collegeId)
    );

    if (selectedCollege && selectedCollege.collegeId === collegeToRemove.collegeId) {
      setSelectedCollege(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userId={user.uid}
        onSelectCollege={handleSelectCollege}
        onCollegeRemoved={handleCollegeRemoved}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div className={`flex-1 p-6 transition-all`}>
        <h1>Welcome, {user.displayName}</h1>
        <Resources
          userId={user.uid}
          selectedCollege={selectedCollege}
        />

        <Checklist
          userId={user.uid}
          selectedCollege={selectedCollege}
          onCollegeRemoved={handleCollegeRemoved}
        />

        <MajorStats selectedCollege={selectedCollege} />

      </div>
    </div>
  );
};

export default UserPage;
