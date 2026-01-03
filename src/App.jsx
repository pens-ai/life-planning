import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, X, Check, GripVertical,
  Plane, Car, Train, Dumbbell, Bike, Heart, Utensils,
  PiggyBank, Stethoscope, Cake, BookOpen, Home, Target,
  MapPin, TrendingUp, Waves, Activity, Coffee,
  Gift, Bell, CreditCard, Wrench, Sparkles, CalendarDays,
  Cloud, CloudOff, Loader2, Trash2, Download, Upload, Sun, Moon,
  Flower2, Pencil, Copy, ClipboardPaste, ShoppingCart, ChefHat, Database
} from 'lucide-react';
import { supabase } from './supabaseClient';

// Controlla se Supabase è configurato
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://your-project.supabase.co';
};

// Converti da formato DB a formato app
const fromDbFormat = (dbEvent) => ({
  id: dbEvent.id,
  month: dbEvent.month,
  startDay: dbEvent.start_day,
  endDay: dbEvent.end_day,
  categoryId: dbEvent.category_id,
  subtypeId: dbEvent.subtype_id,
  subtypeName: dbEvent.subtype_name,
  text: dbEvent.text,
  amount: dbEvent.amount ? parseFloat(dbEvent.amount) : null,
  timeSlot: dbEvent.time_slot,
  done: dbEvent.done
});

// Converti da formato app a formato DB
const toDbFormat = (event) => ({
  month: event.month,
  start_day: event.startDay,
  end_day: event.endDay,
  category_id: event.categoryId,
  subtype_id: event.subtypeId,
  subtype_name: event.subtypeName,
  text: event.text,
  amount: event.amount,
  time_slot: event.timeSlot,
  done: event.done
});

const categories = [
  {
    id: 'sport',
    name: 'Sport Andrea',
    icon: Dumbbell,
    bg: 'bg-green-500',
    light: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-400',
    hasTimeSlot: true,
    subtypes: [
      { id: 'palestra', name: 'Palestra', icon: Dumbbell },
      { id: 'corsa', name: 'Corsa', icon: Activity },
      { id: 'bici', name: 'Bici', icon: Bike },
      { id: 'nuoto', name: 'Nuoto', icon: Waves },
      { id: 'yoga', name: 'Yoga', icon: Flower2 },
      { id: 'altro_sport', name: 'Altro', icon: Target },
    ]
  },
  {
    id: 'sport_gaia',
    name: 'Sport Gaia',
    icon: Dumbbell,
    bg: 'bg-pink-500',
    light: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    dot: 'bg-pink-400',
    hasTimeSlot: true,
    subtypes: [
      { id: 'palestra_g', name: 'Palestra', icon: Dumbbell },
      { id: 'corsa_g', name: 'Corsa', icon: Activity },
      { id: 'bici_g', name: 'Bici', icon: Bike },
      { id: 'nuoto_g', name: 'Nuoto', icon: Waves },
      { id: 'yoga_g', name: 'Yoga', icon: Flower2 },
      { id: 'altro_sport_g', name: 'Altro', icon: Target },
    ]
  },
  {
    id: 'viaggi', 
    name: 'Viaggi & Gite', 
    icon: Plane, 
    bg: 'bg-blue-500', 
    light: 'bg-blue-50', 
    text: 'text-blue-700', 
    border: 'border-blue-200',
    dot: 'bg-blue-400',
    subtypes: [
      { id: 'aereo', name: 'Viaggio Aereo', icon: Plane },
      { id: 'auto', name: 'Gita in Auto', icon: Car },
      { id: 'treno', name: 'Treno', icon: Train },
      { id: 'weekend', name: 'Weekend Fuori', icon: MapPin },
    ]
  },
  { 
    id: 'alimentazione', 
    name: 'Alimentazione', 
    icon: Utensils, 
    bg: 'bg-orange-500', 
    light: 'bg-orange-50', 
    text: 'text-orange-700', 
    border: 'border-orange-200',
    dot: 'bg-orange-400',
    subtypes: [
      { id: 'spesa', name: 'Spesa', icon: ShoppingCart },
      { id: 'prep_pranzo', name: 'Preparazione Pranzo', icon: ChefHat },
      { id: 'prep_cena', name: 'Preparazione Cena', icon: ChefHat },
      { id: 'meal_prep', name: 'Meal Prep', icon: Utensils },
      { id: 'ristorante', name: 'Ristorante', icon: Coffee },
      { id: 'dieta', name: 'Giorno Dieta', icon: Heart },
      { id: 'cheat_day', name: 'Cheat Day', icon: Cake },
    ]
  },
  { 
    id: 'risparmi', 
    name: 'Risparmi', 
    icon: PiggyBank, 
    bg: 'bg-emerald-500', 
    light: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
    subtypes: [
      { id: 'deposito', name: 'Deposito', icon: PiggyBank },
      { id: 'investimento', name: 'Investimento', icon: TrendingUp },
      { id: 'obiettivo', name: 'Obiettivo Raggiunto', icon: Target },
    ]
  },
  { 
    id: 'salute', 
    name: 'Salute', 
    icon: Stethoscope, 
    bg: 'bg-red-500', 
    light: 'bg-red-50', 
    text: 'text-red-700', 
    border: 'border-red-200',
    dot: 'bg-red-400',
    subtypes: [
      { id: 'visita', name: 'Visita Medica', icon: Stethoscope },
      { id: 'dentista', name: 'Dentista', icon: Sparkles },
      { id: 'checkup', name: 'Checkup', icon: Activity },
      { id: 'vaccino', name: 'Vaccino', icon: Heart },
    ]
  },
  { 
    id: 'eventi', 
    name: 'Eventi', 
    icon: Cake, 
    bg: 'bg-pink-500', 
    light: 'bg-pink-50', 
    text: 'text-pink-700', 
    border: 'border-pink-200',
    dot: 'bg-pink-400',
    subtypes: [
      { id: 'compleanno', name: 'Compleanno', icon: Gift },
      { id: 'anniversario', name: 'Anniversario', icon: Heart },
      { id: 'cena', name: 'Cena/Evento', icon: Utensils },
      { id: 'scadenza', name: 'Scadenza', icon: Bell },
    ]
  },
  { 
    id: 'formazione', 
    name: 'Formazione', 
    icon: BookOpen, 
    bg: 'bg-purple-500', 
    light: 'bg-purple-50', 
    text: 'text-purple-700', 
    border: 'border-purple-200',
    dot: 'bg-purple-400',
    subtypes: [
      { id: 'corso', name: 'Corso', icon: BookOpen },
      { id: 'libro', name: 'Libro', icon: BookOpen },
      { id: 'certificazione', name: 'Certificazione', icon: Target },
    ]
  },
  { 
    id: 'casa', 
    name: 'Casa', 
    icon: Home, 
    bg: 'bg-amber-500', 
    light: 'bg-amber-50', 
    text: 'text-amber-700', 
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    subtypes: [
      { id: 'bolletta', name: 'Bolletta', icon: CreditCard },
      { id: 'manutenzione', name: 'Manutenzione', icon: Wrench },
      { id: 'pulizie', name: 'Pulizie', icon: Home },
    ]
  },
];

const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

const STORAGE_KEY = 'life-planner-2026-data';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [newItemText, setNewItemText] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemEndDay, setNewItemEndDay] = useState('');
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [newItemTimeSlot, setNewItemTimeSlot] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [modalTab, setModalTab] = useState('attivita');
  const [copiedWeek, setCopiedWeek] = useState(null);
  const [copiedDay, setCopiedDay] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load events on mount
  useEffect(() => {
    const loadEvents = async () => {
      if (isSupabaseConfigured()) {
        // Carica da Supabase
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('start_day', { ascending: true });

          if (error) throw error;
          setEvents(data ? data.map(fromDbFormat) : []);
        } catch (error) {
          console.error('Errore caricamento da Supabase:', error);
          // Fallback a localStorage
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            setEvents(parsed.events || []);
          }
        }
      } else {
        // Carica da localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            setEvents(parsed.events || []);
          }
        } catch (error) {
          console.error('Errore caricamento dati:', error);
        }
      }
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  // Save to localStorage when events change
  useEffect(() => {
    if (isLoading) return;
    
    setSaveStatus('saving');
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          events,
          lastSaved: new Date().toISOString()
        }));
        setSaveStatus('saved');
      } catch (error) {
        console.error('Errore salvataggio:', error);
        setSaveStatus('error');
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [events, isLoading]);

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify({ events, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-planner-2026-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import data
  const importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.events && Array.isArray(imported.events)) {
          if (isSupabaseConfigured()) {
            // Prima elimina gli eventi esistenti, poi inserisci i nuovi
            try {
              await supabase.from('events').delete().neq('id', 0);
              const dbEvents = imported.events.map(e => toDbFormat(e));
              const { data, error } = await supabase
                .from('events')
                .insert(dbEvents)
                .select();

              if (error) throw error;
              setEvents(data.map(fromDbFormat));
              alert(`Importati ${data.length} eventi su Supabase!`);
            } catch (error) {
              console.error('Errore import Supabase:', error);
              setEvents(imported.events);
              alert(`Importati ${imported.events.length} eventi (solo locale)!`);
            }
          } else {
            setEvents(imported.events);
            alert(`Importati ${imported.events.length} eventi!`);
          }
        } else {
          alert('File non valido');
        }
      } catch (error) {
        alert('Errore lettura file: ' + error.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetAllData = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('events').delete().neq('id', 0);
      } catch (error) {
        console.error('Errore reset Supabase:', error);
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    setEvents([]);
    setShowResetConfirm(false);
  };

  const getDaysInMonth = (month) => new Date(2026, month + 1, 0).getDate();

  const addEvent = async (month, startDay, categoryId, subtypeId) => {
    const category = categories.find(c => c.id === categoryId);
    const subtype = category.subtypes.find(s => s.id === subtypeId);

    let endDay = startDay;
    if (isMultiDay && newItemEndDay) {
      endDay = parseInt(newItemEndDay);
      if (endDay < startDay) endDay = startDay;
      if (endDay > getDaysInMonth(month)) endDay = getDaysInMonth(month);
    }

    const newEvent = {
      id: Date.now(),
      month,
      startDay,
      endDay,
      categoryId,
      subtypeId,
      subtypeName: subtype.name,
      text: newItemText || subtype.name,
      amount: newItemAmount ? parseFloat(newItemAmount) : null,
      timeSlot: newItemTimeSlot || null,
      done: false
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('events')
          .insert([toDbFormat(newEvent)])
          .select()
          .single();

        if (error) throw error;
        setEvents(prev => [...prev, fromDbFormat(data)]);
      } catch (error) {
        console.error('Errore inserimento Supabase:', error);
        setEvents(prev => [...prev, newEvent]);
      }
    } else {
      setEvents(prev => [...prev, newEvent]);
    }

    setNewItemText('');
    setNewItemAmount('');
    setNewItemEndDay('');
    setIsMultiDay(false);
    setNewItemTimeSlot('');
    setAddingTo(null);
  };

  const toggleEvent = async (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const newDone = !event.done;
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, done: newDone } : e
    ));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('events').update({ done: newDone }).eq('id', eventId);
      } catch (error) {
        console.error('Errore toggle Supabase:', error);
      }
    }
  };

  const removeEvent = async (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('events').delete().eq('id', eventId);
      } catch (error) {
        console.error('Errore rimozione Supabase:', error);
      }
    }
  };

  const startEditEvent = (event) => {
    setEditingEvent({
      ...event,
      editText: event.text,
      editAmount: event.amount || '',
      editTimeSlot: event.timeSlot || '',
      editEndDay: event.endDay
    });
  };

  const saveEditEvent = async () => {
    if (!editingEvent) return;

    const updatedFields = {
      text: editingEvent.editText || editingEvent.subtypeName,
      amount: editingEvent.editAmount ? parseFloat(editingEvent.editAmount) : null,
      timeSlot: editingEvent.editTimeSlot || null,
      endDay: editingEvent.editEndDay
    };

    setEvents(prev => prev.map(e =>
      e.id === editingEvent.id ? { ...e, ...updatedFields } : e
    ));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('events').update({
          text: updatedFields.text,
          amount: updatedFields.amount,
          time_slot: updatedFields.timeSlot,
          end_day: updatedFields.endDay
        }).eq('id', editingEvent.id);
      } catch (error) {
        console.error('Errore aggiornamento Supabase:', error);
      }
    }

    setEditingEvent(null);
  };

  const cancelEditEvent = () => {
    setEditingEvent(null);
  };

  // Funzioni per copia/incolla settimana sport
  const getWeekRange = (day) => {
    const date = new Date(2026, selectedMonth, day);
    const dayOfWeek = date.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = day + mondayOffset;
    const sunday = monday + 6;
    return { monday: Math.max(1, monday), sunday: Math.min(getDaysInMonth(selectedMonth), sunday) };
  };

  const copyWeekSport = (day) => {
    const { monday, sunday } = getWeekRange(day);
    const sportEvents = events.filter(e =>
      e.month === selectedMonth &&
      (e.categoryId === 'sport' || e.categoryId === 'sport_gaia') &&
      e.startDay >= monday && e.startDay <= sunday
    );

    if (sportEvents.length === 0) {
      alert('Nessun evento sport in questa settimana da copiare');
      return;
    }

    const copiedEvents = sportEvents.map(e => ({
      ...e,
      dayOffset: e.startDay - monday,
      endDayOffset: e.endDay - monday
    }));

    setCopiedWeek({
      events: copiedEvents,
      sourceMonth: selectedMonth,
      sourceMonday: monday
    });

    alert(`Copiati ${copiedEvents.length} eventi sport della settimana ${monday}-${sunday} ${months[selectedMonth]}`);
  };

  const pasteWeekSport = async (day) => {
    if (!copiedWeek) return;

    const { monday } = getWeekRange(day);
    const maxDay = getDaysInMonth(selectedMonth);

    const newEvents = copiedWeek.events.map(e => {
      const newStartDay = Math.min(monday + e.dayOffset, maxDay);
      const newEndDay = Math.min(monday + e.endDayOffset, maxDay);
      return {
        ...e,
        id: Date.now() + Math.random(),
        month: selectedMonth,
        startDay: newStartDay,
        endDay: Math.max(newStartDay, newEndDay)
      };
    });

    if (isSupabaseConfigured()) {
      try {
        const dbEvents = newEvents.map(e => toDbFormat(e));
        const { data, error } = await supabase
          .from('events')
          .insert(dbEvents)
          .select();

        if (error) throw error;
        setEvents(prev => [...prev, ...data.map(fromDbFormat)]);
      } catch (error) {
        console.error('Errore paste week Supabase:', error);
        setEvents(prev => [...prev, ...newEvents]);
      }
    } else {
      setEvents(prev => [...prev, ...newEvents]);
    }

    alert(`Incollati ${newEvents.length} eventi sport nella settimana del ${monday} ${months[selectedMonth]}`);
  };

  // Funzioni per copia/incolla giorno intero
  const copyDay = (day) => {
    const dayEvents = events.filter(e =>
      e.month === selectedMonth && e.startDay === day
    );

    if (dayEvents.length === 0) {
      alert('Nessun evento in questo giorno da copiare');
      return;
    }

    setCopiedDay({
      events: dayEvents.map(e => ({ ...e })),
      sourceMonth: selectedMonth,
      sourceDay: day
    });

    alert(`Copiati ${dayEvents.length} eventi del ${day} ${months[selectedMonth]}`);
  };

  const pasteDay = async (targetDay) => {
    if (!copiedDay) return;

    const newEvents = copiedDay.events.map(e => {
      const duration = e.endDay - e.startDay;
      const maxDay = getDaysInMonth(selectedMonth);
      const newEndDay = Math.min(targetDay + duration, maxDay);
      return {
        ...e,
        id: Date.now() + Math.random(),
        month: selectedMonth,
        startDay: targetDay,
        endDay: newEndDay
      };
    });

    if (isSupabaseConfigured()) {
      try {
        const dbEvents = newEvents.map(e => toDbFormat(e));
        const { data, error } = await supabase
          .from('events')
          .insert(dbEvents)
          .select();

        if (error) throw error;
        setEvents(prev => [...prev, ...data.map(fromDbFormat)]);
      } catch (error) {
        console.error('Errore paste day Supabase:', error);
        setEvents(prev => [...prev, ...newEvents]);
      }
    } else {
      setEvents(prev => [...prev, ...newEvents]);
    }

    alert(`Incollati ${newEvents.length} eventi nel ${targetDay} ${months[selectedMonth]}`);
  };

  const getEventsForDay = (month, day) => {
    return events.filter(e => 
      e.month === month && day >= e.startDay && day <= e.endDay
    );
  };

  const getEventsStartingOnDay = (month, day) => {
    return events.filter(e => e.month === month && e.startDay === day);
  };

  const handleDragStart = (e, event) => {
    setDraggedItem(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, day, isCurrentMonth) => {
    e.preventDefault();
    if (isCurrentMonth && draggedItem) {
      setDragOverDay(day);
    }
  };

  const handleDragLeave = () => setDragOverDay(null);

  const handleDrop = async (e, targetMonth, targetDay) => {
    e.preventDefault();
    setDragOverDay(null);

    if (!draggedItem) return;

    const duration = draggedItem.endDay - draggedItem.startDay;
    const newEndDay = Math.min(targetDay + duration, getDaysInMonth(targetMonth));

    setEvents(prev => prev.map(event =>
      event.id === draggedItem.id
        ? { ...event, month: targetMonth, startDay: targetDay, endDay: newEndDay }
        : event
    ));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('events').update({
          month: targetMonth,
          start_day: targetDay,
          end_day: newEndDay
        }).eq('id', draggedItem.id);
      } catch (error) {
        console.error('Errore drag&drop Supabase:', error);
      }
    }

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverDay(null);
  };

  const getCalendarDays = (month) => {
    const year = 2026;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = (firstDay.getDay() + 6) % 7;
    
    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, currentMonth: false, month: month - 1 });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true, month: month });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, currentMonth: false, month: month + 1 });
    }
    
    return days;
  };

  const getMonthStats = () => {
    const stats = {};
    categories.forEach(cat => {
      stats[cat.id] = { total: 0, done: 0, amount: 0, days: 0 };
    });
    
    events.filter(e => e.month === selectedMonth).forEach(event => {
      stats[event.categoryId].total++;
      stats[event.categoryId].days += (event.endDay - event.startDay + 1);
      if (event.done) stats[event.categoryId].done++;
      if (event.amount) stats[event.categoryId].amount += event.amount;
    });
    
    return stats;
  };

  const getYearStats = () => {
    const stats = {};
    categories.forEach(cat => {
      stats[cat.id] = { total: 0, done: 0, amount: 0, days: 0 };
    });
    
    events.forEach(event => {
      stats[event.categoryId].total++;
      stats[event.categoryId].days += (event.endDay - event.startDay + 1);
      if (event.done) stats[event.categoryId].done++;
      if (event.amount) stats[event.categoryId].amount += event.amount;
    });
    
    return stats;
  };

  const calendarDays = getCalendarDays(selectedMonth);
  const monthStats = getMonthStats();
  const yearStats = getYearStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  const DayModal = () => {
    if (selectedDay === null) return null;
    
    const dayOfWeek = new Date(2026, selectedMonth, selectedDay).getDay();
    const dayName = weekDays[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
    const dayEvents = getEventsForDay(selectedMonth, selectedDay);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => { setSelectedDay(null); setAddingTo(null); setIsMultiDay(false); setModalTab('attivita'); setEditingEvent(null); }}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8" onClick={e => e.stopPropagation()}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{selectedDay} {months[selectedMonth]}</h2>
                <p className="opacity-80 mt-1 text-lg">{dayName} 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyDay(selectedDay)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
                  title="Copia giorno"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copia giorno</span>
                </button>
                {copiedDay && (
                  <button
                    onClick={() => pasteDay(selectedDay)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm"
                    title={`Incolla ${copiedDay.events.length} eventi`}
                  >
                    <ClipboardPaste className="w-4 h-4" />
                    <span className="hidden sm:inline">Incolla ({copiedDay.events.length})</span>
                  </button>
                )}
                <button
                  onClick={() => copyWeekSport(selectedDay)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-400/30 hover:bg-green-400/50 rounded-lg transition-colors text-sm"
                  title="Copia settimana sport"
                >
                  <Dumbbell className="w-4 h-4" />
                  <span className="hidden sm:inline">Copia sett. sport</span>
                </button>
                {copiedWeek && (
                  <button
                    onClick={() => pasteWeekSport(selectedDay)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm"
                    title={`Incolla ${copiedWeek.events.length} eventi sport`}
                  >
                    <ClipboardPaste className="w-4 h-4" />
                    <span className="hidden sm:inline">Incolla sport ({copiedWeek.events.length})</span>
                  </button>
                )}
                <button
                  onClick={() => { setSelectedDay(null); setAddingTo(null); setIsMultiDay(false); setModalTab('attivita'); setEditingEvent(null); }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          
          {dayEvents.length > 0 && (
            <div className="p-4 border-b bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Eventi di questo giorno</h3>
              <div className="space-y-2">
                {dayEvents.map(event => {
                  const cat = categories.find(c => c.id === event.categoryId);
                  const Icon = cat.icon;
                  const isMulti = event.endDay > event.startDay;
                  const isEditing = editingEvent?.id === event.id;

                  if (isEditing) {
                    return (
                      <div key={event.id} className={`p-4 rounded-xl ${cat.light} border-2 ${cat.border}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`${cat.bg} p-2 rounded-lg`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className={`font-bold ${cat.text} text-sm`}>Modifica evento</span>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingEvent.editText}
                            onChange={(e) => setEditingEvent({...editingEvent, editText: e.target.value})}
                            placeholder="Descrizione"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                          {cat.hasTimeSlot && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Fascia:</span>
                              <button
                                onClick={() => setEditingEvent({...editingEvent, editTimeSlot: editingEvent.editTimeSlot === 'mattina' ? '' : 'mattina'})}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${editingEvent.editTimeSlot === 'mattina' ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-600'}`}
                              >
                                <Sun className="w-4 h-4" />
                                Mattina
                              </button>
                              <button
                                onClick={() => setEditingEvent({...editingEvent, editTimeSlot: editingEvent.editTimeSlot === 'sera' ? '' : 'sera'})}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${editingEvent.editTimeSlot === 'sera' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                              >
                                <Moon className="w-4 h-4" />
                                Sera
                              </button>
                            </div>
                          )}
                          {(cat.id === 'risparmi' || cat.id === 'casa') && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">€</span>
                              <input
                                type="number"
                                value={editingEvent.editAmount}
                                onChange={(e) => setEditingEvent({...editingEvent, editAmount: e.target.value})}
                                placeholder="Importo"
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                              />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button onClick={saveEditEvent} className={`flex-1 ${cat.bg} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90`}>
                              Salva
                            </button>
                            <button onClick={cancelEditEvent} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200">
                              Annulla
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-3 p-3 rounded-xl ${cat.light} border ${cat.border} cursor-grab active:cursor-grabbing`}
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <button
                        onClick={() => toggleEvent(event.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${event.done ? cat.bg + ' border-transparent' : 'border-gray-300 bg-white'}`}
                      >
                        {event.done && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className={`${cat.bg} p-2 rounded-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${event.done ? 'line-through opacity-50' : ''}`}>
                          {event.text}
                          {event.timeSlot && (
                            <span className={`ml-2 inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${event.timeSlot === 'mattina' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                              {event.timeSlot === 'mattina' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                              {event.timeSlot}
                            </span>
                          )}
                        </p>
                        {isMulti && (
                          <p className="text-xs text-gray-500">
                            {event.startDay} - {event.endDay} {months[selectedMonth]} ({event.endDay - event.startDay + 1} giorni)
                          </p>
                        )}
                      </div>
                      {event.amount && (
                        <span className={`${cat.text} font-bold`}>€{event.amount}</span>
                      )}
                      <button
                        onClick={() => startEditEvent(event)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setModalTab('attivita')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${modalTab === 'attivita' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Attività
              </button>
              <button
                onClick={() => setModalTab('alimentazione')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${modalTab === 'alimentazione' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <span className="flex items-center gap-1">
                  <Utensils className="w-4 h-4" />
                  Alimentazione
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.filter(cat => modalTab === 'alimentazione' ? cat.id === 'alimentazione' : cat.id !== 'alimentazione').map(cat => {
                const Icon = cat.icon;
                const isAddingToThis = addingTo?.categoryId === cat.id;
                
                return (
                  <div key={cat.id}>
                    {isAddingToThis ? (
                      <div className={`${cat.light} rounded-xl p-4 border-2 ${cat.border}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`${cat.bg} p-2 rounded-lg`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className={`font-bold ${cat.text} text-sm`}>{cat.name}</span>
                        </div>
                        
                        {!addingTo.subtypeId ? (
                          <div className="space-y-2">
                            {cat.subtypes.map(sub => {
                              const SubIcon = sub.icon;
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => setAddingTo({ categoryId: cat.id, subtypeId: sub.id })}
                                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-sm transition-colors"
                                >
                                  <SubIcon className={`w-4 h-4 ${cat.text}`} />
                                  <span>{sub.name}</span>
                                </button>
                              );
                            })}
                            <button 
                              onClick={() => setAddingTo(null)}
                              className="w-full p-2 text-sm text-gray-500 hover:text-gray-700"
                            >
                              Annulla
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                              placeholder="Descrizione"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                              autoFocus
                            />

                            {cat.hasTimeSlot && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Fascia:</span>
                                <button
                                  onClick={() => setNewItemTimeSlot(newItemTimeSlot === 'mattina' ? '' : 'mattina')}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${newItemTimeSlot === 'mattina' ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                  <Sun className="w-4 h-4" />
                                  Mattina
                                </button>
                                <button
                                  onClick={() => setNewItemTimeSlot(newItemTimeSlot === 'sera' ? '' : 'sera')}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${newItemTimeSlot === 'sera' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                  <Moon className="w-4 h-4" />
                                  Sera
                                </button>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setIsMultiDay(!isMultiDay)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isMultiDay ? cat.bg + ' text-white' : 'bg-gray-100 text-gray-600'}`}
                              >
                                <CalendarDays className="w-4 h-4" />
                                Più giorni
                              </button>
                            </div>
                            
                            {isMultiDay && (
                              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                <span className="text-sm text-gray-600">Dal {selectedDay} al</span>
                                <input
                                  type="number"
                                  min={selectedDay}
                                  max={getDaysInMonth(selectedMonth)}
                                  value={newItemEndDay}
                                  onChange={(e) => setNewItemEndDay(e.target.value)}
                                  placeholder={selectedDay.toString()}
                                  className="w-16 px-2 py-1 rounded border border-gray-200 text-sm text-center"
                                />
                                <span className="text-sm text-gray-600">{months[selectedMonth]}</span>
                              </div>
                            )}
                            
                            {(cat.id === 'risparmi' || cat.id === 'casa') && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">€</span>
                                <input
                                  type="number"
                                  value={newItemAmount}
                                  onChange={(e) => setNewItemAmount(e.target.value)}
                                  placeholder="Importo"
                                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={() => addEvent(selectedMonth, selectedDay, cat.id, addingTo.subtypeId)}
                                className={`flex-1 ${cat.bg} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90`}
                              >
                                Aggiungi
                              </button>
                              <button 
                                onClick={() => { setAddingTo(null); setIsMultiDay(false); }}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingTo({ categoryId: cat.id, subtypeId: null })}
                        className={`w-full ${cat.light} rounded-xl p-4 border ${cat.border} hover:shadow-md transition-all text-left`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`${cat.bg} p-2 rounded-lg`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className={`font-medium ${cat.text} text-sm`}>{cat.name}</span>
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatsModal = () => {
    if (!showStats) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowStats(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Statistiche 2026</h2>
                <p className="opacity-80 mt-1">{events.length} eventi totali</p>
              </div>
              <button onClick={() => setShowStats(false)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Riepilogo Anno</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {categories.map(cat => {
                const Icon = cat.icon;
                const stats = yearStats[cat.id];
                const percentage = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
                
                if (stats.total === 0) return null;
                
                return (
                  <div key={cat.id} className={`${cat.light} rounded-xl p-4 border ${cat.border}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${cat.bg} p-3 rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${cat.text}`}>{cat.name}</h3>
                        <p className="text-sm text-gray-500">
                          {stats.total} eventi • {stats.days} giorni
                        </p>
                      </div>
                      {stats.amount > 0 && (
                        <div className="text-right">
                          <p className={`text-xl font-bold ${cat.text}`}>€{stats.amount.toFixed(0)}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white/50 rounded-full h-2">
                      <div 
                        className={`h-full ${cat.bg} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stats.done}/{stats.total} completati ({percentage}%)</p>
                  </div>
                );
              })}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4">{months[selectedMonth]} - Dettaglio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(cat => {
                const Icon = cat.icon;
                const stats = monthStats[cat.id];
                
                if (stats.total === 0) return null;
                
                return (
                  <div key={cat.id} className={`${cat.light} rounded-xl p-4 border ${cat.border}`}>
                    <div className="flex items-center gap-3">
                      <div className={`${cat.bg} p-2 rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${cat.text}`}>{cat.name}</h3>
                        <p className="text-sm text-gray-500">{stats.total} eventi • {stats.days} giorni</p>
                      </div>
                      {stats.amount > 0 && (
                        <p className={`font-bold ${cat.text}`}>€{stats.amount.toFixed(0)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResetConfirmModal = () => {
    if (!showResetConfirm) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowResetConfirm(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Cancellare tutti i dati?</h3>
            <p className="text-gray-500 mb-6">Questa azione eliminerà tutti i {events.length} eventi salvati. Non può essere annullata.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={resetAllData}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Elimina tutto
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Life Planner 2026
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {saveStatus === 'saving' && (
                  <span className="flex items-center gap-1 text-amber-600 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvataggio...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    {isSupabaseConfigured() ? (
                      <>
                        <Database className="w-4 h-4" />
                        Supabase
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4" />
                        Locale
                      </>
                    )}
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center gap-1 text-red-600 text-sm">
                    <CloudOff className="w-4 h-4" />
                    Errore
                  </span>
                )}
                <span className="text-gray-400 text-sm">• {events.length} eventi</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowStats(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors font-medium"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="hidden sm:inline">Statistiche</span>
              </button>
              
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium"
                title="Esporta backup"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <label className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors font-medium cursor-pointer" title="Importa backup">
                <Upload className="w-5 h-5" />
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
              
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium"
                title="Elimina tutto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 ml-2">
                <button 
                  onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
                  disabled={selectedMonth === 0}
                  className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center min-w-[120px]">
                  <h2 className="text-xl font-bold text-gray-800">{months[selectedMonth]}</h2>
                  <p className="text-gray-400 text-sm">2026</p>
                </div>
                <button 
                  onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
                  disabled={selectedMonth === 11}
                  className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${cat.light}`}>
                  <div className={`w-2 h-2 rounded-full ${cat.dot}`}></div>
                  <Icon className={`w-3 h-3 ${cat.text}`} />
                  <span className={`text-xs font-medium ${cat.text}`}>{cat.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-7 bg-gradient-to-r from-blue-600 to-purple-600">
            {weekDays.map((day, idx) => (
              <div key={day} className={`p-3 text-center text-white font-semibold text-sm ${idx >= 5 ? 'bg-white/10' : ''}`}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {calendarDays.map((dayObj, idx) => {
              const isCurrentMonth = dayObj.currentMonth;
              const isDragOver = dragOverDay === dayObj.day && isCurrentMonth;
              const isWeekend = idx % 7 >= 5;
              const dayEvents = isCurrentMonth ? getEventsForDay(selectedMonth, dayObj.day) : [];
              const eventsStartingHere = isCurrentMonth ? getEventsStartingOnDay(selectedMonth, dayObj.day) : [];
              
              return (
                <div 
                  key={idx}
                  onClick={() => isCurrentMonth && setSelectedDay(dayObj.day)}
                  onDragOver={(e) => handleDragOver(e, dayObj.day, isCurrentMonth)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => isCurrentMonth && handleDrop(e, selectedMonth, dayObj.day)}
                  className={`
                    min-h-[100px] p-1 border-b border-r border-gray-100 transition-all cursor-pointer relative
                    ${isCurrentMonth ? 'bg-white hover:bg-blue-50/50' : 'bg-gray-50/50 cursor-default'}
                    ${isWeekend && isCurrentMonth ? 'bg-purple-50/30' : ''}
                    ${isDragOver ? 'bg-blue-100 ring-2 ring-blue-400 ring-inset' : ''}
                  `}
                >
                  <div className={`text-right font-semibold text-sm mb-1 ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'} ${isWeekend && isCurrentMonth ? 'text-purple-500' : ''}`}>
                    {dayObj.day}
                  </div>
                  
                  {isDragOver && (
                    <div className="absolute inset-2 top-8 flex items-center justify-center border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/50 z-10">
                      <span className="text-xs text-blue-500 font-medium">Rilascia qui</span>
                    </div>
                  )}
                  
                  {isCurrentMonth && !isDragOver && (
                    <div className="space-y-1">
                      {eventsStartingHere.map(event => {
                        const cat = categories.find(c => c.id === event.categoryId);
                        const duration = event.endDay - event.startDay + 1;
                        const isMulti = duration > 1;
                        const dayOfWeek = idx % 7;
                        const daysUntilEndOfRow = 7 - dayOfWeek;
                        const visibleDuration = Math.min(duration, daysUntilEndOfRow);
                        
                        return (
                          <div
                            key={event.id}
                            draggable
                            onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, event); }}
                            onDragEnd={handleDragEnd}
                            onClick={(e) => { e.stopPropagation(); setSelectedDay(event.startDay); }}
                            className={`
                              ${cat.bg} text-white text-xs px-2 py-1 rounded cursor-grab active:cursor-grabbing
                              truncate font-medium hover:opacity-90 transition-opacity
                              ${event.done ? 'opacity-60' : ''}
                            `}
                            style={{
                              width: isMulti ? `calc(${visibleDuration * 100}% + ${(visibleDuration - 1) * 2}px)` : '100%',
                              position: isMulti ? 'relative' : 'static',
                              zIndex: 5
                            }}
                          >
                            {event.done && <span className="mr-1">✓</span>}
                            {event.text}
                            {isMulti && <span className="ml-1 opacity-75">({duration}gg)</span>}
                          </div>
                        );
                      })}
                      
                      {dayEvents.filter(e => e.startDay < dayObj.day).map(event => {
                        const cat = categories.find(c => c.id === event.categoryId);
                        const dayOfWeek = idx % 7;
                        
                        if (dayOfWeek !== 0) return null;
                        
                        const remainingDays = event.endDay - dayObj.day + 1;
                        const visibleDuration = Math.min(remainingDays, 7);
                        
                        return (
                          <div
                            key={`cont-${event.id}`}
                            onClick={(e) => { e.stopPropagation(); setSelectedDay(event.startDay); }}
                            className={`
                              ${cat.bg} text-white text-xs px-2 py-1 rounded-r cursor-pointer
                              truncate font-medium hover:opacity-90 transition-opacity opacity-80
                            `}
                            style={{
                              width: `calc(${visibleDuration * 100}% + ${(visibleDuration - 1) * 2}px)`,
                              position: 'relative',
                              zIndex: 5
                            }}
                          >
                            ← {event.text}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {isCurrentMonth && !isDragOver && dayEvents.length === 0 && (
                    <div className="flex items-center justify-center h-12 opacity-0 hover:opacity-100 transition-opacity">
                      <Plus className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Month nav */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {months.map((month, idx) => {
              const monthEventCount = events.filter(e => e.month === idx).length;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedMonth(idx)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all relative ${
                    selectedMonth === idx 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {month.slice(0, 3)}
                  {monthEventCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                      selectedMonth === idx ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
                    }`}>
                      {monthEventCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map(cat => {
            const Icon = cat.icon;
            const stats = monthStats[cat.id];
            
            return (
              <div key={cat.id} className={`${cat.light} rounded-xl p-3 border ${cat.border}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`${cat.bg} p-1.5 rounded-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-xs font-medium ${cat.text} truncate`}>{cat.name}</span>
                </div>
                <div className="text-xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-xs text-gray-500">{stats.days} giorni</div>
              </div>
            );
          })}
        </div>

        {draggedItem && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-40">
            <GripVertical className="w-5 h-5" />
            <span>Trascinando: <strong>{draggedItem.text}</strong></span>
          </div>
        )}
      </div>

      <DayModal />
      <StatsModal />
      <ResetConfirmModal />
    </div>
  );
}

export default App;
