import React, { useState, useEffect } from 'react';
import { addNote, getNotesForUser, removeNote, updateNote } from '../api/api'; // Added updateNote import
import { auth } from "../firebase.js"
import TypingEffect from "../components/TypingEffect";
import Calendar from '../components/Calendar.js';

const MAX_NOTE_LENGTH = 1000;

const ProfilePage = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [notification, setNotification] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [, setCurrentNoteToEdit] = useState(null); // State for tracking note to edit
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState(null)

  const getUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
  };

  const userId = getUserId();

  const handleAddNote = async () => {
    if (newNote.title && newNote.content) {
        if (newNote.content.length > MAX_NOTE_LENGTH) {
            setNotification({
              message: `Note content cannot exceed ${MAX_NOTE_LENGTH} characters.`,
              type: "error",
            });
            return; // Prevent note creation if it's too long
          }
      newNote.created = new Date();
      newNote.updated = new Date();
      try {
        const result = await addNote(newNote);
        if (result.success) {
          setNewNote({ title: "", content: "" });
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

  const fetchUserInfo = () => {
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        name: user.displayName || 'No Name Provided',
        email: user.email,
        id: user.uid,
        photoURL: user.photoURL || '/assets/search.png', // Use a default if no photo
      });
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchUserInfo();
  }, [userId]);

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
    setNewNote({ title: note.title, content: note.content });
    setIsEditMode(true);
  };

  const handleUpdateNote = async () => {
    if (newNote.title && newNote.content) {
        if (newNote.content.length > MAX_NOTE_LENGTH) {
            setNotification({
              message: `Note content cannot exceed ${MAX_NOTE_LENGTH} characters.`,
              type: "error",
            });
            return; // Prevent note creation if it's too long
          }
      newNote.updated = new Date();
      try {
        const result = await updateNote(userId, newNote.title, newNote.content);
        if (result.success) {
          setIsEditMode(false);
          setCurrentNoteToEdit(null);
          setNewNote({ title: "", content: "" });
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
    setNewNote({ title: "", content: "" });
  };

  return (
    <div className="profile-container max-w-4xl mx-auto p-6">

    <h1 className="text-4xl font-bold text-center mb-8 shadow-lg rounded-lg p-3">Your Profile</h1>

    <div className="user-info bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-2">Your Information</h2>
        {userInfo ? (
          <div className="flex items-center">
            <img
              src={userInfo.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-xl font-bold">{userInfo.name}</h3>
              <p className="text-gray-600">{userInfo.email}</p>
              <p className="text-gray-600">{userInfo.id}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading user information...</p>
        )}
      </div>

        <Calendar 
        userId={userId}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        />
      <h2 className="text-4xl font-bold text-center mb-8">Your Notes</h2>

      <div className="note-form mb-8">
        <h2 className="text-2xl font-semibold">{isEditMode ? "Edit Note" : "Create a New Note"}</h2>
        <div className="bg-yellow-100 mt-2 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg">
          <p className="text-lg font-medium">
            ⚠️ Warning: At the current state, users are limited to 30 notes at a time.
          </p>
        </div>
        <input
          type="text"
          placeholder="Note Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="note-input p-2 mt-2 w-full border rounded-lg"
        />
        <textarea
          placeholder="Note Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="note-textarea p-2 mt-2 w-full border rounded-lg h-32"
        ></textarea>
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
            messages={[
                `Character Count ${newNote.content.length}/${MAX_NOTE_LENGTH}`
            ]}
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
      </div>

      <div className="notes-list mt-6">
        <h2 className="text-2xl font-semibold">Your Notes</h2>
        {notes.length === 0 ? (
          <p className="text-gray-500 mt-2">No notes yet. Create your first note!</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li key={note.id} className="note-item border-b py-4 flex items-center justify-between">
                <div className="note-content flex-1">
                  <h3 className="note-title text-lg font-bold text-blue-600 hover:text-blue-800 cursor-pointer">{note.title}</h3>
                  <p className="note-description text-gray-700 mt-2 bg-white rounded-lg mr-2 p-4">{note.content}</p>
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

export default ProfilePage;
