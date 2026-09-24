import { useState, useEffect } from 'react';
import { Save, Building2, Phone, Globe, Instagram, CheckSquare, Square } from 'lucide-react';
import api from '../../services/api';

const facilityOptions = [
  'Open Hall', 'Closed / Banquet Hall', 'Temple / Mandir', '10+ AC Rooms with Ducting',
  'Parking', 'Sound Facility', 'Decoration Facility', 'Catering Facility'
];

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b" style={{ borderColor: '#E8E3E0' }}>
        <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F7F1E6" }}><Icon size={19} style={{ color: "#C6A15B" }} /></span>
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
      <input {...props} className="w-full px-3 py-2.5 border rounded-xl bg-white focus:ring-2 focus:ring-[#C6A15B]/30 focus:border-[#C6A15B] focus:outline-none transition" style={{ borderColor: '#E8E3E0' }} />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1" style={{ color: '#211B19' }}>{label}</label>
      {children}
    </div>
  );
}

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [form, setForm] = useState({
    businessName: '',
    tagline: '',
    description: '',
    capacity: '',
    yearsExperience: '',
    eventsHosted: '',
    customers: '',
    googleRating: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    googleMapsUrl: '',
    instagram: '',
    facebook: '',
    youtube: '',
    facilities: []
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/settings');
        const s = res.data.data;
        if (s) {
          setForm({
            businessName: s.businessName || '',
            tagline: s.tagline || '',
            description: s.description || '',
            capacity: s.capacity || '',
            yearsExperience: s.yearsExperience || '',
            eventsHosted: s.eventsHosted || '',
            customers: s.customers || '',
            googleRating: s.googleRating || '',
            phone: s.contact?.phone || '',
            whatsapp: s.contact?.whatsapp || '',
            email: s.contact?.email || '',
            address: s.contact?.address || '',
            googleMapsUrl: s.contact?.googleMapsUrl || '',
            instagram: s.socialLinks?.instagram || '',
            facebook: s.socialLinks?.facebook || '',
            youtube: s.socialLinks?.youtube || '',
            facilities: s.facilities || []
          });
        }
      } catch (err) {
        setMessage({ type: 'info', text: 'No settings configured yet. Set up your business details below.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFacilityToggle = (fac) => {
    setForm(prev => ({
      ...prev,
      facilities: prev.facilities.includes(fac)
        ? prev.facilities.filter(f => f !== fac)
        : [...prev.facilities, fac]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        businessName: form.businessName,
        tagline: form.tagline,
        description: form.description,
        capacity: form.capacity ? parseInt(form.capacity) : 0,
        yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience) : 0,
        eventsHosted: form.eventsHosted ? parseInt(form.eventsHosted) : 0,
        customers: form.customers ? parseInt(form.customers) : 0,
        googleRating: form.googleRating ? parseFloat(form.googleRating) : 0,
        contact: {
          phone: form.phone,
          whatsapp: form.whatsapp,
          email: form.email,
          address: form.address,
          googleMapsUrl: form.googleMapsUrl,
        },
        socialLinks: {
          instagram: form.instagram,
          facebook: form.facebook,
          youtube: form.youtube,
        },
        facilities: form.facilities,
      };
      await api.patch('/settings', payload);
      localStorage.setItem('tb_settings_updated', Date.now().toString());
      setMessage({ type: 'success', text: 'Settings saved successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F7F5' }}>
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: '#C6A15B', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#F7F7F5' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6" style={{ color: '#211B19' }}>Settings</h1>

        {message.text && (
          <div className={`mb-6 p-3.5 rounded-xl text-sm border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : message.type === 'info' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Section icon={Building2} title="Business Info">
            <Input label="Business Name" value={form.businessName} onChange={e => handleChange('businessName', e.target.value)} placeholder="Triveni Bhavan" />
            <Input label="Tagline" value={form.tagline} onChange={e => handleChange('tagline', e.target.value)} placeholder="Your tagline here" />
            <Field label="Description">
              <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="w-full px-3 py-2.5 border rounded-xl bg-white focus:ring-2 focus:ring-[#C6A15B]/30 focus:border-[#C6A15B] focus:outline-none transition" rows={3} style={{ borderColor: '#E8E3E0' }} placeholder="About your business..." />
            </Field>
          </Section>

          <Section icon={Globe} title="Highlights">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Capacity (seats)" type="number" value={form.capacity} onChange={e => handleChange('capacity', e.target.value)} placeholder="500" />
              <Input label="Years Experience" type="number" value={form.yearsExperience} onChange={e => handleChange('yearsExperience', e.target.value)} placeholder="25" />
              <Input label="Events Hosted" type="number" value={form.eventsHosted} onChange={e => handleChange('eventsHosted', e.target.value)} placeholder="500" />
              <Input label="Customers Served" type="number" value={form.customers} onChange={e => handleChange('customers', e.target.value)} placeholder="10000" />
            </div>
            <div className="mt-2">
              <Input label="Google Rating" type="number" step="0.1" min="0" max="5" value={form.googleRating} onChange={e => handleChange('googleRating', e.target.value)} placeholder="4.8" />
              <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>Enter only the actual rating provided/verified by the business.</p>
            </div>
          </Section>

          <Section icon={Phone} title="Contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Phone (Call)" type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" />
              <Input label="WhatsApp Number" type="tel" value={form.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} placeholder="919876543210" />
            </div>
            <p className="text-xs mb-4 -mt-2" style={{ color: '#6B6B6B' }}>WhatsApp number should include country code without spaces or special characters (e.g. 919876543210)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="info@trivenibhavan.com" />
              <Input label="Google Maps URL" value={form.googleMapsUrl} onChange={e => handleChange('googleMapsUrl', e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
            <Input label="Address" value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="Full address" />
          </Section>

          <Section icon={Instagram} title="Social Links">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Instagram" value={form.instagram} onChange={e => handleChange('instagram', e.target.value)} placeholder="https://instagram.com/..." />
              <Input label="Facebook" value={form.facebook} onChange={e => handleChange('facebook', e.target.value)} placeholder="https://facebook.com/..." />
              <Input label="YouTube" value={form.youtube} onChange={e => handleChange('youtube', e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </Section>

          <Section icon={CheckSquare} title="Facilities">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {facilityOptions.map(fac => (
                <button key={fac} type="button" onClick={() => handleFacilityToggle(fac)} className="flex items-center gap-2 p-3.5 rounded-xl border text-left text-sm transition-all hover:shadow-sm" style={{ borderColor: form.facilities.includes(fac) ? '#C6A15B' : '#E8E3E0', backgroundColor: form.facilities.includes(fac) ? '#F7F1E6' : '#FFFFFF' }}>
                  {form.facilities.includes(fac) ? <CheckSquare size={16} style={{ color: '#C6A15B' }} /> : <Square size={16} style={{ color: '#B8B2AE' }} />}
                  <span>{fac}</span>
                </button>
              ))}
            </div>
          </Section>

          <div className="flex justify-end mb-8 pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium shadow-sm hover:opacity-95 transition-opacity disabled:opacity-60" style={{ backgroundColor: '#5A1E2B' }}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
