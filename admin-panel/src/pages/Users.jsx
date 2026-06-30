import { Fragment, useEffect, useState } from "react";

import api from "../services/api";
import { getAssetUrl } from "../utils/assets";

const roles = ["customer", "serviceman", "admin"];

const hasDocument = (user, field) => Boolean(user?.idProof?.[field]);

export default function Users() {
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState("");

  const loadUsers = async (role = roleFilter) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/admin/users", {
        params: role ? { role } : {},
      });
      setUsers(data.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = async (userId, updates) => {
    try {
      await api.patch(`/admin/users/${userId}`, updates);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user.");
    }
  };

  const getSubscriptionLabel = (user) => {
    if (user.role !== "serviceman") {
      return "—";
    }

    if (user.subscription?.hasActiveSubscription) {
      return `Active until ${new Date(user.subscription.subscriptionExpiresAt).toLocaleDateString("en-IN")}`;
    }

    if (user.subscription?.requiresPayment) {
      return "Payment required (Rs 99)";
    }

    return `${user.subscription?.freeServicesUsed || 0}/${user.subscription?.freeServiceLimit || 3} free used`;
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2 className="page-title">Users</h2>
          <p className="muted">Manage customers, servicemen and admins.</p>
        </div>
        <div className="form-grid">
          <select
            className="input"
            onChange={(event) => {
              setRoleFilter(event.target.value);
              loadUsers(event.target.value);
            }}
            value={roleFilter}
          >
            <option value="">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="card">Loading users...</div>}

      {!loading && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Area</th>
                <th>Subscription</th>
                <th>Documents</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userId = user.id || user._id;

                return (
                  <Fragment key={userId}>
                    <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="input"
                        onChange={(event) => updateUser(userId, { role: event.target.value })}
                        value={user.role}
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className="badge">{user.isActive ? "active" : "inactive"}</span>
                    </td>
                    <td>{user.serviceArea?.city || user.address?.city || "Not set"}</td>
                    <td>{getSubscriptionLabel(user)}</td>
                    <td>
                      {user.role === "serviceman" ? (
                        <button
                          className="btn secondary"
                          onClick={() =>
                            setExpandedUserId((current) => (current === userId ? "" : userId))
                          }
                          type="button"
                        >
                          {expandedUserId === userId ? "Hide" : "View"}
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <button
                        className={`btn ${user.isActive ? "danger" : "secondary"}`}
                        onClick={() => updateUser(userId, { isActive: !user.isActive })}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                  {expandedUserId === userId && user.role === "serviceman" ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="serviceman-docs-panel">
                          <p className="label">ID Proof</p>
                          <div className="doc-grid">
                            <div>
                              <p className="muted">Aadhar: {user.idProof?.aadharNumber || "Not set"}</p>
                              {hasDocument(user, "aadharImage") ? (
                                <img alt="Aadhar" className="doc-preview" src={getAssetUrl(user.idProof.aadharImage)} />
                              ) : null}
                            </div>
                            <div>
                              <p className="muted">
                                Driving license: {user.idProof?.drivingLicenseNumber || "Not set"}
                              </p>
                              {hasDocument(user, "drivingLicenseImage") ? (
                                <img
                                  alt="Driving license"
                                  className="doc-preview"
                                  src={getAssetUrl(user.idProof.drivingLicenseImage)}
                                />
                              ) : null}
                            </div>
                            <div>
                              <p className="muted">Voter ID: {user.idProof?.voterIdNumber || "Not set"}</p>
                              {hasDocument(user, "voterIdImage") ? (
                                <img alt="Voter ID" className="doc-preview" src={getAssetUrl(user.idProof.voterIdImage)} />
                              ) : null}
                            </div>
                            <div>
                              <p className="muted">Experience: {user.experienceYears || 0} years</p>
                              {hasDocument(user, "experienceCertificateImage") ? (
                                <img
                                  alt="Experience certificate"
                                  className="doc-preview"
                                  src={getAssetUrl(user.idProof.experienceCertificateImage)}
                                />
                              ) : null}
                            </div>
                          </div>
                          <div className="doc-grid">
                            {user.profilePhoto ? (
                              <img alt="Profile" className="doc-preview" src={getAssetUrl(user.profilePhoto)} />
                            ) : null}
                            {(user.serviceImages || []).map((imagePath) => (
                              <img alt="Service" className="doc-preview" key={imagePath} src={getAssetUrl(imagePath)} />
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
