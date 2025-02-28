import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getStaffRoles, 
  getAdminMetrics, 
  getAdminColleges, 
  getAdminStaff, 
  getAdminMajorColleges,
  getAdminUserColleges,
  getAdminProfileNotes,
} from '../api/api';
import { auth } from '../firebase';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({});
  const [colleges, setColleges] = useState([]);
  const [staff, setStaff] = useState([]);
  const [majorColleges, setMajorColleges] = useState([]);
  const [userColleges, setUserColleges] = useState([]);
  const [profileNotes, setProfileNotes] = useState([]);
  const [error, setError] = useState(null);
  
  // Collapsible sections
  const [showMetrics, setShowMetrics] = useState(true);
  const [showColleges, setShowColleges] = useState(true);
  const [showStaff, setShowStaff] = useState(true);
  const [showMajorColleges, setShowMajorColleges] = useState(true);
  const [showUserColleges, setShowUserColleges] = useState(true);
  const [showProfileNotes, setShowProfileNotes] = useState(true);

  // Filtering state variables
  const [collegeSearchTerm, setCollegeSearchTerm] = useState('');
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [majorSearchTerm, setMajorSearchTerm] = useState('');
  const [userCollegesSearchTerm, setUserCollegesSearchTerm] = useState('');
  const [profileNotesSearchTerm, setProfileNotesSearchTerm] = useState('');

  // Expanded view toggles for individual records
  const [expandedColleges, setExpandedColleges] = useState({});
  const [expandedStaff, setExpandedStaff] = useState({});
  const [expandedMajors, setExpandedMajors] = useState({});
  const [expandedUserColleges, setExpandedUserColleges] = useState({});
  const [expandedProfileNotes, setExpandedProfileNotes] = useState({});

  const navigate = useNavigate();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/');
        return;
      }
      const uid = currentUser.uid;
      // Verify admin role
      const { success, data: role } = await getStaffRoles(uid);
      if (!success || role !== 'admin') {
        navigate('/');
        return;
      }
      // Fetch dashboard metrics
      const metricsResponse = await getAdminMetrics(uid);
      if (metricsResponse.success) {
        setMetrics(metricsResponse.metrics);
      } else {
        setError(metricsResponse.message);
      }
      // Fetch colleges
      const collegesResponse = await getAdminColleges(uid);
      if (collegesResponse.success) {
        setColleges(collegesResponse.colleges);
      }
      // Fetch staff members
      const staffResponse = await getAdminStaff(uid);
      if (staffResponse.success) {
        setStaff(staffResponse.staff);
      }
      // Fetch major colleges
      const majorCollegesResponse = await getAdminMajorColleges(uid);
      if (majorCollegesResponse.success) {
        setMajorColleges(majorCollegesResponse.majorColleges);
      }
      // Fetch user colleges
      const userCollegesResponse = await getAdminUserColleges(uid);
      if (userCollegesResponse.success) {
        setUserColleges(userCollegesResponse.userColleges);
      }
      // Fetch profile notes
      const profileNotesResponse = await getAdminProfileNotes(uid);
      if (profileNotesResponse.success) {
        setProfileNotes(profileNotesResponse.profileNotes);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Error fetching admin data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Filtering logic
  const filteredColleges = colleges.filter(college => 
    college.name.toLowerCase().includes(collegeSearchTerm.toLowerCase())
  );
  const filteredStaff = staff.filter(member =>
    member.userId.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
    (member.role && member.role.toLowerCase().includes(staffSearchTerm.toLowerCase()))
  );
  const filteredMajors = majorColleges.filter(major =>
    major.name.toLowerCase().includes(majorSearchTerm.toLowerCase())
  );
  const filteredUserColleges = userColleges.filter(doc =>
    doc.userId.toLowerCase().includes(userCollegesSearchTerm.toLowerCase())
  );
  const filteredProfileNotes = profileNotes.filter(profile =>
    profile.userId.toLowerCase().includes(profileNotesSearchTerm.toLowerCase())
  );

  // Toggle expanded view for a record by id (for each section)
  const toggleExpanded = (id, type) => {
    if (type === 'college') {
      setExpandedColleges(prev => ({ ...prev, [id]: !prev[id] }));
    } else if (type === 'staff') {
      setExpandedStaff(prev => ({ ...prev, [id]: !prev[id] }));
    } else if (type === 'major') {
      setExpandedMajors(prev => ({ ...prev, [id]: !prev[id] }));
    } else if (type === 'userColleges') {
      setExpandedUserColleges(prev => ({ ...prev, [id]: !prev[id] }));
    } else if (type === 'profileNotes') {
      setExpandedProfileNotes(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          onClick={fetchAllData}
        >
          Refresh Data
        </button>
      </div>
      <p className="mb-6">Welcome, Admin!</p>
      
      {/* Dashboard Metrics Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2">Dashboard Metrics</h2>
          <button 
            className="text-sm text-blue-500" 
            onClick={() => setShowMetrics(!showMetrics)}
          >
            {showMetrics ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {showMetrics && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white shadow rounded">
              <h3 className="font-bold">Colleges</h3>
              <p>{metrics.colleges}</p>
            </div>
            <div className="p-4 bg-white shadow rounded">
              <h3 className="font-bold">Staff</h3>
              <p>{metrics.staff}</p>
            </div>
            <div className="p-4 bg-white shadow rounded">
              <h3 className="font-bold">Profiles</h3>
              <p>{metrics.profiles}</p>
            </div>
          </div>
        )}
      </section>

      {/* Colleges Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2">Colleges</h2>
          <button 
            className="text-sm text-blue-500" 
            onClick={() => setShowColleges(!showColleges)}
          >
            {showColleges ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {showColleges && (
          <>
            <input 
              type="text" 
              placeholder="Search Colleges by Name..." 
              value={collegeSearchTerm}
              onChange={(e) => setCollegeSearchTerm(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
            />
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">City</th>
                  <th className="py-2 px-4 border-b">State</th>
                  <th className="py-2 px-4 border-b">Created At</th>
                  <th className="py-2 px-4 border-b">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredColleges.map((college) => (
                  <tr key={college._id}>
                    <td className="py-2 px-4 border-b">{college.name}</td>
                    <td className="py-2 px-4 border-b">{college.demographics?.schoolCity || "N/A"}</td>
                    <td className="py-2 px-4 border-b">{college.demographics?.schoolState || "N/A"}</td>
                    <td className="py-2 px-4 border-b">
                      {college.createdAt ? new Date(college.createdAt.$date || college.createdAt).toLocaleString() : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        onClick={() => toggleExpanded(college._id, 'college')}
                        className="text-blue-500 text-sm"
                      >
                        {expandedColleges[college._id] ? 'Hide' : 'Show'} Full Data
                      </button>
                      {expandedColleges[college._id] && (
                        <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-auto">
                          {JSON.stringify(college, null, 2)}
                        </pre>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
      
      {/* Staff Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2">Staff Members</h2>
          <button 
            className="text-sm text-blue-500" 
            onClick={() => setShowStaff(!showStaff)}
          >
            {showStaff ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {showStaff && (
          <>
            <input 
              type="text" 
              placeholder="Filter Staff by User ID or Role..." 
              value={staffSearchTerm}
              onChange={(e) => setStaffSearchTerm(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
            />
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">User ID</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member._id}>
                    <td className="py-2 px-4 border-b">{member.userId}</td>
                    <td className="py-2 px-4 border-b">{member.role}</td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        onClick={() => toggleExpanded(member._id, 'staff')}
                        className="text-blue-500 text-sm"
                      >
                        {expandedStaff[member._id] ? 'Hide' : 'Show'} Full Data
                      </button>
                      {expandedStaff[member._id] && (
                        <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-auto">
                          {JSON.stringify(member, null, 2)}
                        </pre>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      {/* Major Colleges Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2">Major Colleges</h2>
          <button 
            className="text-sm text-blue-500" 
            onClick={() => setShowMajorColleges(!showMajorColleges)}
          >
            {showMajorColleges ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {showMajorColleges && (
          <>
            <input 
              type="text" 
              placeholder="Search Majors by Name..." 
              value={majorSearchTerm}
              onChange={(e) => setMajorSearchTerm(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
            />
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Major</th>
                  <th className="py-2 px-4 border-b">Associated Colleges Count</th>
                  <th className="py-2 px-4 border-b">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredMajors.map((major) => (
                  <tr key={major._id}>
                    <td className="py-2 px-4 border-b">{major.name}</td>
                    <td className="py-2 px-4 border-b">{major.colleges?.length || 0}</td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        onClick={() => toggleExpanded(major._id, 'major')}
                        className="text-blue-500 text-sm"
                      >
                        {expandedMajors[major._id] ? 'Hide' : 'Show'} Full Data
                      </button>
                      {expandedMajors[major._id] && (
                        <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-auto">
                          {JSON.stringify(major, null, 2)}
                        </pre>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      {/* User Colleges Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2">User Colleges</h2>
          <button 
            className="text-sm text-blue-500" 
            onClick={() => setShowUserColleges(!showUserColleges)}
          >
            {showUserColleges ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {showUserColleges && (
          <>
            <input 
              type="text" 
              placeholder="Filter User Colleges by User ID..." 
              value={userCollegesSearchTerm}
              onChange={(e) => setUserCollegesSearchTerm(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
            />
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">User ID</th>
                  <th className="py-2 px-4 border-b">Colleges Added</th>
                  <th className="py-2 px-4 border-b">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredUserColleges.map((doc) => (
                  <tr key={doc._id}>
                    <td className="py-2 px-4 border-b">{doc.userId}</td>
                    <td className="py-2 px-4 border-b">
                      {doc.colleges.map((college, index) => (
                        <div key={index}>{college.collegeName}</div>
                      ))}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        onClick={() => toggleExpanded(doc._id, 'userColleges')}
                        className="text-blue-500 text-sm"
                      >
                        {expandedUserColleges[doc._id] ? 'Hide' : 'Show'} Full Data
                      </button>
                      {expandedUserColleges[doc._id] && (
                        <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-auto">
                          {JSON.stringify(doc, null, 2)}
                        </pre>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      {/* Profile Notes Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2">Profile Notes</h2>
          <button 
            className="text-sm text-blue-500" 
            onClick={() => setShowProfileNotes(!showProfileNotes)}
          >
            {showProfileNotes ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {showProfileNotes && (
          <>
            <input 
              type="text" 
              placeholder="Filter Profile Notes by User ID..." 
              value={profileNotesSearchTerm}
              onChange={(e) => setProfileNotesSearchTerm(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
            />
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">User ID</th>
                  <th className="py-2 px-4 border-b">Note Title</th>
                  <th className="py-2 px-4 border-b">Content</th>
                  <th className="py-2 px-4 border-b">Created At</th>
                  <th className="py-2 px-4 border-b">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfileNotes.map((profile) =>
                  profile.notes.map((note, index) => (
                    <tr key={`${profile._id}-${index}`}>
                      <td className="py-2 px-4 border-b">{profile.userId}</td>
                      <td className="py-2 px-4 border-b">{note.title}</td>
                      <td className="py-2 px-4 border-b">{note.content}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(note.createdAt.$date || note.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button 
                          onClick={() => toggleExpanded(profile._id + index, 'profileNotes')}
                          className="text-blue-500 text-sm"
                        >
                          {expandedProfileNotes[profile._id + index] ? 'Hide' : 'Show'} Full Data
                        </button>
                        {expandedProfileNotes[profile._id + index] && (
                          <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-auto">
                            {JSON.stringify(note, null, 2)}
                          </pre>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
