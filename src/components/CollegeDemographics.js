import React, { useState, useEffect } from "react";

const Demographics = ({ demographics, selectedCollege }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); 

  if (!selectedCollege) {
    return <p className="text-center text-gray-500 mt-8">Select a college to view its demographics.</p>;
  }

  if (!demographics) {
    return <p className="text-center text-gray-500 mt-8">Loading demographics...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-6">
        Demographics for {selectedCollege.collegeName}
      </h2>
      
      <button
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="w-3/12 p-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold rounded-lg mb-4 hover:bg-gray-400 transition-all duration-300"
      >
        {isCollapsed ? "Show College Demographics" : "Hide College Demographics"}
      </button>
  
      <div className={`overflow-hidden transition-all duration-1000 ${isCollapsed ? "max-h-0" : "max-h-[100vh] overflow-y-auto"}`}>
          {/* Demographics Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Demographics</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>City: </strong>{demographics.schoolCity || "No Info Found"}</li>
              <li><strong>State: </strong>{demographics.schoolState || "No Info Found"}</li>
              <li><strong>Undergraduate Size: </strong>{demographics.schoolSize || "No Info Found"}</li>
              <li><strong>Grad Student Size: </strong>{demographics.schoolGradSize || "No Info Found"}</li>
              <li><strong>Admission Rate: </strong>{demographics.admissionRate * 100 || "No Info Found"}%</li>
              <li><strong>Student-Faculty Ratio: </strong>{demographics.studentFacRatio || "No Info Found"}:1</li>
            </ul>
          </div>
  
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Demographic Breakdown</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>White: </strong>{demographics.demographics.white * 100 || "No Info Found"}%</li>
              <li><strong>Black: </strong>{demographics.demographics.black * 100 || "No Info Found"}%</li>
              <li><strong>Asian: </strong>{demographics.demographics.asian * 100 || "No Info Found"}%</li>
              <li><strong>Hispanic: </strong>{demographics.demographics.hispanic * 100 || "No Info Found"}%</li>
              <li><strong>Others: </strong>{demographics.demographics.unknown * 100 || "No Info Found"}%</li>
              <li><strong>First-Generation Students: </strong>{demographics.demographics.firstGen * 100 || "No Info Found"}%</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Financial Breakdown</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Average Family Income:</strong>{" "}
              {demographics?.finance?.avgFamilyIncome || "No Info Found"}
            </li>
            <li>
              <strong>Median Family Income:</strong>{" "}
              {demographics?.finance?.medianFamilyIncome || "No Info Found"}
            </li>
            <li>
              <strong>FAFSA Applications:</strong>{" "}
              {demographics?.finance?.fafsaApplications || "No Info Found"}
            </li>
            <li>
              <strong>Students with Grants or Loans:</strong>{" "}
              {demographics?.finance?.studentsGrantsOrLoans || "No Info Found"}
            </li>
            <li>
              <strong>Cost of Attendance:</strong>{" "}
              {demographics?.finance?.costAttendance || "No Info Found"}
            </li>
            <li>
              <strong>In-State Tuition:</strong>{" "}
              {demographics?.finance?.inStateTuition || "No Info Found"}
            </li>
            <li>
              <strong>Out-of-State Tuition:</strong>{" "}
              {demographics?.finance?.outOfStateTuition || "No Info Found"}
            </li>
            <li>
              <strong>Median Earnings (10 yrs after):</strong>{" "}
              {demographics?.finance?.medianEarnings || "No Info Found"}
            </li>
            <li>
              <strong>Net Price (0-30000):</strong>{" "}
              {demographics?.finance?.netPriceByIncome_0_30000 || "No Info Found"}
            </li>
            <li>
              <strong>Net Price (30001-48000):</strong>{" "}
              {demographics?.finance?.netPriceByIncome_30001_48000 || "No Info Found"}
            </li>
            <li>
              <strong>Net Price (48001-75000):</strong>{" "}
              {demographics?.finance?.netPriceByIncome_48001_75000 || "No Info Found"}
            </li>
            <li>
              <strong>Net Price (75001-110000):</strong>{" "}
              {demographics?.finance?.netPriceByIncome_75001_110000 || "No Info Found"}
            </li>
            <li>
              <strong>Net Price (110001+):</strong>{" "}
              {demographics?.finance?.netPriceByIncome_110001Plus || "No Info Found"}
            </li>
            </ul>
          </div> 
        </div>
    </div>
  );  
};

export default Demographics;
