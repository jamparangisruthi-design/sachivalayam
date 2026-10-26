import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ShieldCheck,
  ShieldAlert,
  Users,
  Bell,
  Activity,
  Settings,
  Download,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Lock,
  ArrowRight,
  ExternalLink,
  Edit,
  UserCheck,
  FileCheck,
  Award,
  X
} from 'lucide-react';

export default function AdminDashboardPage({ onOpenLogin, onNavigate }) {
  const { lang } = useLanguage();
  const { user, token, demoLogin, hasRole } = useAuth();

  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints', 'applications', 'announcements', 'audit', 'integrations', 'exports'
  const [complaints, setComplaints] = useState([]);
  const [applications, setApplications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  // Edit Ticket Modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('In Progress');
  const [staffNotes, setStaffNotes] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState('/images/sachivalayam-center.jpg');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Process Application Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [appUpdateStatus, setAppUpdateStatus] = useState('Under Verification');
  const [appStaffNotes, setAppStaffNotes] = useState('');
  const [appRejectionReason, setAppRejectionReason] = useState('');
  const [appUpdating, setAppUpdating] = useState(false);
  const [appUpdateSuccess, setAppUpdateSuccess] = useState('');

  // New Announcement Form
  const [annForm, setAnnForm] = useState({
    title_en: '',
    title_te: '',
    content_en: '',
    content_te: '',
    category: 'Gram Sabha',
    is_pinned: false,
    event_date: ''
  });
  const [annMsg, setAnnMsg] = useState('');

  // Export Justification
  const [exportJustification, setExportJustification] = useState('');
  const [exportMsg, setExportMsg] = useState('');

  const isStaff = hasRole(['Service Staff', 'Department Officer', 'Administrator']);
  const isOfficerOrAdmin = hasRole(['Department Officer', 'Administrator']);
  const isAdmin = hasRole(['Administrator']);

  useEffect(() => {
    if (isStaff && token) {
      fetchComplaints();
      fetchApplications();
    }
  }, [isStaff, token, statusFilter, categoryFilter, appStatusFilter]);

  useEffect(() => {
    if (isAdmin && token && activeTab === 'audit') {
      fetchAuditLogs();
    }
    if (isAdmin && token && activeTab === 'integrations') {
      fetchIntegrations();
    }
  }, [isAdmin, token, activeTab]);

  const fetchApplications = async () => {
    try {
      let url = '/api/staff/applications?';
      if (appStatusFilter !== 'All') url += `status=${appStatusFilter}&`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setApplications(data.applications || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  const handleUpdateApplication = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setAppUpdating(true);
    setAppUpdateSuccess('');
    try {
      const res = await fetch(`/api/staff/applications/${selectedApp.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: appUpdateStatus,
          staff_notes: appStaffNotes,
          rejection_reason: appUpdateStatus === 'Rejected' ? appRejectionReason : null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update application.');

      setAppUpdateSuccess(data.certificate_issued_no ? `Approved! Digital Certificate ${data.certificate_issued_no} generated.` : 'Application status updated.');
      fetchApplications();
      setTimeout(() => {
        setSelectedApp(null);
        setAppUpdateSuccess('');
      }, 1500);
    } catch (err) {
      setAppUpdateSuccess(`Error: ${err.message}`);
    } finally {
      setAppUpdating(false);
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let url = '/api/staff/complaints?';
      if (statusFilter !== 'All') url += `status=${statusFilter}&`;
      if (categoryFilter !== 'All') url += `category=${encodeURIComponent(categoryFilter)}&`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAuditLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/integrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setIntegrations(data.integrations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setUpdating(true);
    setUpdateSuccess('');
    try {
      const res = await fetch(`/api/staff/complaints/${selectedTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: updateStatus,
          staff_notes: staffNotes,
          resolution_notes: updateStatus === 'Resolved' ? resolutionNotes : null,
          resolution_photo: updateStatus === 'Resolved' ? resolutionPhoto : null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update ticket.');
      setUpdateSuccess('Grievance status updated successfully.');
      fetchComplaints();
      setTimeout(() => {
        setSelectedTicket(null);
        setUpdateSuccess('');
      }, 1200);
    } catch (err) {
      setUpdateSuccess(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setAnnMsg('');
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(annForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish announcement.');
      setAnnMsg('Announcement published to public noticeboard.');
      setAnnForm({
        title_en: '',
        title_te: '',
        content_en: '',
        content_te: '',
        category: 'Gram Sabha',
        is_pinned: false,
        event_date: ''
      });
    } catch (err) {
      setAnnMsg(`Error: ${err.message}`);
    }
  };

  const handleExportData = async (e) => {
    e.preventDefault();
    setExportMsg('');
    try {
      const res = await fetch('/api/admin/export-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          dataset: 'Grievance_Resolution_Full_Register',
          justification: exportJustification
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Export request denied.');
      setExportMsg(data.message);
      setExportJustification('');
    } catch (err) {
      setExportMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Top Session & RBAC Switcher Strip */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem', backgroundColor: 'var(--slate-900)', color: '#ffffff', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ACTIVE STAFF WORKSPACE
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0' }}>
                {user ? user.full_name : 'Guest Reviewer'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-300)' }}>
                <span>Role: <strong style={{ color: 'var(--primary-500)' }}>{user ? user.role : 'Not Logged In'}</strong></span>
                <span>•</span>
                <span>Dept: {user ? user.department : 'Public Resident'}</span>
              </div>
            </div>

            {/* Quick Demo Switcher Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => demoLogin('Resident')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                Resident
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => demoLogin('Service Staff')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                Staff (Digital Asst)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => demoLogin('Department Officer')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                Officer (VRO)
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => demoLogin('Administrator')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                Administrator
              </button>
            </div>
          </div>
        </div>

        {/* Access Warning if logged in as Resident */}
        {!isStaff && (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginBottom: '2rem' }}>
            <Lock size={48} style={{ color: 'var(--slate-400)', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
              Staff & Officer Access Required
            </h2>
            <p style={{ color: 'var(--slate-600)', maxWidth: '540px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              You are currently logged in as a <strong>Resident</strong>. The Staff Dashboard allows village functionaries to manage tickets, schedule field works, and inspect audit trails. Please switch to a staff role above.
            </p>
            <button className="btn btn-primary" onClick={() => demoLogin('Service Staff')}>
              Switch to Service Staff (Digital Assistant)
            </button>
          </div>
        )}

        {isStaff && (
          <div>
            {/* Dashboard Sub-Tabs */}
            <div className="tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'complaints' ? 'active' : ''}`}
                onClick={() => setActiveTab('complaints')}
              >
                <ShieldAlert size={15} style={{ display: 'inline', marginRight: 5 }} />
                Grievance Management ({complaints.length})
              </button>

              <button
                type="button"
                className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                <FileCheck size={15} style={{ display: 'inline', marginRight: 5 }} />
                Service Applications ({applications.length})
              </button>

              {isOfficerOrAdmin && (
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('announcements')}
                >
                  <Bell size={15} style={{ display: 'inline', marginRight: 5 }} />
                  Publish Announcements
                </button>
              )}

              {isAdmin && (
                <>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('audit')}
                  >
                    <Activity size={15} style={{ display: 'inline', marginRight: 5 }} />
                    Security Audit Logs
                  </button>

                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('integrations')}
                  >
                    <Settings size={15} style={{ display: 'inline', marginRight: 5 }} />
                    System Integrations
                  </button>

                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'exports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('exports')}
                  >
                    <Download size={15} style={{ display: 'inline', marginRight: 5 }} />
                    Export Controls
                  </button>
                </>
              )}
            </div>

            {/* TAB 1: Grievance Operations */}
            {activeTab === 'complaints' && (
              <div className="card">
                {/* Filter Controls */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-600)' }}>
                    <Filter size={15} />
                    <span>Filter:</span>
                  </div>

                  <select
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <select
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Sanitation & Waste">Sanitation & Waste</option>
                  </select>

                  <button type="button" className="btn btn-secondary btn-sm" onClick={fetchComplaints}>
                    Refresh Tickets
                  </button>
                </div>

                {/* Table */}
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ref Number</th>
                        <th>Category</th>
                        <th>Locality</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Citizen Details</th>
                        <th>Assigned To</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map(tkt => (
                        <tr key={tkt.id}>
                          <td><strong>{tkt.ref_number}</strong></td>
                          <td>{tkt.category}</td>
                          <td>{tkt.locality_name_en}</td>
                          <td>
                            <span className="badge" style={{ backgroundColor: tkt.severity === 'Emergency' ? '#fee2e2' : '#f1f5f9', color: tkt.severity === 'Emergency' ? '#991b1b' : '#334155' }}>
                              {tkt.severity}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${tkt.status === 'Resolved' ? 'badge-resolved' : tkt.status === 'In Progress' ? 'badge-in-progress' : 'badge-submitted'}`}>
                              {tkt.status}
                            </span>
                          </td>
                          <td>
                            <div>{tkt.citizen_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{tkt.citizen_phone}</div>
                          </td>
                          <td>{tkt.assigned_staff_name || 'Unassigned'}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{tkt.created_at}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setSelectedTicket(tkt);
                                setUpdateStatus(tkt.status);
                                setStaffNotes(tkt.staff_notes || '');
                                setResolutionNotes(tkt.resolution_notes || '');
                              }}
                            >
                              <Edit size={13} />
                              <span>Manage</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 1B: Service & Certificate Applications (Staff) */}
            {activeTab === 'applications' && (
              <div className="card">
                {/* Filter Controls */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-600)' }}>
                    <Filter size={15} />
                    <span>Filter:</span>
                  </div>

                  <select
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value)}
                  >
                    <option value="All">All Application Statuses</option>
                    <option value="Submitted">Submitted (నూతన దరఖాస్తులు)</option>
                    <option value="Under Verification">Under Verification (పరిశీలనలో ఉన్నవి)</option>
                    <option value="Field Inspection">Field Inspection (క్షేత్ర విచారణ)</option>
                    <option value="Approved">Approved (ఆమోదించబడినవి)</option>
                    <option value="Rejected">Rejected (తిరస్కరించినవి)</option>
                  </select>
                </div>

                {/* Applications Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Application No</th>
                        <th>Service / Certificate</th>
                        <th>Applicant</th>
                        <th>Ward & Door</th>
                        <th>SLA (Days)</th>
                        <th>Status</th>
                        <th>Certificate No</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-500)' }}>
                            No service applications matching filter.
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app.id}>
                            <td>
                              <strong style={{ color: 'var(--primary-800)', fontSize: '0.9rem' }}>{app.application_no}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{app.created_at}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{app.service_name_en}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{app.service_name_te}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{app.applicant_name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{app.applicant_phone}</div>
                            </td>
                            <td>
                              <div>Ward {app.ward_number} ({app.locality_name_en})</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>D.No: {app.door_number}</div>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-700)' }}>{app.sla_days} Days</span>
                            </td>
                            <td>
                              <span className={`badge ${
                                app.status === 'Approved' ? 'badge-success' :
                                app.status === 'Field Inspection' ? 'badge-warning' :
                                app.status === 'Under Verification' ? 'badge-primary' :
                                app.status === 'Rejected' ? 'badge-danger' : 'badge-neutral'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td>
                              {app.certificate_issued_no ? (
                                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#065f46', fontSize: '0.8rem' }}>
                                  {app.certificate_issued_no}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--slate-400)', fontSize: '0.8rem' }}>Pending</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  setSelectedApp(app);
                                  setAppUpdateStatus(app.status);
                                  setAppStaffNotes(app.staff_notes || '');
                                  setAppRejectionReason(app.rejection_reason || '');
                                  setAppUpdateSuccess('');
                                }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                              >
                                <Edit size={13} />
                                <span>Process</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Announcements Manager (Officer & Admin) */}
            {activeTab === 'announcements' && isOfficerOrAdmin && (
              <div className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Publish Village Notice / Gram Sabha Announcement
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
                  Notices published here appear immediately on the citizen portal home page.
                </p>

                {annMsg && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                    {annMsg}
                  </div>
                )}

                <form onSubmit={handleCreateAnnouncement}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Title (English) <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        value={annForm.title_en}
                        onChange={(e) => setAnnForm({ ...annForm, title_en: e.target.value })}
                        placeholder="e.g. Special Gram Sabha for Road Works"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Title (Telugu) <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        value={annForm.title_te}
                        onChange={(e) => setAnnForm({ ...annForm, title_te: e.target.value })}
                        placeholder="ఉదా: రోడ్డు పనులపై ప్రత్యేక గ్రామసభ"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description (English) <span className="required">*</span></label>
                    <textarea
                      className="form-textarea"
                      value={annForm.content_en}
                      onChange={(e) => setAnnForm({ ...annForm, content_en: e.target.value })}
                      placeholder="Details of meeting location, agenda..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description (Telugu) <span className="required">*</span></label>
                    <textarea
                      className="form-textarea"
                      value={annForm.content_te}
                      onChange={(e) => setAnnForm({ ...annForm, content_te: e.target.value })}
                      placeholder="సమావేశ స్థలం, ఎజెండా వివరాలు..."
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Notice Category</label>
                      <select
                        className="form-select"
                        value={annForm.category}
                        onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })}
                      >
                        <option value="Gram Sabha">Gram Sabha</option>
                        <option value="Health Camp">Health Camp</option>
                        <option value="Scheme Deadline">Scheme Deadline</option>
                        <option value="Utility Notice">Utility Notice</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Event Date / Time (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={annForm.event_date}
                        onChange={(e) => setAnnForm({ ...annForm, event_date: e.target.value })}
                        placeholder="e.g. 28-Oct-2026 at 10:30 AM"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={annForm.is_pinned}
                        onChange={(e) => setAnnForm({ ...annForm, is_pinned: e.target.checked })}
                      />
                      <span><strong>Pin Notice to Top:</strong> Highlight with important badge</span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    Publish Announcement
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: Security Audit Logs (Admin Only) */}
            {activeTab === 'audit' && isAdmin && (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    System Security & Compliance Audit Trail
                  </h3>
                  <button className="btn btn-secondary btn-sm" onClick={fetchAuditLogs}>
                    Refresh Logs
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Action</th>
                        <th>Target Entity</th>
                        <th>IP Address</th>
                        <th>Audit Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(log => (
                        <tr key={log.id}>
                          <td style={{ whiteSpace: 'nowrap', color: 'var(--slate-500)' }}>{log.created_at}</td>
                          <td><strong>{log.username}</strong></td>
                          <td><span className="badge badge-closed">{log.role}</span></td>
                          <td><code>{log.action}</code></td>
                          <td>{log.target_entity}</td>
                          <td>{log.ip_address}</td>
                          <td style={{ color: 'var(--slate-600)' }}>{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: External Integrations (Admin Only) */}
            {activeTab === 'integrations' && isAdmin && (
              <div className="grid-2" style={{ gap: '1.5rem' }}>
                {integrations.map(integ => (
                  <div key={integ.key} className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                        {integ.name}
                      </h4>
                      <span className="badge badge-assigned">{integ.status}</span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                      {integ.description}
                    </p>

                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                      Endpoint: <code>{integ.endpoint_url}</code><br />
                      Last Gateway Ping: <strong>{integ.last_ping}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => alert(`Connection to ${integ.name} verified in Demo Simulator Mode.`)}
                      >
                        Test Ping Connection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: Bulk Export Controls (Admin Only) */}
            {activeTab === 'exports' && isAdmin && (
              <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Restricted Data Export Request
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                  To prevent unauthorized data exfiltration, exporting bulk registers requires an official audit justification of at least 10 characters.
                </p>

                {exportMsg && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                    {exportMsg}
                  </div>
                )}

                <form onSubmit={handleExportData}>
                  <div className="form-group">
                    <label className="form-label">Official Purpose / Compliance Justification <span className="required">*</span></label>
                    <textarea
                      className="form-textarea"
                      value={exportJustification}
                      onChange={(e) => setExportJustification(e.target.value)}
                      placeholder="e.g. District Collectorate monthly grievance compliance audit..."
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    Authorize & Export Dataset
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Service Application Review & Processing Modal */}
      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Process Application: {selectedApp.application_no}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  {selectedApp.service_name_en} • Ward {selectedApp.ward_number} ({selectedApp.locality_name_en})
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            {appUpdateSuccess && (
              <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontWeight: 600, fontSize: '0.88rem' }}>
                {appUpdateSuccess}
              </div>
            )}

            {/* Applicant Particulars Summary */}
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div className="grid-2" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div><span style={{ color: 'var(--slate-500)' }}>Applicant:</span> <strong>{selectedApp.applicant_name}</strong></div>
                <div><span style={{ color: 'var(--slate-500)' }}>Mobile:</span> <strong>{selectedApp.applicant_phone}</strong></div>
                <div><span style={{ color: 'var(--slate-500)' }}>Door No:</span> {selectedApp.door_number}</div>
                <div><span style={{ color: 'var(--slate-500)' }}>Aadhaar:</span> {selectedApp.applicant_aadhaar_masked || 'XXXX-XXXX-****'}</div>
              </div>

              {selectedApp.certificate_issued_no && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-200)', color: '#065f46', fontWeight: 700 }}>
                  Official Digital Certificate Issued: {selectedApp.certificate_issued_no}
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateApplication}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Workflow Action / New Status *</label>
                <select
                  className="form-select"
                  value={appUpdateStatus}
                  onChange={(e) => setAppUpdateStatus(e.target.value)}
                >
                  <option value="Under Verification">Under Verification (వి.ఆర్.ఓ పరిశీలన)</option>
                  <option value="Field Inspection">Field Inspection (క్షేత్ర స్థాయి విచారణ)</option>
                  <option value="Approved">Approved (ఆమోదించి సర్టిఫికెట్ జారీ చేయండి)</option>
                  <option value="Rejected">Rejected (తిరస్కరించండి)</option>
                </select>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem', display: 'block' }}>
                  {appUpdateStatus === 'Approved'
                    ? 'Approving will automatically issue a verified AP Digital Certificate number with QR stamp.'
                    : 'Updating status will record a new entry in the citizen-facing tracking timeline.'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Staff Verification / Field Inspection Notes *</label>
                <textarea
                  className="form-textarea"
                  value={appStaffNotes}
                  onChange={(e) => setAppStaffNotes(e.target.value)}
                  placeholder="State enquiry findings, land patta check, or pipeline feasibility..."
                  rows="3"
                  required
                />
              </div>

              {appUpdateStatus === 'Rejected' && (
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--danger-700)', fontWeight: 700 }}>Rejection Reason (Visible to Applicant) *</label>
                  <textarea
                    className="form-textarea"
                    value={appRejectionReason}
                    onChange={(e) => setAppRejectionReason(e.target.value)}
                    placeholder="Provide specific statutory reason for rejection..."
                    rows="2"
                    required
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary btn-block" onClick={() => setSelectedApp(null)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary btn-block" disabled={appUpdating} style={{ backgroundColor: appUpdateStatus === 'Approved' ? '#059669' : undefined }}>
                  {appUpdating ? 'Processing...' : appUpdateStatus === 'Approved' ? 'Approve & Issue Certificate' : 'Update Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Management Modal */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '560px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Update Grievance: {selectedTicket.ref_number}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
              {selectedTicket.category} • {selectedTicket.locality_name_en}
            </p>

            {updateSuccess && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                {updateSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateTicket}>
              <div className="form-group">
                <label className="form-label">New Status</label>
                <select
                  className="form-select"
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                >
                  <option value="Assigned">Assigned (కేటాయించబడింది)</option>
                  <option value="In Progress">In Progress (పనులలో ఉంది)</option>
                  <option value="Resolved">Resolved (పరిష్కరించబడింది)</option>
                  <option value="Closed">Closed (ముగించబడింది)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Staff Inspection / Progress Notes</label>
                <textarea
                  className="form-textarea"
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  placeholder="State work performed or parts indented..."
                />
              </div>

              {updateStatus === 'Resolved' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Resolution Details (Visible to Resident) <span className="required">*</span></label>
                    <textarea
                      className="form-textarea"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Explain how the grievance was resolved..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Resolution Proof Photo URL / Path</label>
                    <input
                      type="text"
                      className="form-input"
                      value={resolutionPhoto}
                      onChange={(e) => setResolutionPhoto(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary btn-block" onClick={() => setSelectedTicket(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-block" disabled={updating}>
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
