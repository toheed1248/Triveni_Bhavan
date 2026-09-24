import { useState } from 'react';
import { User, Lock, Save, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6" style={{ borderColor: '#E8E3E0' }}>
      <div className="flex items-center gap-3 mb-5 pb-3 border-b" style={{ borderColor: '#E8E3E0' }}>
        <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F7F1E6' }}>
          <Icon size={19} style={{ color: '#C6A15B' }} />
        </span>
        <h2 className="text-lg font-semibold" style={{ color: '#211B19' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1" style={{ color: '#211B19' }}>{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2.5 border rounded-xl bg-white focus:ring-2 focus:ring-[#C6A15B]/30 focus:border-[#C6A15B] focus:outline-none transition"
        style={{ borderColor: '#E8E3E0' }}
      />
    </div>
  );
}

const Profile = () => {
  const { admin, updateProfile, changePassword } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      await updateProfile(profileForm);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPw(true);
    setPwMsg({ type: '', text: '' });

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      setSavingPw(false);
      return;
    }

    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      setSavingPw(false);
      return;
    }

    try {
      await changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#F7F7F5' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6" style={{ color: '#211B19' }}>
          My Profile
        </h1>

        {/* Profile Info */}
        <form onSubmit={handleProfileSubmit}>
          <Section icon={User} title="Profile Information">
            {profileMsg.text && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-xl border p-3.5 text-sm ${
                  profileMsg.type === 'error'
                    ? 'border-red-100 bg-red-50 text-red-700'
                    : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                }`}
              >
                {profileMsg.type === 'error' ? <X size={16} /> : <CheckCircle2 size={16} />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              placeholder="Admin name"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="admin@trivenibhavan.com"
              required
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium shadow-sm hover:opacity-95 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: '#5A1E2B' }}
              >
                <Save size={18} />
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </Section>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordSubmit}>
          <Section icon={Lock} title="Change Password">
            {pwMsg.text && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-xl border p-3.5 text-sm ${
                  pwMsg.type === 'error'
                    ? 'border-red-100 bg-red-50 text-red-700'
                    : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                }`}
              >
                {pwMsg.type === 'error' ? <X size={16} /> : <CheckCircle2 size={16} />}
                <span>{pwMsg.text}</span>
              </div>
            )}

            <Input
              label="Current Password"
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              placeholder="Enter new password (min 6 characters)"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={pwForm.confirmPassword}
              onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              required
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPw}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium shadow-sm hover:opacity-95 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: '#5A1E2B' }}
              >
                <Lock size={18} />
                {savingPw ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </Section>
        </form>
      </div>
    </div>
  );
};

export default Profile;
