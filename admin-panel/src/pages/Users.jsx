import { useEffect, useState } from "react";

import api from "../services/api";

const roles = ["customer", "serviceman", "admin"];

export default function Users() {
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className="input"
                      onChange={(event) => updateUser(user._id, { role: event.target.value })}
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
                  <td>
                    <button
                      className={`btn ${user.isActive ? "danger" : "secondary"}`}
                      onClick={() => updateUser(user._id, { isActive: !user.isActive })}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
