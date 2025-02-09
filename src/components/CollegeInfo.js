import React, { useState } from "react";
import { addUserCollege } from "../api/api";

const CollegeInfo = ({ collegeInfo }) => {
  const [notification, setNotification] = useState(null); // For managing notification messages

  if (!collegeInfo) return null; // Don't render anything if no data is passed

  const handleAddCollege = async () => {
    try {
      const result = await addUserCollege(collegeInfo.name); // Add the college to the user's profile
      if (result.success) {
        setNotification({
          message: "College successfully added to your profile! 🎉",
          type: "success",
        });
      } else {
        setNotification({
          message: `Failed to add college: ${result.message}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding college to user's profile:", error);
      setNotification({
        message: "An error occurred while adding the college. Please try again later.",
        type: "error",
      });
    }

    // Remove the notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 mb-4 rounded-lg text-center text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">{collegeInfo.name}</h2>

      <button
        onClick={handleAddCollege} // Attach functionality
        className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-600 transition duration-300"
        title="Add to profile"
      >
        ✅ Add to Profile
      </button>

      <div>
        <h3 className="text-xl font-semibold">Aliases</h3>
        <ul className="list-disc pl-6">
          {collegeInfo?.aliases.map((link, index) => (
            <li key={index}>
                {link}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Helpful Links</h3>
        <ul className="list-disc pl-6">
          {collegeInfo?.links.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <u>{link}</u>
              </a>
            </li>
          ))}
        </ul>
      </div>

      
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Deadlines</h3>
        <ul className="list-disc pl-6">
          {collegeInfo.info?.deadlines?.map((deadline, index) => (
            <li key={index}>
              <strong>{deadline.type}: </strong>
              {deadline.date}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Essay Prompts</h3>
        <ul className="list-disc pl-6">
          {collegeInfo.info?.essayPrompts?.map((prompt, index) => (
            <li key={index}>{prompt}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Requirements</h3>
        <ul className="list-disc pl-6">
          <li><strong>Transcripts: </strong>{collegeInfo.info?.requirements?.transcripts}</li>
          <li><strong>SAT/ACT: </strong>{collegeInfo.info?.requirements?.SAT_ACT}</li>
          <li><strong>Teacher Recommendations: </strong>{collegeInfo.info?.requirements?.TeacherRecommendations}</li>
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Tips</h3>
        <ul className="list-disc pl-6">
          {collegeInfo.info?.tips?.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Admission Statistics</h3>
        <ul className="list-disc pl-6">
          <li><strong>Acceptance Rate: </strong>{collegeInfo.info?.admissionStatistics?.overallAcceptanceRate}</li>
          <li><strong>Year: </strong>{collegeInfo.info?.admissionStatistics?.year}</li>
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Admitted Student Profile</h3>
        <ul className="list-disc pl-6">
          <li><strong>GPA: </strong>{collegeInfo.info?.admittedStudentProfile?.GPA}</li>
          <li><strong>SAT: </strong>{collegeInfo.info?.admittedStudentProfile?.SAT}</li>
          <li><strong>Major: </strong>{collegeInfo.info?.admittedStudentProfile?.Major}</li>
        </ul>
      </div>
    </div>
  );
};

export default CollegeInfo;
