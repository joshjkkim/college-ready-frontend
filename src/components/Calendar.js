import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../App.css';
import { getDeadlinesForUser, getNotesForUser } from '../api/api';
import { saveAs } from 'file-saver';

// Helper: Format a Date object as YYYY-MM-DD for filtering
const formatDate = (d) => d.toISOString().split('T')[0];

// ICS Helper: Format a date in ICS format (YYYYMMDDTHHmmssZ)
const formatDateICS = (date) =>
  date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

// ICS Helper: Generate a unique UID (customize as needed)
const generateUID = (index, startDate) =>
  `${index}-${startDate.getTime()}@yourdomain.com`;

// ICS Helper: Generate complete ICS content from an array of event objects
const generateICSContent = (events) => {
  const header = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Your Company//Your Product//EN"
  ];

  const eventStrings = events.map((event, index) => {
    const dtstamp = formatDateICS(new Date());
    const dtstart = formatDateICS(event.start);
    const dtend = formatDateICS(event.end);
    const uid = generateUID(index, event.start);
    return [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      "END:VEVENT"
    ].join("\r\n");
  });

  const footer = "END:VCALENDAR";
  return [...header, ...eventStrings, footer].join("\r\n");
};

const DeadlineCalendar = ({ userId, isCollapsed, setIsCollapsed, loading, setLoading }) => {
  const [date, setDate] = useState(new Date());
  const [systemDeadlines, setSystemDeadlines] = useState([]);
  const [noteDeadlines, setNoteDeadlines] = useState([]);
  const [selectedDeadlines, setSelectedDeadlines] = useState([]);

  // Fetch deadlines from both sources
  const fetchDeadlines = async () => {
    setLoading(true);
    try {
      if (userId) {
        const { success: sysSuccess, data: sysData, message: sysMessage } = await getDeadlinesForUser(userId);
        if (sysSuccess) {
          setSystemDeadlines(sysData);
        } else {
          console.log(sysMessage);
        }
        const { success: notesSuccess, data: notesData } = await getNotesForUser(userId);
        if (notesSuccess && notesData) {
          const filteredNotes = notesData.filter(note => note.deadline);
          setNoteDeadlines(filteredNotes);
        }
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    }
    setLoading(false);
  };

  const combinedDeadlines = [...systemDeadlines, ...noteDeadlines];

  const getDeadlinesForDate = (selectedDate) => {
    const formattedSelected = formatDate(selectedDate);
    return combinedDeadlines.filter(deadline => {
      const noteDateStr = deadline.deadlineDate || deadline.deadline;
      const noteDate = new Date(noteDateStr);
      return formatDate(noteDate) === formattedSelected;
    });
  };

  const onDateChange = (newDate) => {
    setDate(newDate);
    setSelectedDeadlines(getDeadlinesForDate(newDate));
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const deadlinesForDate = getDeadlinesForDate(date);
      if (deadlinesForDate.length > 0) {
        const firstDeadline = deadlinesForDate[0];
        const isCustom = !firstDeadline.collegeName;
        const gradientClass = isCustom
          ? "bg-gradient-to-r from-green-500 to-blue-400"
          : "bg-gradient-to-r from-red-500 to-orange-400";
        const displayText = deadlinesForDate.length > 1
          ? `⚠️ ${deadlinesForDate.length} Deadlines`
          : (firstDeadline.collegeName || firstDeadline.title);
        return (
          <div className="deadline-marker flex justify-center items-center">
            <span className={`text-xs text-white ${gradientClass} rounded-md px-2 py-1`}>
              {displayText}
            </span>
          </div>
        );
      }
    }
  };

  // Mass export: Create an ICS file from all deadlines and trigger a download
  const exportAllDeadlinesToICS = () => {
    const events = combinedDeadlines.map(deadline => {
      const eventDate = new Date(deadline.deadlineDate || deadline.deadline);
      const start = eventDate;
      const end = new Date(eventDate.getTime() + 60 * 60 * 1000); // 1-hour event duration
      return {
        title: deadline.collegeName || deadline.title || "Deadline",
        start,
        end,
        description: deadline.deadlineType || "Deadline"
      };
    });
    
    const icsContent = generateICSContent(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    saveAs(blob, 'deadlines.ics');
  };

  useEffect(() => {
    if (userId) {
      fetchDeadlines();
    }
  }, [userId]);

  return (
    <div className="calendar-container max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Deadlines Calendar</h1>
      
      <div className="calendar mb-6">
        <Calendar
          onChange={onDateChange}
          value={date}
          tileContent={tileContent}
          className="w-full max-w-xl mx-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Mass Export Button */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={exportAllDeadlinesToICS}
          className="text-lg text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-md"
        >
          ⬇️ Download Calendar Data (ics file)
        </button>
      </div>

      {/* Display deadlines for the selected date */}
      <div className="deadlines-list mt-6 space-y-4">
        {selectedDeadlines.length === 0 ? (
          <p className="text-gray-500">No deadlines for this date.</p>
        ) : (
          <ul className="space-y-4">
            {selectedDeadlines.map((deadline, index) => {
              const noteDateStr = deadline.deadlineDate || deadline.deadline;
              const eventDate = new Date(noteDateStr);
              const start = eventDate;
              const end = new Date(eventDate.getTime() + 60 * 60 * 1000);
              const formatForCalendar = (date) =>
                date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
              const startICS = formatForCalendar(start);
              const endICS = formatForCalendar(end);
              const title = encodeURIComponent(deadline.collegeName || deadline.title || "Deadline");
              const details = encodeURIComponent(deadline.deadlineType || "Deadline");
              const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startICS}/${endICS}&details=${details}`;
              
              return (
                <li key={index}>
                  <div className="deadline bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-blue-700">
                      {deadline.collegeName || deadline.title}
                    </h3>
                    <p className="text-gray-700 mt-2 bg-white rounded-lg mr-2 p-4 break-all whitespace-normal">
                      {deadline.deadlineType || deadline.content || ""}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(noteDateStr).toLocaleDateString()} 
                    </p>
                    <a
                      href={googleCalendarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
                    >
                      Add to Google Calendar
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="text-lg mt-6 text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg p-4 rounded-lg"
      >
        <strong>{isCollapsed ? "Reveal all Deadlines" : "Hide Deadlines"}</strong>
      </button>

      <div
        className={`deadlines-list mt-6 transition-all duration-300 overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-100 to-pink-50 p-4 rounded-lg ${isCollapsed ? "max-h-10" : "max-h-[100vh] overflow-y-auto"}`}
      >
        {combinedDeadlines.length === 0 ? (
          <p className="text-gray-500">No deadlines available.</p>
        ) : (
          <ul>
            {combinedDeadlines.map((deadline, index) => {
              const noteDateStr = deadline.deadlineDate || deadline.deadline;
              const eventDate = new Date(noteDateStr);
              const start = eventDate;
              const end = new Date(eventDate.getTime() + 60 * 60 * 1000);
              const formatForCalendar = (date) =>
                date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
              const startICS = formatForCalendar(start);
              const endICS = formatForCalendar(end);
              const title = encodeURIComponent(deadline.collegeName || deadline.title || "Deadline");
              const details = encodeURIComponent(deadline.deadlineType || "Deadline");
              const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startICS}/${endICS}&details=${details}`;
              
              return (
                <li key={index} className="deadline-item mb-4">
                  <div className="deadline bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold">{deadline.collegeName || deadline.title}</h3>
                    <p className="text-gray-600">{deadline.deadlineType || ""}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(noteDateStr).toLocaleDateString()}
                    </p>
                    <a
                      href={googleCalendarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm"
                    >
                      Add to Google Calendar
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeadlineCalendar;
