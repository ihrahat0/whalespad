import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Adjust path as needed
import { FiEdit, FiTrash2, FiUserPlus } from 'react-icons/fi';

interface AdminManagementProps {
  adminUser: { id: string; username: string; role: string };
}

const AdminManagementComponent: React.FC<AdminManagementProps> = ({ adminUser }) => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState('');
  const [newRole, setNewRole] = useState('admin'); // Default to regular admin
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setError(null);
    setSuccess(null);
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, role, profile_picture_url');
    if (error) {
      console.error('Error fetching admins:', error);
      setError('Failed to fetch admins.');
    } else {
      setAdmins(data || []);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newUsername || !newPassword) {
      setError('Username and password are required.');
      return;
    }
    if (adminUser.role !== 'super_admin') {
        setError('Only super admins can add new admins.');
        return;
    }

    // In a real application, you would hash the password before storing
    const { error } = await supabase
      .from('admins')
      .insert([{ username: newUsername, password: newPassword, role: newRole, profile_picture_url: newProfilePicture }]);

    if (error) {
      console.error('Error adding admin:', error);
      setError(`Failed to add admin: ${error.message}`);
    } else {
      setSuccess('Admin added successfully!');
      setNewUsername('');
      setNewPassword('');
      setNewProfilePicture('');
      setNewRole('admin');
      fetchAdmins();
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    setError(null);
    setSuccess(null);

    if (adminUser.role !== 'super_admin') {
        setError('Only super admins can delete admins.');
        return;
    }
    if (adminUser.id === id) {
        setError('You cannot delete your own admin account.');
        return;
    }

    if (window.confirm('Are you sure you want to delete this admin? This will also unassign them from any blog posts.')) {
      try {
        // First, set author_id to NULL for all blogs associated with this admin
        const { error: updateError } = await supabase
          .from('blogs')
          .update({ author_id: null })
          .eq('author_id', id);

        if (updateError) {
          throw new Error(`Failed to unassign blogs: ${updateError.message}`);
        }

        // Then, delete the admin
        const { error: deleteError } = await supabase
          .from('admins')
          .delete()
          .eq('id', id);

        if (deleteError) {
          throw deleteError;
        }

        setSuccess('Admin deleted successfully!');
        fetchAdmins();
      } catch (e: any) {
        console.error('Error deleting admin:', e);
        setError(`Failed to delete admin: ${e.message}`);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-purple-300 mb-6">Add New Admin</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <label htmlFor="newUsername" className="block text-gray-300 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              id="newUsername"
              className="shadow appearance-none border rounded w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline border-gray-600 focus:border-purple-500"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-gray-300 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="newPassword"
              className="shadow appearance-none border rounded w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline border-gray-600 focus:border-purple-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newProfilePicture" className="block text-gray-300 text-sm font-bold mb-2">Profile Picture URL (Optional)</label>
            <input
              type="text"
              id="newProfilePicture"
              className="shadow appearance-none border rounded w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline border-gray-600 focus:border-purple-500"
              value={newProfilePicture}
              onChange={(e) => setNewProfilePicture(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="newRole" className="block text-gray-300 text-sm font-bold mb-2">Role</label>
            <select
              id="newRole"
              className="shadow appearance-none border rounded w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline border-gray-600 focus:border-purple-500"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              disabled={adminUser.role !== 'super_admin'} // Only super admin can change roles
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            disabled={adminUser.role !== 'super_admin'}
          >
            <FiUserPlus className="inline-block mr-2" /> Add Admin
          </button>
        </form>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-purple-300 mb-6">Existing Admins</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-600">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300"></th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Username</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Role</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (admins.map((admin) => (
                <tr key={admin.id} className="border-t border-gray-600 hover:bg-gray-600 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {admin.profile_picture_url ? (
                      <img src={admin.profile_picture_url} alt={admin.username} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 text-xl font-bold">
                        {admin.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">{admin.username}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      admin.role === 'super_admin' ? 'bg-purple-600' : 'bg-gray-500'
                    }`}>
                      {admin.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {admin.id !== adminUser.id && adminUser.role === 'super_admin' && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagementComponent; 