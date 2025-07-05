import { Link } from "react-router-dom";

const StatCard = ({ cardData ,loading}) => (
  <div className="col-md-4 mb-3">
    <div className="card stat-card" style={{ borderLeft: `4px solid var(--bs-danger)` }}>
      <div className="card-body">
        {loading ? (
          <div className="text-center py-3">
            <div className={`spinner-border text-danger`} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted mb-2">{cardData.admin}</h6>
              <h4 className="stat-value mb-0 text-danger">{cardData.count}</h4>
              <small className='text-success'>
                <i className={`bi bi-arrow-up-circle me-1`}></i>
                {/* {Math.abs(change.value)}% from last month */}
              </small>
            </div>
            <div className={`bg-primary bg-opacity-10 p-3 rounded`}>
              <i className={`bi   text-danger`} style={{ fontSize: "1.25rem" }}></i>
            </div>
          </div>
        )}
      </div>
      <div className="card-footer bg-transparent">
        <Link to="/" className="text-decoration-none d-flex justify-content-between align-items-center">
          <span>View Details</span>
          <i className="bi bi-chevron-right"></i>
        </Link>
      </div>
    </div>
  </div>
);

export default StatCard;