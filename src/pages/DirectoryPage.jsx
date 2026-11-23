import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import SearchBar from '../components/SearchBar.jsx';
import UserList from '../components/UserList.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import UserDetails from '../components/UserDetails.jsx';
import AddUserForm from '../components/AddUserForm.jsx';
import {
  getUsers,
  addUser,
  deleteUser
} from '../services/userService.js';



function DirectoryPage() {
  const { accessToken, refreshToken } = useAuth();
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const controller = new AbortController();

    async function loadMembers() {
      setLoading(true);
      setError('');

      try {
       const data = await getUsers(
        accessToken,
        controller.signal,
        refreshToken
      );

        setMembers(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (accessToken) {
  loadMembers();
}

    return () => {
      controller.abort();
    };
  }, [accessToken, refreshToken]);

  useEffect(() => {
    document.title = `Team Directory (${members.length} members)`;
  }, [members.length]);

  
  useEffect(() => {
    if (!successMessage) {
      return;
    }
  
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  
    return () => {
      clearTimeout(timer);
    };
  }, [successMessage]);


  const searchText = searchTerm.trim().toLowerCase();

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`;

    return (
      fullName.toLowerCase().includes(searchText) ||
      member.email.toLowerCase().includes(searchText) ||
      member.address.city.toLowerCase().includes(searchText)
    );
  });
async function handleAddMember(memberData) {
  setIsSaving(true);
  setSuccessMessage('');

  try {
    const createdMember = await addUser(
  accessToken,
  memberData,
  refreshToken
);

    const nextId = Math.max(0, ...members.map((member) => member.id)) + 1;

    const newMember = {
      ...createdMember,
      ...memberData,
      id: nextId,
      lastName: '',
      image: 'https://dummyjson.com/icon/100',
    };

    setMembers((previousMembers) => [newMember, ...previousMembers]);
    setSelectedMember(newMember);
    setSuccessMessage('Team member added successfully!');
  } finally {
  setIsSaving(false);
}
}


async function handleDeleteMember() {
  console.log('Delete function called');

  if (!memberToDelete) {
    console.log('No member selected');
    return;
  }

  console.log('Member ID:', memberToDelete.id);

  setIsDeleting(true);

  try {
   const result = await deleteUser(
  accessToken,
  memberToDelete.id,
  refreshToken
  );

    console.log('Delete API response:', result);

    setMembers((previousMembers) =>
      previousMembers.filter(
        (member) => member.id !== memberToDelete.id
      )
    );

    if (selectedMember?.id === memberToDelete.id) {
      setSelectedMember(null);
    }

    setMemberToDelete(null);
    setSuccessMessage('Team member deleted successfully!');

  } finally {
  setIsSaving(false);
}
}



  return (
    <>
      <Navbar />

      <main className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-primary">Team Directory</h1>

            <p className="text-muted mb-0">
              View and search your team members.
            </p>
          </div>

          <span className="badge text-bg-primary fs-6">
            Total Members: {members.length}
          </span>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
       
        <AddUserForm
          members={members}
          onAddMember={handleAddMember}
          isSaving={isSaving}
        />

        {successMessage && (
           <div className="alert alert-success" role="alert">
             {successMessage}
           </div>
        )}
        {loading && (
          <div className="text-center py-5" role="status">
            <div className="spinner-border text-primary" aria-hidden="true" />
            <p className="mt-2">Loading team members...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            {error}
            <button
              type="button"
              className="btn btn-outline-danger btn-sm ms-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-muted">
              Showing {filteredMembers.length} of {members.length} members
            </p>

            {selectedMember && (
            <UserDetails
              member={selectedMember}
              onClose={() => setSelectedMember(null)}
            />
          )}

          <UserList
          members={filteredMembers}
          onSelectMember={setSelectedMember}
          onDeleteMember={setMemberToDelete}
        />

          
{memberToDelete && (
  <div
    className="modal show d-block"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        <div className="modal-header">
          <h5 className="modal-title">Confirm Delete</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setMemberToDelete(null)}
          ></button>
        </div>

        <div className="modal-body">
          Are you sure you want to delete{' '}
          <strong>
            {memberToDelete.firstName} {memberToDelete.lastName}
          </strong>?
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setMemberToDelete(null)}
          >
            Cancel
          </button>

        <button
  type="button"
  className="btn btn-danger"
  onClick={handleDeleteMember}
  disabled={isDeleting}
>
  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
</button>
        </div>

      </div>
    </div>
  </div>
)}

                    </>
                  )}
                </main>
              </>
            );
          }

export default DirectoryPage;
