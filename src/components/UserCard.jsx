function UserCard({ member, onSelect, onDelete }) {
  return (
    <div
      className="card h-100 shadow-sm"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(member)}
    >
      <div className="card-body text-center">
        <img
          src={member.image}
          alt={`${member.firstName} ${member.lastName}`}
          className="rounded-circle mb-3"
          width="80"
          height="80"
        />

        <h5 className="card-title">
          {member.firstName} {member.lastName}
        </h5>

        <p className="card-text mb-1">{member.email}</p>
        <p className="card-text mb-1">{member.phone}</p>
        <p className="card-text mb-1">
          {member.address?.city || 'Not available'}
        </p>
        <p className="card-text">
          {member.company?.name || 'Not available'}
        </p>

        
<div className="d-flex justify-content-center gap-2">
  <button
    type="button"
    className="btn btn-primary btn-sm"
    onClick={(event) => {
      event.stopPropagation();
      onSelect(member);
    }}
  >
    View Details
  </button>

  <button
    type="button"
    className="btn btn-danger btn-sm"
    onClick={(event) => {
    event.stopPropagation();
    onDelete(member);
  }}
  >
    Delete
  </button>
 </div>

   </div>
   </div>
  );
}

export default UserCard;
