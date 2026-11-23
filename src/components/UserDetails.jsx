
function UserDetails({ member, onClose }) {
  if (!member) {
    return null;
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Member Details</h2>

        <button
          type="button"
          className="btn-close"
          aria-label="Close member details"
          onClick={onClose}
        />
      </div>

      <div className="card-body">
        <div className="d-flex flex-column flex-sm-row gap-3 align-items-center">
          <img
            src={member.image}
            alt={`${member.firstName} ${member.lastName}`}
            className="rounded-circle"
            width="100"
            height="100"
          />

          <div>
            <h3 className="h4">
              {member.firstName} {member.lastName}
            </h3>
            <p className="mb-1">
              <strong>ID:</strong> {member.id}
            </p>
            <p className="mb-1">
              <strong>Email:</strong> {member.email}
            </p>
            <p className="mb-1">
              <strong>Phone:</strong> {member.phone}
            </p>
            <p className="mb-1">
              <strong>City:</strong> {member.address?.city || 'Not available'}
            </p>
            <p className="mb-0">
              <strong>Company:</strong>{' '}
              {member.company?.name || 'Not available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
