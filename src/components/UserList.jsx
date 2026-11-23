
import UserCard from './UserCard.jsx';

function UserList({ members, onSelectMember, onDeleteMember }) {
  if (members.length === 0) {
    return (
      <div className="alert alert-info">
        No members found.
      </div>
    );
  }

  return (
    <div className="row g-4">
      {members.map((member) => (
        <div className="col-12 col-sm-6 col-lg-4" key={member.id}>
          <UserCard
            member={member}
            onSelect={onSelectMember}
            onDelete={onDeleteMember}
          />
        </div>
      ))}
    </div>
  );
}

export default UserList;
