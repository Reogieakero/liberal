"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Calendar, X, Paperclip, FileText, Image as ImageIcon, Eye, Clock, AlignLeft, Paperclip as AttachmentIcon, ExternalLink, Key, ArrowLeft, LayoutGrid, List } from 'lucide-react';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';
import ConfirmDialog from '../sanctions/components/ConfirmDialog';
import CustomDropdown from './components/CustomDropdown';
import CustomDatePicker from './components/CustomDatePicker';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface SchoolEvent {
  id: string;
  event_date: string;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
  passcode: string;
  attachments?: string[];
  target_course: string;
}

const COURSE_OPTIONS = [
  { value: 'All Students', label: 'All Students' },
  { value: 'BS Development Communication', label: 'BS Development Communication' },
  { value: 'AB Political Science', label: 'AB Political Science' },
  { value: 'BS Psychology', label: 'BS Psychology' }
];

const generateHourOptions = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const pad = i.toString().padStart(2, '0');
    const displayHour = i % 12 || 12;
    const ampm = i >= 12 ? 'PM' : 'AM';
    hours.push({ value: pad, label: `${displayHour} ${ampm}` });
  }
  return hours;
};

const generateMinuteOptions = () => [
  { value: '00', label: '00' },
  { value: '15', label: '15' },
  { value: '30', label: '30' },
  { value: '45', label: '45' }
];

export default function EventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  
  const [viewingEvent, setViewingEvent] = useState<SchoolEvent | null>(null);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  
  const [eventDate, setEventDate] = useState('');
  const [startHour, setStartHour] = useState('08');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('17');
  const [endMinute, setEndMinute] = useState('00');
  const [eventTitle, setEventTitle] = useState('');
  const [description, setDescription] = useState('');
  const [passcode, setPasscode] = useState('');
  const [targetCourse, setTargetCourse] = useState('All Students');
  
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hourOptions = generateHourOptions();
  const minuteOptions = generateMinuteOptions();

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'default' | 'danger';
    actionType: 'save' | 'delete';
    targetId?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    variant: 'default',
    actionType: 'save'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      setErrorMessage("Could not load the events timeline. Please try reloading the page.");
    } else {
      setEvents(data || []);
    }
    setIsLoading(false);
  };

  const getEventStatus = (eventDateStr: string, startTimeStr: string, endTimeStr: string) => {
    const now = new Date();
    
    const start = new Date(`${eventDateStr}T${startTimeStr}`);
    const end = new Date(`${eventDateStr}T${endTimeStr}`);

    if (now < start) {
      return { text: 'upcoming', color: '#eab308', bg: '#fef9c3' };
    } else if (now >= start && now <= end) {
      return { text: 'ongoing', color: '#22c55e', bg: '#dcfce7' };
    } else {
      return { text: 'done', color: '#64748b', bg: '#f1f5f9' };
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFiles = async (fileList: FileList) => {
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const uploadedUrls: string[] = [...attachments];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';
        
        if (!isImage && !isPdf) {
          throw new Error(`Unsupported file type: ${file.name}. Only images and PDF documents are allowed.`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('event-attachments')
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }

      setAttachments(uploadedUrls);
    } catch (err: any) {
      setErrorMessage(err.message || "File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUploading) return;
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    await processFiles(e.dataTransfer.files);
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setEventDate(new Date().toISOString().split('T')[0]);
    setStartHour('08');
    setStartMinute('00');
    setEndHour('17');
    setEndMinute('00');
    setEventTitle('');
    setDescription('');
    setPasscode('');
    setTargetCourse('All Students');
    setAttachments([]);
    setIsModalOpen(true);
  };

  const openEditModal = (eventItem: SchoolEvent) => {
    setEditingEvent(eventItem);
    setEventDate(eventItem.event_date);
    
    const [sH, sM] = eventItem.start_time.split(':');
    const [eH, eM] = eventItem.end_time.split(':');
    
    setStartHour(sH);
    setStartMinute(sM.slice(0, 2));
    setEndHour(eH);
    setEndMinute(eM.slice(0, 2));
    
    setEventTitle(eventItem.title);
    setDescription(eventItem.description);
    setPasscode(eventItem.passcode || '');
    setTargetCourse(eventItem.target_course || 'All Students');
    setAttachments(eventItem.attachments || []);
    setIsModalOpen(true);
  };

  const handleOpenViewOverlay = (eventItem: SchoolEvent) => {
    setViewingEvent(eventItem);
    if (eventItem.attachments && eventItem.attachments.length > 0) {
      setActivePreviewUrl(eventItem.attachments[0]);
    } else {
      setActivePreviewUrl(null);
    }
  };

  const formatFriendlyTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutesStr.slice(0, 2)} ${ampm}`;
  };

  const handlePreSubmitCheck = (e: React.FormEvent) => {
    e.preventDefault();
    
    const friendlyDate = new Date(eventDate).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fullStartTime = `${startHour}:${startMinute}:00`;
    const fullEndTime = `${endHour}:${endMinute}:00`;
    const timeRange = `${formatFriendlyTime(fullStartTime)} to ${formatFriendlyTime(fullEndTime)}`;

    setConfirmConfig({
      isOpen: true,
      title: editingEvent ? 'Save Changes?' : 'Create This Event?',
      message: editingEvent 
        ? `Are you sure you want to change "${eventTitle}" scheduled for ${friendlyDate} from ${timeRange}?`
        : `This will add "${eventTitle}" on ${friendlyDate} from ${timeRange} to the school calendar.`,
      confirmLabel: editingEvent ? 'Yes, Save Changes' : 'Yes, Add Event',
      variant: 'default',
      actionType: 'save'
    });
  };

  const handlePreDeleteCheck = (eventItem: SchoolEvent) => {
    const friendlyDate = new Date(eventItem.event_date).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    setConfirmConfig({
      isOpen: true,
      title: 'Delete This Event?',
      message: `Are you sure you want to completely cancel and remove "${eventItem.title}" scheduled on ${friendlyDate}? This cannot be undone.`,
      confirmLabel: 'Yes, Delete Event',
      variant: 'danger',
      actionType: 'delete',
      targetId: eventItem.id
    });
  };

  const executeConfirmedAction = async () => {
    setIsActionLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        event_date: eventDate,
        start_time: `${startHour}:${startMinute}:00`,
        end_time: `${endHour}:${endMinute}:00`,
        title: eventTitle,
        description: description,
        passcode: passcode,
        target_course: targetCourse,
        attachments: attachments
      };

      if (confirmConfig.actionType === 'save') {
        if (editingEvent) {
          const { error } = await supabase
            .from('events')
            .update(payload)
            .eq('id', editingEvent.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('events')
            .insert(payload);
          if (error) throw error;
        }
        setIsModalOpen(false);
      } else if (confirmConfig.actionType === 'delete' && confirmConfig.targetId) {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', confirmConfig.targetId);
        if (error) throw error;
      }

      await fetchEvents();
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Something went wrong while updates were being saved.");
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />
      
      <div className={styles.workspaceWrapper}>
        <AdminSidebar />
        
        <main className={styles.main}>
          <div className={styles.headerRow}>
            {isModalOpen ? (
              <div key="form-header" className={styles.headerContent} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button type="button" className={styles.rowBtn} onClick={() => setIsModalOpen(false)} title="Back to Events List">
                  <ArrowLeft size={14} />
                </button>
                <div>
                  <h1 className={styles.pageTitle}>{editingEvent ? 'Change Event Details' : 'Schedule New Event'}</h1>
                  <p className={styles.subtitle}>{editingEvent ? 'Update the details for this scheduled event.' : 'Fill in the details to add a new event to the school calendar.'}</p>
                </div>
              </div>
            ) : (
              <div key="list-header" className={styles.headerContent}>
                <h1 className={styles.pageTitle}>School Events & Calendar</h1>
                <p className={styles.subtitle}>Plan, view, and organize upcoming school activities, holidays, or event schedules.</p>
              </div>
            )}

            {!isModalOpen && (
              <div className={styles.controlsRow}>
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.05)', padding: '2px', borderRadius: '8px' }}>
                  <button 
                    type="button" 
                    className={`${styles.viewToggleBtn} ${viewMode === 'card' ? styles.viewToggleBtnActive : ''}`} 
                    onClick={() => setViewMode('card')}
                    title="Grid Card View"
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.viewToggleBtn} ${viewMode === 'table' ? styles.viewToggleBtnActive : ''}`} 
                    onClick={() => setViewMode('table')}
                    title="Detailed List View"
                  >
                    <List size={14} />
                  </button>
                </div>
                <button type="button" className={styles.actionBtn} onClick={openAddModal}>
                  <Plus size={14} /> Add New Event
                </button>
              </div>
            )}
          </div>

          {errorMessage && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0', fontWeight: 500 }}>
              Notice: {errorMessage}
            </p>
          )}

          {!isModalOpen && viewMode === 'table' && (
            <section className={styles.tablePanel}>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Scheduled Date</th>
                      <th style={{ width: '160px' }}>Activity Hours</th>
                      <th>Status</th>
                      <th>Event Name</th>
                      <th>Target Course</th>
                      <th>Passcode</th>
                      <th>About / Description</th>
                      <th>Attachments</th>
                      <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>
                          Loading calendar timelines...
                        </td>
                      </tr>
                    ) : events.length > 0 ? (
                      events.map((item) => {
                        const status = getEventStatus(item.event_date, item.start_time, item.end_time);
                        return (
                          <tr key={item.id}>
                            <td>
                              <span className={styles.dateBadge}>
                                {new Date(item.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </td>
                            <td>
                              <div className={styles.timeBadge}>
                                {formatFriendlyTime(item.start_time)} - {formatFriendlyTime(item.end_time)}
                              </div>
                            </td>
                            <td>
                              <span style={{ 
                                display: 'inline-block', 
                                padding: '4px 8px', 
                                borderRadius: '4px', 
                                fontSize: '10px', 
                                fontWeight: 600, 
                                textTransform: 'uppercase', 
                                color: status.color, 
                                backgroundColor: status.bg 
                              }}>
                                {status.text}
                              </span>
                            </td>
                            <td className={styles.eventName}>{item.title}</td>
                            <td>
                              <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: '#0284c7', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)', whiteSpace: 'nowrap' }}>
                                {item.target_course}
                              </span>
                            </td>
                            <td style={{ color: '#0284c7', fontFamily: 'var(--font-geist-mono)', fontWeight: 600 }}>{item.passcode}</td>
                            <td style={{ color: '#475569', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.description}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {item.attachments && item.attachments.map((url, i) => {
                                  const isImg = url.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i);
                                  return (
                                    <button key={i} type="button" onClick={() => handleOpenViewOverlay(item)} style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#334155', fontSize: '10px', gap: '4px', cursor: 'pointer' }}>
                                      {isImg ? <ImageIcon size={11} /> : <FileText size={11} />}
                                      <span>Doc #{i + 1}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                            <td>
                              <div className={styles.actionButtonsGroup} style={{ justifyContent: 'center', gap: '4px' }}>
                                <button type="button" className={styles.rowBtn} onClick={() => handleOpenViewOverlay(item)} title="View Event Blueprint">
                                  <Eye size={13} />
                                </button>
                                <button type="button" className={styles.rowBtn} onClick={() => openEditModal(item)} title="Edit Event Details">
                                  <Edit2 size={13} />
                                </button>
                                <button type="button" className={`${styles.rowBtn} ${styles.deleteBtn}`} onClick={() => handlePreDeleteCheck(item)} title="Delete This Event">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', color: '#64748b', padding: '32px 0', fontStyle: 'italic' }}>
                          No events listed yet. Click &quot;Add New Event&quot; to place one on the calendar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {!isModalOpen && viewMode === 'card' && (
            <section className={styles.cardsGrid}>
              {isLoading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', padding: '48px 0' }}>
                  Loading event dashboards...
                </div>
              ) : events.length > 0 ? (
                events.map((item) => {
                  const status = getEventStatus(item.event_date, item.start_time, item.end_time);
                  return (
                    <div key={item.id} className={styles.eventCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardMetaRow}>
                          <span className={styles.dateBadge}>
                            {new Date(item.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span style={{ 
                            display: 'inline-block', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontSize: '9px', 
                            fontWeight: 600, 
                            textTransform: 'uppercase', 
                            color: status.color, 
                            backgroundColor: status.bg 
                          }}>
                            {status.text}
                          </span>
                        </div>
                        <h3 className={styles.cardTitle} title={item.title}>{item.title}</h3>
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.timeBadge} style={{ alignSelf: 'flex-start', fontSize: '9px' }}>
                          {formatFriendlyTime(item.start_time)} - {formatFriendlyTime(item.end_time)}
                        </div>
                        <p className={styles.cardDesc} title={item.description}>
                          {item.description}
                        </p>
                      </div>

                      <div className={styles.cardFooter}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 600, color: '#0284c7', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.target_course}>
                            {item.target_course}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#0284c7', fontWeight: 600 }}>
                            <Key size={10} />
                            <span>{item.passcode}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', borderTop: '1px dashed rgba(14, 165, 233, 0.1)', paddingTop: '8px', marginTop: '4px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {item.attachments && item.attachments.slice(0, 2).map((url, idx) => (
                              <div key={idx} style={{ color: '#64748b' }} title="Attachment item">
                                {url.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i) ? <ImageIcon size={11} /> : <FileText size={11} />}
                              </div>
                            ))}
                            {item.attachments && item.attachments.length > 2 && (
                              <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>+{item.attachments.length - 2}</span>
                            )}
                          </div>

                          <div className={styles.actionButtonsGroup} style={{ marginLeft: 'auto' }}>
                            <button type="button" className={styles.rowBtn} onClick={() => handleOpenViewOverlay(item)} title="Inspect Event Layout">
                              <Eye size={12} />
                            </button>
                            <button type="button" className={styles.rowBtn} onClick={() => openEditModal(item)} title="Modify Settings">
                              <Edit2 size={12} />
                            </button>
                            <button type="button" className={`${styles.rowBtn} ${styles.deleteBtn}`} onClick={() => handlePreDeleteCheck(item)} title="Destroy Entry">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', padding: '48px 0', fontStyle: 'italic' }}>
                  No active listings found. Begin by scheduling a new event above.
                </div>
              )}
            </section>
          )}

          {isModalOpen && (
            <section className={styles.formPanel}>
              <form onSubmit={handlePreSubmitCheck} className={styles.modalForm}>
                <div className={styles.inputGroup}>
                  <CustomDatePicker label="Event Date" value={eventDate} onChange={setEventDate} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
                    <div style={{ flex: 1 }}>
                      <CustomDropdown label="Start Hour" options={hourOptions} selectedValue={startHour} onChange={setStartHour} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <CustomDropdown label="Minute" options={minuteOptions} selectedValue={startMinute} onChange={setStartMinute} />
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
                    <div style={{ flex: 1 }}>
                      <CustomDropdown label="End Hour" options={hourOptions} selectedValue={endHour} onChange={setEndHour} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <CustomDropdown label="Minute" options={minuteOptions} selectedValue={endMinute} onChange={setEndMinute} />
                    </div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Event Name</label>
                  <input type="text" placeholder="e.g., Parent-Teacher Conference, Sports Festival" required className={styles.textInput} value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                </div>

                <div className={styles.inputGroup}>
                  <CustomDropdown label="Target Course Audience" options={COURSE_OPTIONS} selectedValue={targetCourse} onChange={setTargetCourse} />
                </div>

                <div className={styles.inputGroup}>
                  <label>Scanner Passcode</label>
                  <input type="text" placeholder="e.g., CONF2026, SPORTS-DAY" required className={styles.textInput} value={passcode} onChange={(e) => setPasscode(e.target.value)} />
                </div>

                <div className={styles.inputGroup}>
                  <label>Event Description</label>
                  <textarea rows={3} placeholder="Provide brief details like the location, who can join, or required materials..." required className={styles.textArea} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className={styles.inputGroup}>
                  <label>Attachments</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textAlign: 'center',
                      cursor: isUploading ? 'default' : 'pointer',
                      padding: '20px 12px',
                      border: `1px dashed ${isDragging ? '#0284c7' : 'rgba(14, 165, 233, 0.3)'}`,
                      borderRadius: '8px',
                      background: isDragging ? 'rgba(14, 165, 233, 0.08)' : '#f8fafc',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#334155',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Paperclip size={16} style={{ color: isDragging ? '#0284c7' : '#64748b' }} />
                    <span>{isUploading ? 'Uploading attachments...' : isDragging ? 'Drop files to attach' : 'Drag & drop images or PDFs here, or click to browse'}</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      accept="image/*,.pdf"
                    />
                  </div>

                  {attachments.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                      {attachments.map((url, idx) => {
                        const isImg = url.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i);
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: '#f1f5f9', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#334155' }}>
                              {isImg ? <ImageIcon size={12} /> : <FileText size={12} />}
                              <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>File {idx + 1}</span>
                            </div>
                            <button type="button" onClick={() => removeAttachment(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={styles.formActions}>
                  <button type="button" style={{ background: 'transparent', border: '1px solid rgba(14, 165, 233, 0.2)', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', borderRadius: '4px', color: '#64748b' }} onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isUploading} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', borderRadius: '4px', opacity: isUploading ? 0.6 : 1 }}>
                    Save Event
                  </button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>

      {viewingEvent && (
        <div 
          className={styles.modalOverlay} 
          style={{ padding: '16px', boxSizing: 'border-box' }} 
          onClick={() => setViewingEvent(null)}
        >
          <div 
            className={styles.modalWindow} 
            style={{ 
              width: '100%', 
              height: '100%', 
              maxWidth: '100%', 
              maxHeight: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              margin: '0',
              overflow: 'hidden'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} style={{ color: '#0284c7' }} />
                <h3>Event Validation & Asset Hub</h3>
              </div>
              <button 
                type="button" 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }} 
                onClick={() => setViewingEvent(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flex: 1, gap: '20px', minHeight: '0', width: '100%' }}>
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', paddingRight: '10px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', display: 'block', marginBottom: '3px', fontWeight: 500 }}>Event Title</span>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{viewingEvent.title}</div>
                </div>

                <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <Calendar size={11} /> Date
                    </span>
                    <span style={{ fontWeight: 500, fontSize: '11px' }}>{new Date(viewingEvent.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <Clock size={11} /> Timeline
                    </span>
                    <span style={{ fontWeight: 500, fontSize: '11px' }}>{formatFriendlyTime(viewingEvent.start_time)} - {formatFriendlyTime(viewingEvent.end_time)}</span>
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', display: 'block', marginBottom: '3px', fontWeight: 500 }}>Target Course Audience</span>
                  <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#0284c7', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                    {viewingEvent.target_course}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px', fontWeight: 500 }}>
                    <Key size={12} /> Scanner Passcode
                  </span>
                  <div style={{ background: '#f0f9ff', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '6px', padding: '10px 12px', color: '#0284c7', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {viewingEvent.passcode}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px', fontWeight: 500 }}>
                    <AlignLeft size={12} /> Detailed Description
                  </span>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.5', color: '#475569', fontSize: '11px' }}>
                    {viewingEvent.description}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', fontWeight: 500 }}>
                    <AttachmentIcon size={12} /> Attachment Registry
                  </span>
                  {viewingEvent.attachments && viewingEvent.attachments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {viewingEvent.attachments.map((url, idx) => {
                        const isImg = url.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i);
                        const isSelected = activePreviewUrl === url;
                        return (
                          <div 
                            key={idx} 
                            onClick={() => setActivePreviewUrl(url)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: '8px 10px', 
                              background: isSelected ? 'rgba(14, 165, 233, 0.08)' : '#f1f5f9', 
                              border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0', 
                              borderRadius: '6px', 
                              cursor: 'pointer',
                              transition: 'all 0.1s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {isImg ? <ImageIcon size={13} style={{ color: '#0284c7' }} /> : <FileText size={13} style={{ color: '#0284c7' }} />}
                              <span style={{ color: '#334155', fontWeight: isSelected ? 600 : 500, fontSize: '11px' }}>Resource Asset #{idx + 1}</span>
                            </div>
                            <span style={{ fontSize: '9px', background: isSelected ? '#0284c7' : '#94a3b8', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                              {isSelected ? 'Viewing' : 'Inspect'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ color: '#64748b', fontStyle: 'italic', paddingLeft: '2px', fontSize: '11px' }}>No file attachments linked to this configuration.</div>
                  )}
                </div>
              </div>

              <div 
                style={{ 
                  flex: '1.2', 
                  background: '#1e293b', 
                  borderRadius: '8px', 
                  border: '1px solid #334155',
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {activePreviewUrl ? (
                  <>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 5, display: 'flex', gap: '6px' }}>
                      <a 
                        href={activePreviewUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid #475569', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', textDecoration: 'none' }}
                      >
                        <ExternalLink size={11} /> Open in New Tab
                      </a>
                    </div>

                    {activePreviewUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i) ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
                        <img 
                          src={activePreviewUrl} 
                          alt="Resource Preview" 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} 
                        />
                      </div>
                    ) : activePreviewUrl.includes('.pdf') ? (
                      <iframe 
                        src={activePreviewUrl} 
                        title="Document Sandbox Preview" 
                        style={{ width: '100%', height: '100%', border: 'none' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
                        <FileText size={48} style={{ color: '#0284c7' }} />
                        <span style={{ fontSize: '12px' }}>Document Preview Unavailable Inline</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                    <ImageIcon size={40} style={{ opacity: 0.2 }} />
                    <span style={{ fontSize: '11px' }}>No resource selected for preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={confirmConfig.isOpen} title={confirmConfig.title} message={confirmConfig.message} confirmLabel={confirmConfig.confirmLabel} variant={confirmConfig.variant} isLoading={isActionLoading} onConfirm={executeConfirmedAction} onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}