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
    <div className="mt-6 p-4 sm:p-6 bg-white rounded-lg shadow-md overflow-x-auto">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-3 sm:p-4 mb-4 rounded-lg text-center text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <h2 className="text-xl sm:text-2xl font-bold mb-4">{collegeInfo.name}</h2>

      <button
        onClick={handleAddCollege} // Attach functionality
        className="w-full sm:w-auto p-2 sm:p-3 bg-blue-700 text-white rounded-full hover:bg-blue-600 transition duration-300"
        title="Add to profile"
      >
        ✅ Add to Profile
      </button>

      {/* Aliases */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Aliases</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          {collegeInfo?.aliases.map((link, index) => (
            <li key={index}>{link}</li>
          ))}
        </ul>
      </div>

      {/* Helpful Links */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Helpful Links</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          {collegeInfo?.links.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer" className="underline">
                {link}
              </a>
            </li>
          ))}
          <p className="mt-2 font-semibold">Price Calculator: </p>
          <a
            href={
              collegeInfo.demographics.priceCalcUrl.startsWith("http")
                ? collegeInfo.demographics.priceCalcUrl
                : `https://${collegeInfo.demographics.priceCalcUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-sm sm:text-base"
          >
            {collegeInfo.demographics.priceCalcUrl}
          </a>
        </ul>
      </div>

      {/* Deadlines */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Deadlines</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          {collegeInfo.info?.deadlines?.map((deadline, index) => (
            <li key={index}>
              <strong>{deadline.type}: </strong>
              {deadline.date}
            </li>
          ))}
        </ul>
      </div>

      {/* Essay Prompts */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Essay Prompts</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          {collegeInfo.info?.essayPrompts?.map((prompt, index) => (
            <li key={index}>{prompt}</li>
          ))}
        </ul>
      </div>

      {/* Requirements */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Requirements</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          <li>
            <strong>Transcripts: </strong>
            {collegeInfo.info?.requirements?.transcripts}
          </li>
          <li>
            <strong>SAT/ACT: </strong>
            {collegeInfo.info?.requirements?.SAT_ACT}
          </li>
          <li>
            <strong>Teacher Recommendations: </strong>
            {collegeInfo.info?.requirements?.TeacherRecommendations}
          </li>
        </ul>
      </div>

      {/* Tips */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Tips</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          {collegeInfo.info?.tips?.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Admission Statistics */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Admission Statistics</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          <li>
            <strong>Acceptance Rate: </strong>
            {collegeInfo.info?.admissionStatistics?.overallAcceptanceRate}
          </li>
          <li>
            <strong>Year: </strong>
            {collegeInfo.info?.admissionStatistics?.year}
          </li>
        </ul>
      </div>

      {/* Admitted Student Profile */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Admitted Student Profile</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          <li>
            <strong>GPA: </strong>
            {collegeInfo.info?.admittedStudentProfile?.GPA}
          </li>
          <li>
            <strong>SAT: </strong>
            {collegeInfo.info?.admittedStudentProfile?.SAT}
          </li>
          <li>
            <strong>Major: </strong>
            {collegeInfo.info?.admittedStudentProfile?.Major}
          </li>
        </ul>
      </div>

      {/* Demographics */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Demographics</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          <li>
            <strong>City: </strong>
            {collegeInfo.demographics["schoolCity"] || "No Info Found"}
          </li>
          <li>
            <strong>State: </strong>
            {collegeInfo.demographics["schoolState"] || "No Info Found"}
          </li>
          <li>
            <strong>Undergraduate Size: </strong>
            {collegeInfo.demographics["schoolSize"] || "No Info Found"}
          </li>
          <li>
            <strong>Grad Student Size: </strong>
            {collegeInfo.demographics["schoolGradSize"] || "No Info Found"}
          </li>
          <li>
            <strong>Admission Rate: </strong>
            %{collegeInfo.demographics["admissionRate"] * 100 || "No Info Found"}
          </li>
          <li>
            <strong>Student-Faculty Ratio: </strong>
            {collegeInfo.demographics["studentFacRatio"] || "No Info Found"}
          </li>
        </ul>
      </div>

      {/* Demographic Breakdown */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Demographic Breakdown</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          <li>
            <strong>White: </strong>
            {collegeInfo.demographics?.demographics.white * 100 || "No Info Found"}%
          </li>
          <li>
            <strong>Black: </strong>
            {collegeInfo.demographics?.demographics.black * 100 || "No Info Found"}%
          </li>
          <li>
            <strong>Asian: </strong>
            {collegeInfo.demographics?.demographics.asian * 100 || "No Info Found"}%
          </li>
          <li>
            <strong>Hispanic: </strong>
            {collegeInfo.demographics?.demographics.hispanic * 100 || "No Info Found"}%
          </li>
          <li>
            <strong>Others: </strong>
            {collegeInfo.demographics?.demographics.unknown * 100 || "No Info Found"}%
          </li>
          <li>
            <strong>First-Generation Students: </strong>
            {collegeInfo.demographics?.demographics.firstGen * 100 || "No Info Found"}%
          </li>
        </ul>
      </div>

      {/* Financial Breakdown */}
      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold">Financial Breakdown</h3>
        <ul className="list-disc pl-5 text-sm sm:text-base">
          <li>
            <strong>Average Family Income: </strong>
            {collegeInfo.demographics?.finance?.avgFamilyIncome || "No Info Found"}
          </li>
          <li>
            <strong>Median Family Income: </strong>
            {collegeInfo.demographics?.finance?.medianFamilyIncome || "No Info Found"}
          </li>
          <li>
            <strong>FAFSA Applications: </strong>
            {collegeInfo.demographics?.finance?.fafsaApplications || "No Info Found"}
          </li>
          <li>
            <strong>Students with Grants or Loans: </strong>
            {collegeInfo.demographics?.finance?.studentsGrantsOrLoans || "No Info Found"}
          </li>
          <li>
            <strong>Cost of Attendance: </strong>
            {collegeInfo.demographics?.finance?.costAttendance || "No Info Found"}
          </li>
          <li>
            <strong>In-State Tuition: </strong>
            {collegeInfo.demographics?.finance?.inStateTuition || "No Info Found"}
          </li>
          <li>
            <strong>Out-of-State Tuition: </strong>
            {collegeInfo.demographics?.finance?.outOfStateTuition || "No Info Found"}
          </li>
          <li>
            <strong>Median Earnings (10 yrs after): </strong>
            {collegeInfo.demographics?.finance?.medianEarnings || "No Info Found"}
          </li>
          <li>
            <strong>Net Price (0-30000): </strong>
            {collegeInfo.demographics?.finance?.netPriceByIncome_0_30000 || "No Info Found"}
          </li>
          <li>
            <strong>Net Price (30001-48000): </strong>
            {collegeInfo.demographics?.finance?.netPriceByIncome_30001_48000 || "No Info Found"}
          </li>
          <li>
            <strong>Net Price (48001-75000): </strong>
            {collegeInfo.demographics?.finance?.netPriceByIncome_48001_75000 || "No Info Found"}
          </li>
          <li>
            <strong>Net Price (75001-110000): </strong>
            {collegeInfo.demographics?.finance?.netPriceByIncome_75001_110000 || "No Info Found"}
          </li>
          <li>
            <strong>Net Price (110001+): </strong>
            {collegeInfo.demographics?.finance?.netPriceByIncome_110001Plus || "No Info Found"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CollegeInfo;
