import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // Import the Calendar component from react-calendar
import '../App.css'; // Import default styles for the calendar
import { getDeadlinesForUser } from '../api/api'; // Assuming you have an API method to fetch deadlines

const DeadlineCalendar = ({ userId, isCollapsed, setIsCollapsed }) => {
  const [date, setDate] = useState(new Date());
  const [deadlines, setDeadlines] = useState([]); // State to store fetched deadlines
  const [selectedDeadlines, setSelectedDeadlines] = useState([]); // State for selected day's deadlines

  // Fetch deadlines from the API
  const fetchDeadlines = async () => {
    try {
      if (userId) {
        const { success, data, message } = await getDeadlinesForUser(userId);
        if (success) {
          setDeadlines(data);
        } else {
          console.log(message);
        }
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    }
  };

  // Format the date to compare with the deadline dates
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Returns the date in YYYY-MM-DD format
  };

  // Check if there are any deadlines for the selected date
  const getDeadlinesForDate = (date) => {
    const formattedDate = formatDate(date);
    return deadlines.filter((deadline) => deadline.deadlineDate === formattedDate);
  };

  const onDateChange = (newDate) => {
    setDate(newDate); // Update selected date
    setSelectedDeadlines(getDeadlinesForDate(newDate)); // Fetch deadlines for the selected date
  };

  useEffect(() => {
    fetchDeadlines();
  }, [userId]);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const deadlinesForDate = getDeadlinesForDate(date);
      if (deadlinesForDate.length > 0) {
        return (
          <div className="deadline-marker flex justify-center items-center">
            <span className="text-xs text-white bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 rounded-md px-2 py-1">
              {deadlinesForDate.length > 1 ? `⚠️ ${deadlinesForDate.length} Deadlines!` : deadlinesForDate[0].collegeName}
            </span>
          </div>
        );
      }
    }
  };

  return (
    <div className="calendar-container max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Deadlines Calendar</h1>

      <div className="calendar mb-6">
        <Calendar
          onChange={onDateChange}
          value={date} // Set the selected date
          tileContent={tileContent} 
          className="w-full max-w-xl mx-auto rounded-lg shadow-lg" // Styling for the calendar container
        />
      </div>

      <div className="deadlines-list mt-6 space-y-4">
        {selectedDeadlines.length === 0 ? (
          <p className="text-gray-500">No deadlines for this date.</p>
        ) : (
          <ul className="space-y-4">
            {selectedDeadlines.map((deadline, index) => (
              <li key={index}>
                <div className="deadline bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-blue-700">{deadline.collegeName}</h3>
                  <p className="text-gray-600 mt-1">{deadline.deadlineType}</p>
                  <p className="text-sm text-gray-500 mt-2">{deadline.deadlineDate}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

       <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="text-lg mt-6 text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg p-4 rounded-lg"
      >
        <strong>
        {isCollapsed ? "Reveal all Deadlines" : "Hide Deadlines"}
        </strong>
      </button>

      
      <div
        className={`deadlines-list mt-6 transition-all duration-300 overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-100 to-pink-50 p-4 rounded-lg ${isCollapsed ? "max-h-10" : "max-h-[100vh] overflow-y-auto"}`}
      >
      {deadlines.length === 0 ? (
        <p className="text-gray-500">No deadlines at all???.</p>
      ) : (
        <ul>
          {deadlines.map((deadline, index) => (
            <li key={index} className="deadline-item mb-4">
              <div className="deadline bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-100 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{deadline.collegeName}</h3>
                <p className="text-gray-600">{deadline.deadlineType}</p>
                <p className="text-sm text-gray-500">{deadline.deadlineDate}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

    </div>
  );
};

export default DeadlineCalendar;
