import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    linkedin: "",
    bio: "",
    role: "",
  });

  // Fetch profile
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        bio: data.bio || "",
        role: data.role || "user",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchProfile();
        alert("Profile updated!");
      } else {
        const text = await res.text();
        alert("Update failed: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p className="text-center p-6 text-gray-500">⏳ Loading profile...</p>;
  if (!user)
    return <p className="text-center p-6 text-red-500">⚠️ Failed to load user data.</p>;

  // First-letter avatar
  const firstLetter = user.name ? user.name[0].toUpperCase() : "?";

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-gray-900 text-white p-8 rounded-2xl shadow-lg space-y-8">
      <h2 className="text-4xl font-bold text-yellow-400">👤 Profile</h2>

      {/* Top section: Avatar + basic info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-shrink-0 w-32 h-32 rounded-full bg-blue-500 text-white flex items-center justify-center text-5xl font-bold">
          {firstLetter}
        </div>

        <div className="flex-1 grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-400">GitHub</label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub URL"
              className="mt-1 w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-400">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              className="mt-1 w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-400">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Short bio..."
              className="mt-1 w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-400">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-400">Joined</label>
            <input
              type="text"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
              disabled
              className="mt-1 w-full p-2 rounded bg-gray-800 text-gray-400 border border-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div>
        <button
          onClick={handleSubmit}
          disabled={updating}
          className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded hover:bg-yellow-500 transition"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
