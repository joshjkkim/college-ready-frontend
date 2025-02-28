import React, { useState, useRef } from "react";
import { handleCollegeSearchOrAdd, getCollegeSuggestions } from "../api/api.js";

// Helper component to compare numeric statistics
const CompareRow = ({ label, value1, value2, higherIsBetter = true, format = (n) => n }) => {
  const num1 = parseFloat(value1);
  const num2 = parseFloat(value2);
  let style1 = "text-gray-800";
  let style2 = "text-gray-800";
  if (!isNaN(num1) && !isNaN(num2)) {
    if (num1 === num2) {
      style1 = style2 = "text-gray-800";
    } else if (num1 > num2) {
      if (higherIsBetter) {
        style1 = "text-green-600 font-bold";
        style2 = "text-red-600";
      } else {
        style1 = "text-red-600";
        style2 = "text-green-600 font-bold";
      }
    } else {
      if (higherIsBetter) {
        style1 = "text-red-600";
        style2 = "text-green-600 font-bold";
      } else {
        style1 = "text-green-600 font-bold";
        style2 = "text-red-600";
      }
    }
  }
  return (
    <div className="flex justify-between py-1 border-b border-gray-200">
      <div className="w-1/3 font-semibold">{label}:</div>
      <div className={`w-1/3 text-right ${style1}`}>{value1 ? format(value1) : "N/A"}</div>
      <div className={`w-1/3 text-right ${style2}`}>{value2 ? format(value2) : "N/A"}</div>
    </div>
  );
};

const CompareColleges = () => {
  // States for College 1
  const [college1Name, setCollege1Name] = useState("");
  const [college1Data, setCollege1Data] = useState(null);
  const [college1Suggestions, setCollege1Suggestions] = useState([]);
  const college1ThrottleRef = useRef(null);
  const [loading1, setLoading1] = useState(false);

  // States for College 2
  const [college2Name, setCollege2Name] = useState("");
  const [college2Data, setCollege2Data] = useState(null);
  const [college2Suggestions, setCollege2Suggestions] = useState([]);
  const college2ThrottleRef = useRef(null);
  const [loading2, setLoading2] = useState(false);

  const throttle = (callback, delay, throttleRef) => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }
    throttleRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await getCollegeSuggestions(query);
      if (response.success) {
        setSuggestions(response.data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching college suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleCollege1Change = (e) => {
    const value = e.target.value;
    setCollege1Name(value);
    throttle(() => fetchSuggestions(value, setCollege1Suggestions), 1000, college1ThrottleRef);
  };

  const handleCollege2Change = (e) => {
    const value = e.target.value;
    setCollege2Name(value);
    throttle(() => fetchSuggestions(value, setCollege2Suggestions), 1000, college2ThrottleRef);
  };

  const handleCollege1Select = async (name) => {
    setCollege1Name(name);
    setCollege1Suggestions([]);
    setLoading1(true);
    try {
      const result = await handleCollegeSearchOrAdd(name);
      if (result.success) {
        setCollege1Data(result.data);
      } else {
        setCollege1Data(null);
      }
    } catch (error) {
      console.error("Error fetching college 1:", error);
    }
    setLoading1(false);
  };

  const handleCollege2Select = async (name) => {
    setCollege2Name(name);
    setCollege2Suggestions([]);
    setLoading2(true);
    try {
      const result = await handleCollegeSearchOrAdd(name);
      if (result.success) {
        setCollege2Data(result.data);
      } else {
        setCollege2Data(null);
      }
    } catch (error) {
      console.error("Error fetching college 2:", error);
    }
    setLoading2(false);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg my-8 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center">Compare Colleges</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* College 1 Input */}
        <div className="flex flex-col">
          <label className="mb-2 text-xl font-semibold">College 1:</label>
          <input
            type="text"
            placeholder="Enter first college name"
            value={college1Name}
            onChange={handleCollege1Change}
            className="p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xl"
          />
          {college1Suggestions.length > 0 && (
            <ul className="mt-2 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {college1Suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200 text-lg"
                  onClick={() => handleCollege1Select(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {loading1 && <p className="text-blue-600 mt-2 text-lg">Loading...</p>}
        </div>
        
        {/* College 2 Input */}
        <div className="flex flex-col">
          <label className="mb-2 text-xl font-semibold">College 2:</label>
          <input
            type="text"
            placeholder="Enter second college name"
            value={college2Name}
            onChange={handleCollege2Change}
            className="p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xl"
          />
          {college2Suggestions.length > 0 && (
            <ul className="mt-2 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {college2Suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200 text-lg"
                  onClick={() => handleCollege2Select(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {loading2 && <p className="text-blue-600 mt-2 text-lg">Loading...</p>}
        </div>
      </div>

      {(college1Data && college2Data) && (
        <div className="mt-12 border-t pt-6">
            <h3 className="text-3xl font-bold mb-4 text-center">Comparison Metrics</h3>
            <CompareRow
            label="Undergrad Size"
            value1={college1Data.demographics?.schoolSize}
            value2={college2Data.demographics?.schoolSize}
            higherIsBetter={true}
            />
            <CompareRow
            label="Grad Size"
            value1={college1Data.demographics?.schoolGradSize}
            value2={college2Data.demographics?.schoolGradSize}
            higherIsBetter={true}
            />
            <CompareRow
            label="Admission Rate"
            value1={college1Data.demographics?.admissionRate}
            value2={college2Data.demographics?.admissionRate}
            higherIsBetter={false}
            format={(n) => (n ? (n * 100).toFixed(2) + "%" : "N/A")}
            />
            <CompareRow
            label="Student-Faculty Ratio"
            value1={college1Data.demographics?.studentFacRatio}
            value2={college2Data.demographics?.studentFacRatio}
            higherIsBetter={false}
            />
            <CompareRow
            label="Cost of Attendance"
            value1={college1Data.demographics?.finance?.costAttendance}
            value2={college2Data.demographics?.finance?.costAttendance}
            higherIsBetter={false}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="In-State Tuition"
            value1={college1Data.demographics?.finance?.inStateTuition}
            value2={college2Data.demographics?.finance?.inStateTuition}
            higherIsBetter={false}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="Out-of-State Tuition"
            value1={college1Data.demographics?.finance?.outOfStateTuition}
            value2={college2Data.demographics?.finance?.outOfStateTuition}
            higherIsBetter={false}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="Median Earnings (10 yrs)"
            value1={college1Data.demographics?.finance?.medianEarnings}
            value2={college2Data.demographics?.finance?.medianEarnings}
            higherIsBetter={true}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="Avg Family Income"
            value1={college1Data.demographics?.finance?.avgFamilyIncome}
            value2={college2Data.demographics?.finance?.avgFamilyIncome}
            higherIsBetter={true}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="Median Family Income"
            value1={college1Data.demographics?.finance?.medianFamilyIncome}
            value2={college2Data.demographics?.finance?.medianFamilyIncome}
            higherIsBetter={true}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="FAFSA Applications"
            value1={college1Data.demographics?.finance?.fafsaApplications}
            value2={college2Data.demographics?.finance?.fafsaApplications}
            higherIsBetter={true}
            />
            <CompareRow
            label="Grants/Loans"
            value1={college1Data.demographics?.finance?.studentsGrantsOrLoans}
            value2={college2Data.demographics?.finance?.studentsGrantsOrLoans}
            higherIsBetter={false}
            />
            <CompareRow
            label="Net Price (0-30000)"
            value1={college1Data.demographics?.finance?.netPriceByIncome_0_30000}
            value2={college2Data.demographics?.finance?.netPriceByIncome_0_30000}
            higherIsBetter={false}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="Net Price (30001-48000)"
            value1={college1Data.demographics?.finance?.netPriceByIncome_30001_48000}
            value2={college2Data.demographics?.finance?.netPriceByIncome_30001_48000}
            higherIsBetter={false}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="Net Price (48001-75000)"
            value1={college1Data.demographics?.finance?.netPriceByIncome_48001_75000}
            value2={college2Data.demographics?.finance?.netPriceByIncome_48001_75000}
            higherIsBetter={false}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="Net Price (75001-110000)"
            value1={college1Data.demographics?.finance?.netPriceByIncome_75001_110000}
            value2={college2Data.demographics?.finance?.netPriceByIncome_75001_110000}
            higherIsBetter={false}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="Net Price (110001+)"
            value1={college1Data.demographics?.finance?.netPriceByIncome_110001Plus}
            value2={college2Data.demographics?.finance?.netPriceByIncome_110001Plus}
            higherIsBetter={false}
            format={(n) => (n ? "$" + n : "N/A")}
            />
            <CompareRow
            label="Graduation Rate"
            value1={college1Data.demographics?.finance?.graduationRate || college1Data.demographics?.graduationRate}
            value2={college2Data.demographics?.finance?.graduationRate || college2Data.demographics?.graduationRate}
            higherIsBetter={true}
            format={(n) => (n ? (n * 100).toFixed(2) + "%" : "N/A")}
            />
        </div>      
      )}

      {/* Display detailed college info side by side */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* College 1 Detailed Info */}
        {college1Data ? (
          <div className="border p-8 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold mb-6">{college1Data.name}</h3>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">General Info</h4>
              <p className="text-xl">
                <strong>Aliases:</strong> {college1Data.aliases?.join(", ") || "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">Deadlines</h4>
              <ul className="list-disc pl-6 text-xl">
                {college1Data.info?.deadlines?.map((deadline, index) => (
                  <li key={index}>
                    <strong>{deadline.type}: </strong>{deadline.date}
                  </li>
                )) || <li>N/A</li>}
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">Requirements</h4>
              <ul className="list-disc pl-6 text-xl">
                <li>
                  <strong>Transcripts:</strong> {college1Data.info?.requirements?.transcripts || "N/A"}
                </li>
                <li>
                  <strong>SAT/ACT:</strong> {college1Data.info?.requirements?.SAT_ACT || "N/A"}
                </li>
                <li>
                  <strong>Teacher Recommendations:</strong> {college1Data.info?.requirements?.teacherRecommendations || college1Data.info?.requirements?.TeacherRecommendations || "N/A"}
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">Admission Statistics</h4>
              <ul className="list-disc pl-6 text-xl">
                <li>
                  <strong>Acceptance Rate:</strong> {college1Data.info?.admissionStatistics?.overallAcceptanceRate || "N/A"}
                </li>
                <li>
                  <strong>Year:</strong> {college1Data.info?.admissionStatistics?.year || "N/A"}
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">Demographics</h4>
              <ul className="list-disc pl-6 text-xl">
                <li>
                  <strong>City:</strong> {college1Data.demographics?.schoolCity || "N/A"}
                </li>
                <li>
                  <strong>State:</strong> {college1Data.demographics?.schoolState || "N/A"}
                </li>
                <li>
                  <strong>Undergrad Size:</strong> {college1Data.demographics?.schoolSize || "N/A"}
                </li>
                <li>
                  <strong>Grad Size:</strong> {college1Data.demographics?.schoolGradSize || "N/A"}
                </li>
                <li>
                  <strong>Admission Rate:</strong>{" "}
                  {college1Data.demographics?.admissionRate
                    ? (college1Data.demographics.admissionRate * 100).toFixed(2) + "%"
                    : "N/A"}
                </li>
                <li>
                  <strong>Student-Faculty Ratio:</strong> {college1Data.demographics?.studentFacRatio || "N/A"}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold">Financial Info</h4>
              <ul className="list-disc pl-6 text-xl">
                <li>
                  <strong>Average Family Income:</strong> ${college1Data.demographics?.finance?.avgFamilyIncome || "N/A"}
                </li>
                <li>
                  <strong>Median Family Income:</strong> ${college1Data.demographics?.finance?.medianFamilyIncome || "N/A"}
                </li>
                <li>
                  <strong>FAFSA Applications:</strong> {college1Data.demographics?.finance?.fafsaApplications || "N/A"}
                </li>
                <li>
                  <strong>Grants/Loans:</strong> {college1Data.demographics?.finance?.studentsGrantsOrLoans || "N/A"}
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="border p-8 rounded-lg shadow-md flex items-center justify-center">
            <p className="text-xl text-gray-500">No data for College 1</p>
          </div>
        )}
        
        {/* College 2 Detailed Info */}
        {college2Data ? (
          <div className="border p-8 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold mb-6">{college2Data.name}</h3>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">General Info</h4>
              <p className="text-xl">
                <strong>Aliases:</strong> {college2Data.aliases?.join(", ") || "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">Deadlines</h4>
              <ul className="list-disc pl-6 text-xl">
                {college2Data.info?.deadlines?.map((deadline, index) => (
                  <li key={index}>
                    <strong>{deadline.type}: </strong>{deadline.date}
                  </li>
                )) || <li>N/A</li>}
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">Requirements</h4>
              <ul className="list-disc pl-6 text-xl">
                <li>
                  <strong>Transcripts:</strong> {college2Data.info?.requirements?.transcripts || "N/A"}
                </li>
                <li>
                  <strong>SAT/ACT:</strong> {college2Data.info?.requirements?.SAT_ACT || "N/A"}
                </li>
                <li>
                  <strong>Teacher Recommendations:</strong> {college2Data.info?.requirements?.teacherRecommendations || college2Data.info?.requirements?.TeacherRecommendations || "N/A"}
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">Admission Statistics</h4>
              <ul className="list-disc pl-6 text-xl">
                <li>
                  <strong>Acceptance Rate:</strong> {college2Data.info?.admissionStatistics?.overallAcceptanceRate || "N/A"}
                </li>
                <li>
                  <strong>Year:</strong> {college2Data.info?.admissionStatistics?.year || "N/A"}
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-semibold">Demographics</h4>
              <ul className="list-disc pl-6 text-xl">
                <li>
                  <strong>City:</strong> {college2Data.demographics?.schoolCity || "N/A"}
                </li>
                <li>
                  <strong>State:</strong> {college2Data.demographics?.schoolState || "N/A"}
                </li>
                <li>
                  <strong>Undergrad Size:</strong> {college2Data.demographics?.schoolSize || "N/A"}
                </li>
                <li>
                  <strong>Grad Size:</strong> {college2Data.demographics?.schoolGradSize || "N/A"}
                </li>
                <li>
                  <strong>Admission Rate:</strong>{" "}
                  {college2Data.demographics?.admissionRate
                    ? (college2Data.demographics.admissionRate * 100).toFixed(2) + "%"
                    : "N/A"}
                </li>
                <li>
                  <strong>Student-Faculty Ratio:</strong> {college2Data.demographics?.studentFacRatio || "N/A"}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold">Financial Info</h4>
              <ul className="list-disc pl-6 text-xl">
                <li>
                  <strong>Average Family Income:</strong> ${college2Data.demographics?.finance?.avgFamilyIncome || "N/A"}
                </li>
                <li>
                  <strong>Median Family Income:</strong> ${college2Data.demographics?.finance?.medianFamilyIncome || "N/A"}
                </li>
                <li>
                  <strong>FAFSA Applications:</strong> {college2Data.demographics?.finance?.fafsaApplications || "N/A"}
                </li>
                <li>
                  <strong>Grants/Loans:</strong> {college2Data.demographics?.finance?.studentsGrantsOrLoans || "N/A"}
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="border p-8 rounded-lg shadow-md flex items-center justify-center">
            <p className="text-xl text-gray-500">No data for College 2</p>
          </div>
        )}
      </div> 
    </div>
  );
};

export default CompareColleges;
