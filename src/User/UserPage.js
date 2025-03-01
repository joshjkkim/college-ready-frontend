import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Checklist from "../components/CollegeChecklist";
import MajorStats from "../components/MajorStats";
import Resources from "../components/CollegeResources";
import Demographics from "../components/CollegeDemographics";
import { auth } from "../firebase";
import LoadingScreen from "../components/LoadingScreen";
import { getCollegeResourcesDemographics } from "../api/api";
import { Helmet } from "react-helmet";

const UserPage = () => {
  const user = auth.currentUser;
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState(null);
  const [demographics, setDemographics] = useState(null);

  const handleSelectCollege = (college) => {
    if (!isEditMode) {
      setSelectedCollege(college);
      setNotification(null);
    } else {
      setNotification({
        message: "Cannot switch colleges while in edit mode!",
        type: "error",
      });
    }
  };

  const handleCollegeRemoved = (collegeToRemove) => {
    setColleges((prevColleges) =>
      prevColleges.filter(
        (college) => college.collegeId !== collegeToRemove.collegeId
      )
    );
    if (selectedCollege && selectedCollege.collegeId === collegeToRemove.collegeId) {
      setSelectedCollege(null);
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      if (selectedCollege) {
        console.log(
          "Fetching resources for user:",
          user.uid,
          "college:",
          selectedCollege.collegeName
        );
        try {
          const { success, resources, demographics } =
            await getCollegeResourcesDemographics(user.uid, selectedCollege.collegeName);
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
    // Adding overflow-x-hidden prevents horizontal scrolling on mobile
    <div className="relative flex min-h-screen overflow-x-auto max-w-screen">
      <Helmet>
        <title>College Ready - Dashboard</title>
        <meta
          name="description"
          content="View your dashboard on College Ready: manage your selected colleges, explore resources, review demographics, and track your checklist and major stats."
        />
        <meta property="og:title" content="College Ready - Dashboard" />
        <meta
          property="og:description"
          content="Your personalized dashboard on College Ready. Manage your colleges, access resources, and track your progress."
        />
        <meta property="og:url" content="https://www.collegeready.me/usercolleges" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="College Ready - Dashboard" />
        <meta
          name="twitter:description"
          content="Access your personalized College Ready dashboard to manage your college search and track important metrics."
        />
      </Helmet>
      {loading && <LoadingScreen />}

      {/* Sidebar is rendered as a fixed overlay on mobile via its own internal state */}
      <Sidebar
        userId={user.uid}
        onSelectCollege={handleSelectCollege}
        onCollegeRemoved={handleCollegeRemoved}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        setLoading={setLoading}
      />

      <div className="flex-1 p-6 transition-all">
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
