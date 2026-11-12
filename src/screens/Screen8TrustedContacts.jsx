import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  Users,
  UserPlus,
  Trash2,
  Phone,
  MessageSquare,
  Share2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  X,
  Bell
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Screen8TrustedContacts() {
  const {
    contacts,
    addContact,
    removeContact,
    toggleAutoShare,
    activityLogs,
    addLog,
    ride
  } = useSafety();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('Family');
  const [newAutoShare, setNewAutoShare] = useState(true);

  // Simulation notification feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateContact = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    soundEffects.playTactileClick();
    addContact({
      name: newName.trim(),
      phone: newPhone.trim(),
      relation: newRelation,
      autoShareNight: newAutoShare,
      notifyOnSOS: true
    });

    setNewName('');
    setNewPhone('');
    setAddModalOpen(false);
    showToast(`Added ${newName} to emergency circle`);
  };

  const handleSimulateBroadcast = () => {
    soundEffects.playTactileClick();
    addLog(
      "Emergency Broadcast Dispatched",
      `Simulated high-priority SMS & automated voice alert broadcast to ${contacts.length} trusted contacts with encrypted coordinates.`,
      "danger"
    );
    showToast(`Simulated emergency notifications broadcast to ${contacts.length} contacts!`);
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Trusted Contacts</h2>
          </div>
          <p className="text-xs text-slate-400">Emergency Guardians & Night Ride Circle</p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-semibold text-xs shadow-md transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add New</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 text-xs shadow-xl animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Night Auto-Share Preference Notice */}
      <div className="p-3 rounded-xl bg-midnight-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-white">Night Owl Auto-Sharing</h4>
          <p className="text-[10px] text-slate-400">Automatically shares rides between 9:00 PM – 6:00 AM</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-mono text-[10px] border border-emerald-800/40">
          Enabled
        </span>
      </div>

      {/* Contacts List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Guardians ({contacts.length})
        </h3>

        {contacts.map((c) => (
          <div
            key={c.id}
            className="p-3 rounded-xl bg-midnight-900 border border-slate-800/90 shadow-sm flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">{c.name}</h4>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono">
                  {c.relation}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{c.phone}</p>

              {/* Auto Share Toggle */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => toggleAutoShare(c.id)}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                    c.autoShareNight
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.autoShareNight ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span>{c.autoShareNight ? 'Auto-Share Night Rides' : 'SOS Only'}</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundEffects.playTactileClick();
                  showToast(`Simulated safe call to ${c.name}...`);
                }}
                className="p-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40"
                title="Call Contact"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  soundEffects.playTactileClick();
                  showToast(`Simulated SMS sent to ${c.name}`);
                }}
                className="p-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800/40"
                title="Send SMS"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => removeContact(c.id)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                title="Remove Contact"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simulate Emergency Broadcast Button */}
      <button
        onClick={handleSimulateBroadcast}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-950 to-midnight-900 hover:from-rose-900/60 border border-rose-800/50 text-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
      >
        <Bell className="w-4 h-4 text-rose-400 animate-pulse" />
        <span>Simulate Emergency Alert to All Contacts</span>
      </button>

      {/* Alert Activity History Section */}
      <div className="p-3.5 rounded-2xl bg-midnight-900 border border-slate-800 shadow-sm mt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white">Alert Activity History</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Real-time audit log</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[11px]">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="p-2 rounded-lg bg-midnight-950 border border-slate-800/80 flex items-start justify-between gap-2"
            >
              <div>
                <span className="font-semibold text-slate-200 block">{log.event}</span>
                <span className="text-[10px] text-slate-400">{log.detail}</span>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleCreateContact}
            className="w-full max-w-sm bg-midnight-950 border border-slate-700 rounded-2xl p-4 shadow-2xl space-y-3"
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" /> Add Emergency Contact
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Ramesh (Brother)"
                required
                className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98765 00000"
                required
                className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Relationship</label>
              <select
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Family">Family</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend / Colleague</option>
                <option value="Partner">Partner</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="autoShareCheckbox"
                checked={newAutoShare}
                onChange={(e) => setNewAutoShare(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <label htmlFor="autoShareCheckbox" className="text-xs text-slate-300">
                Auto-share night trips automatically
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
