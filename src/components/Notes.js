// src/components/Notes.js
import React, { useState, useEffect } from 'react';
import { addNote, getNotesForUser, removeNote, updateNote } from '../api/api';
import TypingEffect from './TypingEffect'; 

const MAX_NOTE_LENGTH = 2000;

const Notes = ({ userId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", deadline: "" });
  const [notification, setNotification] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [, setCurrentNoteToEdit] = useState(null); // State for tracking note to edit

  const fetchNotes = async () => {
    try {
      if (userId) {
        const { success, data, message } = await getNotesForUser(userId);
        if (success) {
          setNotes(data);
        } else {
          console.log(message);
        }
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const handleAddNote = async () => {
    if (newNote.title && newNote.content) {
      if (newNote.content.length > MAX_NOTE_LENGTH) {
        setNotification({
          message: `Note content cannot exceed ${MAX_NOTE_LENGTH} characters.`,
          type: "error",
        });
        return;
      }
      
      // Create a note object with proper local date conversion for deadline
      const noteToAdd = {
        title: newNote.title,
        content: newNote.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline: newNote.deadline ? parseLocalDate(newNote.deadline) : null,
      };
  
      try {
        const result = await addNote(noteToAdd);
        if (result.success) {
          setNewNote({ title: "", content: "", deadline: "" });
          setNotification({
            message: "Note successfully added to your profile! 🎉",
            type: "success",
          });
          fetchNotes();
        } else {
          setNotification({
            message: `Failed to create note: ${result.message}`,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error adding note:", error);
      }
    } else {
      setNotification({
        message: `Failed to create note: Title and Content must be filled out`,
        type: "error",
      });
    }
  };
  
  // Helper to parse a local date string (YYYY-MM-DD) into a Date object in local time
  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  };
  

  const handleDeleteNote = async (noteToRemove) => {
    const { success, message } = await removeNote(noteToRemove.title);
    if (success) {
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.title !== noteToRemove.title)
      );
    } else {
      console.error("Failed to remove note:", message);
    }
  };

  const handleEditNote = (note) => {
    setCurrentNoteToEdit(note);
    setNewNote({ title: note.title, content: note.content, deadline: note.deadline || "" });
    setIsEditMode(true);
  };

  const handleUpdateNote = async () => {
    if (newNote.title && newNote.content) {
      if (newNote.content.length > MAX_NOTE_LENGTH) {
        setNotification({
          message: `Note content cannot exceed ${MAX_NOTE_LENGTH} characters.`,
          type: "error",
        });
        return;
      }
      newNote.updated = new Date();
      // If deadline is empty, set it to null
      if (!newNote.deadline) newNote.deadline = null;
      try {
        const result = await updateNote(userId, newNote.title, newNote.content);
        if (result.success) {
          setIsEditMode(false);
          setCurrentNoteToEdit(null);
          setNewNote({ title: "", content: "", deadline: "" });
          setNotification({
            message: "Note successfully updated! 🎉",
            type: "success",
          });
          fetchNotes();
        } else {
          setNotification({
            message: `Failed to update note: ${result.message}`,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error updating note:", error);
      }
    } else {
      setNotification({
        message: `Failed to update note: Title and Content must be filled out`,
        type: "error",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setCurrentNoteToEdit(null);
    setNewNote({ title: "", content: "", deadline: "" });
  };

  return (
    <div className="note-form mb-8">
      <h2 className="text-2xl font-semibold">{isEditMode ? "Edit Note" : "Create a New Note"}</h2>
      <div className="bg-yellow-100 mt-2 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg">
        <p className="text-lg font-medium">
          ⚠️ Warning: At the current state, users are limited to <u>30 notes</u> at a time and you <u>cannot currently edit Titles</u>
        </p>
      </div>
      <input
        type="text"
        placeholder="Note Title"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        className="note-input p-2 mt-2 w-full border rounded-lg"
        disabled={isEditMode}
      />
      <textarea
        placeholder="Note Content"
        value={newNote.content}
        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        className="note-textarea p-2 mt-2 w-full border rounded-lg h-32"
      ></textarea>
      {/* Optional Deadline Input */}
      <input
        type="date"
        value={newNote.deadline || ""}
        onChange={(e) => setNewNote({ ...newNote, deadline: e.target.value })}
        className="note-deadline-input p-2 mt-2 w-full border rounded-lg"
      />
      <div className="flex space-x-4 mt-4">
        <button
          onClick={isEditMode ? handleUpdateNote : handleAddNote}
          className="btn-create-note bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          {isEditMode ? "Update Note" : "Create Note"}
        </button>
        {isEditMode && (
          <button
            onClick={handleCancelEdit}
            className="btn-cancel bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
        <TypingEffect
          messages={[`Character Count ${newNote.content.length}/${MAX_NOTE_LENGTH}`]}
          speed={75}
          delay={1000}
          fontSize={"text-2xl"}
        />
      </div>
      {notification && (
        <div
          className={`p-4 mt-5 mb-4 rounded-lg text-center text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}
      <div className="notes-list mt-6">
        <h2 className="text-2xl font-semibold">Your Notes</h2>
        {notes.length === 0 ? (
          <p className="text-gray-500 mt-2">No notes yet. Create your first note!</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li key={note.id || note._id} className="note-item border-b py-4 flex items-center justify-between">
                <div className="note-content flex-1">
                  <h3 className="note-title text-lg font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                    {note.title}
                  </h3>
                  <p className="note-description text-gray-700 mt-2 bg-white rounded-lg mr-2 p-4 break-all whitespace-normal">
                    {note.content}
                  </p>
                  {note.deadline && (
                    <div className="note-deadline mt-2">
                      <span className="inline-block bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                        Deadline: {new Date(note.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="note-actions flex space-x-2">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="btn-edit flex items-center text-blue-500 hover:text-blue-700 border px-3 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <span className="mr-2">✏️</span> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note)}
                    className="btn-delete flex items-center text-red-500 hover:text-red-700 border px-3 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <span className="mr-2">🗑️</span> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notes;
