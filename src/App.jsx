import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, X, Check, GripVertical,
  Plane, Car, Train, Dumbbell, Bike, Heart, Utensils,
  PiggyBank, Stethoscope, Cake, BookOpen, Home, Target,
  MapPin, TrendingUp, Waves, Activity, Coffee,
  Gift, Bell, CreditCard, Wrench, Sparkles, CalendarDays,
  Cloud, CloudOff, Loader2, Trash2, Download, Upload, Sun, Moon,
  Flower2, Pencil, Copy, ClipboardPaste, ShoppingCart, ChefHat, Database,
  Calendar, UtensilsCrossed, Clock, Star
} from 'lucide-react';
import { supabase } from './supabaseClient';

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://your-project.supabase.co';
};

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
    name: 'Viaggi',
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
  { id: 'risparmi', name: 'Risparmi', icon: PiggyBank, bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400',
    subtypes: [{ id: 'deposito', name: 'Deposito', icon: PiggyBank }, { id: 'investimento', name: 'Investimento', icon: TrendingUp }, { id: 'obiettivo', name: 'Obiettivo Raggiunto', icon: Target }]
  },
  { id: 'salute', name: 'Salute', icon: Stethoscope, bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400',
    subtypes: [{ id: 'visita', name: 'Visita Medica', icon: Stethoscope }, { id: 'dentista', name: 'Dentista', icon: Sparkles }, { id: 'checkup', name: 'Checkup', icon: Activity }, { id: 'vaccino', name: 'Vaccino', icon: Heart }]
  },
  { id: 'eventi', name: 'Eventi', icon: Cake, bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-400',
    subtypes: [{ id: 'compleanno', name: 'Compleanno', icon: Gift }, { id: 'anniversario', name: 'Anniversario', icon: Heart }, { id: 'cena', name: 'Cena/Evento', icon: Utensils }, { id: 'scadenza', name: 'Scadenza', icon: Bell }]
  },
  { id: 'formazione', name: 'Formazione', icon: BookOpen, bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400',
    subtypes: [{ id: 'corso', name: 'Corso', icon: BookOpen }, { id: 'libro', name: 'Libro', icon: BookOpen }, { id: 'certificazione', name: 'Certificazione', icon: Target }]
  },
  { id: 'casa', name: 'Casa', icon: Home, bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400',
    subtypes: [{ id: 'bolletta', name: 'Bolletta', icon: CreditCard }, { id: 'manutenzione', name: 'Manutenzione', icon: Wrench }, { id: 'pulizie', name: 'Pulizie', icon: Home }]
  },
];

const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const weekDays = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const weekDaysFull = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

const STORAGE_KEY = 'life-planner-2026-data';
const DISHES_KEY = 'life-planner-2026-dishes';
const MEALS_KEY = 'life-planner-2026-meals';

function App() {
  const [currentPage, setCurrentPage] = useState('calendar');
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

  // Alimentazione state
  const [dishes, setDishes] = useState([]);
  const [meals, setMeals] = useState({});
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('proteine');
  const [editingDish, setEditingDish] = useState(null);
  const [selectedMealDay, setSelectedMealDay] = useState(null);
  const [alimentazioneTab, setAlimentazioneTab] = useState('ingredienti');
  const [mealPickerSlot, setMealPickerSlot] = useState('pranzo');

  // Calculate current week start
  const today = new Date();
  const currentDayOfMonth = today.getDate();
  const [viewingWeekStart, setViewingWeekStart] = useState(() => {
    return Math.max(1, currentDayOfMonth - ((today.getDay() + 6) % 7));
  });

  // Ingredient categories (materie prime)
  const ingredientCategories = [
    { id: 'proteine', name: 'Proteine', color: 'bg-red-500', emoji: '🥩' },
    { id: 'carboidrati', name: 'Carboidrati', color: 'bg-amber-500', emoji: '🌾' },
    { id: 'verdure', name: 'Verdure', color: 'bg-green-500', emoji: '🥗' },
    { id: 'latticini', name: 'Latticini', color: 'bg-blue-400', emoji: '🥛' },
    { id: 'frutta', name: 'Frutta', color: 'bg-orange-400', emoji: '🍎' },
    { id: 'altro_ing', name: 'Altro', color: 'bg-gray-500', emoji: '🫙' },
  ];

  // Dish categories (piatti composti)
  const dishCategories = [
    { id: 'pranzo', name: 'Pranzo', color: 'bg-orange-500', emoji: '🍽️' },
    { id: 'cena', name: 'Cena', color: 'bg-indigo-500', emoji: '🌙' },
    { id: 'colazione', name: 'Colazione', color: 'bg-amber-500', emoji: '☀️' },
    { id: 'spuntino', name: 'Spuntino', color: 'bg-purple-500', emoji: '🍪' },
  ];

  // State for composing dishes
  const [isComposing, setIsComposing] = useState(false);
  const [composingDish, setComposingDish] = useState({ name: '', category: 'pranzo', ingredients: [] });
  const [showIngredientPicker, setShowIngredientPicker] = useState(false);

  // Default ingredients to pre-load
  const defaultIngredients = [
    // Proteine
    { id: 'ing_pollo', name: 'Pollo', category: 'proteine', isIngredient: true },
    { id: 'ing_tonno', name: 'Tonno al naturale', category: 'proteine', isIngredient: true },
    { id: 'ing_salmone', name: 'Salmone', category: 'proteine', isIngredient: true },
    { id: 'ing_merluzzo', name: 'Merluzzo/Pesce bianco', category: 'proteine', isIngredient: true },
    { id: 'ing_uova', name: 'Uova', category: 'proteine', isIngredient: true },
    { id: 'ing_burger_veg', name: 'Burger vegetali', category: 'proteine', isIngredient: true },
    { id: 'ing_polpette_veg', name: 'Polpette vegetali', category: 'proteine', isIngredient: true },
    { id: 'ing_lenticchie', name: 'Lenticchie', category: 'proteine', isIngredient: true },
    { id: 'ing_feta', name: 'Feta', category: 'proteine', isIngredient: true },
    // Carboidrati
    { id: 'ing_quinoa', name: 'Quinoa', category: 'carboidrati', isIngredient: true },
    { id: 'ing_riso_int', name: 'Riso integrale', category: 'carboidrati', isIngredient: true },
    { id: 'ing_farro', name: 'Farro', category: 'carboidrati', isIngredient: true },
    { id: 'ing_pane_int', name: 'Pane integrale', category: 'carboidrati', isIngredient: true },
    { id: 'ing_pizza_int', name: 'Pizza base integrale', category: 'carboidrati', isIngredient: true },
    { id: 'ing_muesli', name: 'Muesli', category: 'carboidrati', isIngredient: true },
    { id: 'ing_cracker', name: 'Cracker', category: 'carboidrati', isIngredient: true },
    // Verdure
    { id: 'ing_verdure_grig', name: 'Verdure grigliate', category: 'verdure', isIngredient: true },
    { id: 'ing_verdure_forno', name: 'Verdure al forno', category: 'verdure', isIngredient: true },
    { id: 'ing_verdure_miste', name: 'Verdure miste', category: 'verdure', isIngredient: true },
    { id: 'ing_verdure_fresche', name: 'Verdure fresche', category: 'verdure', isIngredient: true },
    { id: 'ing_insalata', name: 'Insalata', category: 'verdure', isIngredient: true },
    { id: 'ing_lattuga', name: 'Lattuga', category: 'verdure', isIngredient: true },
    { id: 'ing_cetrioli', name: 'Cetrioli', category: 'verdure', isIngredient: true },
    { id: 'ing_pomodorini', name: 'Pomodorini', category: 'verdure', isIngredient: true },
    // Latticini
    { id: 'ing_yogurt_greco', name: 'Yogurt greco', category: 'latticini', isIngredient: true },
    { id: 'ing_ricotta', name: 'Ricotta', category: 'latticini', isIngredient: true },
    { id: 'ing_latte_sl', name: 'Latte s.l.', category: 'latticini', isIngredient: true },
    // Frutta
    { id: 'ing_banana', name: 'Banana', category: 'frutta', isIngredient: true },
    { id: 'ing_frutta', name: 'Frutta mista', category: 'frutta', isIngredient: true },
    // Altro
    { id: 'ing_marmellata', name: 'Marmellata', category: 'altro_ing', isIngredient: true },
    { id: 'ing_burro_arachidi', name: 'Burro d\'arachidi', category: 'altro_ing', isIngredient: true },
  ];

  // Default composed dishes
  const defaultDishes = [
    // Pranzi
    { id: 'dish_1', name: 'Pollo + Quinoa + Verdure grigliate', category: 'pranzo', isComposite: true, ingredientIds: ['ing_pollo', 'ing_quinoa', 'ing_verdure_grig'] },
    { id: 'dish_2', name: 'Tonno + Riso integrale + Insalata', category: 'pranzo', isComposite: true, ingredientIds: ['ing_tonno', 'ing_riso_int', 'ing_insalata'] },
    { id: 'dish_3', name: 'Burger vegetali + Farro + Verdure al forno', category: 'pranzo', isComposite: true, ingredientIds: ['ing_burger_veg', 'ing_farro', 'ing_verdure_forno'] },
    { id: 'dish_4', name: 'Salmone + Riso integrale + Verdure', category: 'pranzo', isComposite: true, ingredientIds: ['ing_salmone', 'ing_riso_int', 'ing_verdure_miste'] },
    { id: 'dish_5', name: 'Lenticchie + Verdure al forno', category: 'pranzo', isComposite: true, ingredientIds: ['ing_lenticchie', 'ing_verdure_forno'] },
    { id: 'dish_6', name: 'Insalata greca (lattuga, cetrioli, pomodorini, feta, tonno)', category: 'pranzo', isComposite: true, ingredientIds: ['ing_lattuga', 'ing_cetrioli', 'ing_pomodorini', 'ing_feta', 'ing_tonno'] },
    { id: 'dish_7', name: 'Lenticchie + Verdure fresche', category: 'pranzo', isComposite: true, ingredientIds: ['ing_lenticchie', 'ing_verdure_fresche'] },
    // Cene
    { id: 'dish_8', name: 'Merluzzo al forno + Insalata', category: 'cena', isComposite: true, ingredientIds: ['ing_merluzzo', 'ing_insalata'] },
    { id: 'dish_9', name: 'Polpette vegetali + Verdure miste', category: 'cena', isComposite: true, ingredientIds: ['ing_polpette_veg', 'ing_verdure_miste'] },
    { id: 'dish_10', name: 'Pollo + Verdure grigliate', category: 'cena', isComposite: true, ingredientIds: ['ing_pollo', 'ing_verdure_grig'] },
    { id: 'dish_11', name: 'Uova strapazzate/frittata + Insalata', category: 'cena', isComposite: true, ingredientIds: ['ing_uova', 'ing_insalata'] },
    { id: 'dish_12', name: 'Pizza integrale + Insalata', category: 'cena', isComposite: true, ingredientIds: ['ing_pizza_int', 'ing_insalata'] },
    // Colazioni
    { id: 'dish_13', name: 'Yogurt greco + Muesli + Banana (Andrea)', category: 'colazione', isComposite: true, ingredientIds: ['ing_yogurt_greco', 'ing_muesli', 'ing_banana'], person: 'andrea' },
    { id: 'dish_14', name: 'Pane integrale + Ricotta + Marmellata (Gaia)', category: 'colazione', isComposite: true, ingredientIds: ['ing_pane_int', 'ing_ricotta', 'ing_marmellata'], person: 'gaia' },
    { id: 'dish_15', name: 'Latte s.l. + Muesli + Banana (Gaia weekend)', category: 'colazione', isComposite: true, ingredientIds: ['ing_latte_sl', 'ing_muesli', 'ing_banana'], person: 'gaia' },
    // Spuntini
    { id: 'dish_16', name: 'Frutta + Cracker (Andrea)', category: 'spuntino', isComposite: true, ingredientIds: ['ing_frutta', 'ing_cracker'], person: 'andrea' },
    { id: 'dish_17', name: 'Yogurt greco + Burro d\'arachidi (Gaia)', category: 'spuntino', isComposite: true, ingredientIds: ['ing_yogurt_greco', 'ing_burro_arachidi'], person: 'gaia' },
  ];

  useEffect(() => {
    const loadData = async () => {
      // Load events
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.from('events').select('*').order('start_day', { ascending: true });
          if (error) throw error;
          setEvents(data ? data.map(fromDbFormat) : []);
        } catch (error) {
          console.error('Errore Supabase:', error);
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setEvents(JSON.parse(saved).events || []);
        }
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setEvents(JSON.parse(saved).events || []);
      }

      // Load dishes and meals from localStorage
      const savedDishes = localStorage.getItem(DISHES_KEY);
      if (savedDishes) {
        const parsed = JSON.parse(savedDishes);
        // Merge with defaults if empty
        if (parsed.length === 0) {
          setDishes([...defaultIngredients, ...defaultDishes]);
        } else {
          setDishes(parsed);
        }
      } else {
        // First load - use defaults
        setDishes([...defaultIngredients, ...defaultDishes]);
      }

      const savedMeals = localStorage.getItem(MEALS_KEY);
      if (savedMeals) setMeals(JSON.parse(savedMeals));

      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    setSaveStatus('saving');
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ events, lastSaved: new Date().toISOString() }));
        localStorage.setItem(DISHES_KEY, JSON.stringify(dishes));
        localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [events, dishes, meals, isLoading]);

  const exportData = () => {
    const dataStr = JSON.stringify({ events, dishes, meals, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.events) {
          if (isSupabaseConfigured()) {
            try {
              await supabase.from('events').delete().neq('id', 0);
              const dbEvents = imported.events.map(e => toDbFormat(e));
              const { data } = await supabase.from('events').insert(dbEvents).select();
              setEvents(data.map(fromDbFormat));
            } catch {
              setEvents(imported.events);
            }
          } else {
            setEvents(imported.events);
          }
        }
        if (imported.dishes) setDishes(imported.dishes);
        if (imported.meals) setMeals(imported.meals);
        alert('Importazione completata!');
      } catch (error) {
        alert('Errore: ' + error.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetAllData = async () => {
    if (isSupabaseConfigured()) {
      try { await supabase.from('events').delete().neq('id', 0); } catch {}
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DISHES_KEY);
    localStorage.removeItem(MEALS_KEY);
    setEvents([]);
    setDishes([]);
    setMeals({});
    setShowResetConfirm(false);
  };

  const getDaysInMonth = (month) => new Date(2026, month + 1, 0).getDate();

  const addEvent = async (month, startDay, categoryId, subtypeId) => {
    const category = categories.find(c => c.id === categoryId);
    const subtype = category.subtypes.find(s => s.id === subtypeId);
    let endDay = startDay;
    if (isMultiDay && newItemEndDay) {
      endDay = Math.min(Math.max(parseInt(newItemEndDay), startDay), getDaysInMonth(month));
    }
    const newEvent = {
      id: Date.now(), month, startDay, endDay, categoryId, subtypeId,
      subtypeName: subtype.name, text: newItemText || subtype.name,
      amount: newItemAmount ? parseFloat(newItemAmount) : null,
      timeSlot: newItemTimeSlot || null, done: false
    };
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('events').insert([toDbFormat(newEvent)]).select().single();
        setEvents(prev => [...prev, fromDbFormat(data)]);
      } catch { setEvents(prev => [...prev, newEvent]); }
    } else {
      setEvents(prev => [...prev, newEvent]);
    }
    setNewItemText(''); setNewItemAmount(''); setNewItemEndDay('');
    setIsMultiDay(false); setNewItemTimeSlot(''); setAddingTo(null);
  };

  const toggleEvent = async (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const newDone = !event.done;
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, done: newDone } : e));
    if (isSupabaseConfigured()) {
      try { await supabase.from('events').update({ done: newDone }).eq('id', eventId); } catch {}
    }
  };

  const removeEvent = async (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    if (isSupabaseConfigured()) {
      try { await supabase.from('events').delete().eq('id', eventId); } catch {}
    }
  };

  const startEditEvent = (event) => {
    setEditingEvent({ ...event, editText: event.text, editAmount: event.amount || '', editTimeSlot: event.timeSlot || '', editEndDay: event.endDay });
  };

  const saveEditEvent = async () => {
    if (!editingEvent) return;
    const updatedFields = {
      text: editingEvent.editText || editingEvent.subtypeName,
      amount: editingEvent.editAmount ? parseFloat(editingEvent.editAmount) : null,
      timeSlot: editingEvent.editTimeSlot || null, endDay: editingEvent.editEndDay
    };
    setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...updatedFields } : e));
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('events').update({ text: updatedFields.text, amount: updatedFields.amount, time_slot: updatedFields.timeSlot, end_day: updatedFields.endDay }).eq('id', editingEvent.id);
      } catch {}
    }
    setEditingEvent(null);
  };

  const getWeekRange = (day) => {
    const date = new Date(2026, selectedMonth, day);
    const dayOfWeek = date.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = day + mondayOffset;
    return { monday: Math.max(1, monday), sunday: Math.min(getDaysInMonth(selectedMonth), monday + 6) };
  };

  const copyWeekSport = (day) => {
    const { monday, sunday } = getWeekRange(day);
    const sportEvents = events.filter(e => e.month === selectedMonth && (e.categoryId === 'sport' || e.categoryId === 'sport_gaia') && e.startDay >= monday && e.startDay <= sunday);
    if (sportEvents.length === 0) { alert('Nessun evento sport'); return; }
    setCopiedWeek({ events: sportEvents.map(e => ({ ...e, dayOffset: e.startDay - monday, endDayOffset: e.endDay - monday })), sourceMonth: selectedMonth, sourceMonday: monday });
    alert(`Copiati ${sportEvents.length} eventi sport`);
  };

  const pasteWeekSport = async (day) => {
    if (!copiedWeek) return;
    const { monday } = getWeekRange(day);
    const maxDay = getDaysInMonth(selectedMonth);
    const newEvents = copiedWeek.events.map(e => ({ ...e, id: Date.now() + Math.random(), month: selectedMonth, startDay: Math.min(monday + e.dayOffset, maxDay), endDay: Math.min(monday + e.endDayOffset, maxDay) }));
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('events').insert(newEvents.map(toDbFormat)).select();
        setEvents(prev => [...prev, ...data.map(fromDbFormat)]);
      } catch { setEvents(prev => [...prev, ...newEvents]); }
    } else { setEvents(prev => [...prev, ...newEvents]); }
    alert(`Incollati ${newEvents.length} eventi`);
  };

  const copyDay = (day) => {
    const dayEvents = events.filter(e => e.month === selectedMonth && e.startDay === day);
    if (dayEvents.length === 0) { alert('Nessun evento'); return; }
    setCopiedDay({ events: dayEvents.map(e => ({ ...e })), sourceMonth: selectedMonth, sourceDay: day });
    alert(`Copiati ${dayEvents.length} eventi`);
  };

  const pasteDay = async (targetDay) => {
    if (!copiedDay) return;
    const maxDay = getDaysInMonth(selectedMonth);
    const newEvents = copiedDay.events.map(e => ({ ...e, id: Date.now() + Math.random(), month: selectedMonth, startDay: targetDay, endDay: Math.min(targetDay + (e.endDay - e.startDay), maxDay) }));
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('events').insert(newEvents.map(toDbFormat)).select();
        setEvents(prev => [...prev, ...data.map(fromDbFormat)]);
      } catch { setEvents(prev => [...prev, ...newEvents]); }
    } else { setEvents(prev => [...prev, ...newEvents]); }
    alert(`Incollati ${newEvents.length} eventi`);
  };

  const getEventsForDay = (month, day) => events.filter(e => e.month === month && day >= e.startDay && day <= e.endDay);
  const getEventsStartingOnDay = (month, day) => events.filter(e => e.month === month && e.startDay === day);

  const handleDragStart = (e, event) => { setDraggedItem(event); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e, day, isCurrentMonth) => { e.preventDefault(); if (isCurrentMonth && draggedItem) setDragOverDay(day); };
  const handleDragLeave = () => setDragOverDay(null);

  const handleDrop = async (e, targetMonth, targetDay) => {
    e.preventDefault(); setDragOverDay(null);
    if (!draggedItem) return;
    const duration = draggedItem.endDay - draggedItem.startDay;
    const newEndDay = Math.min(targetDay + duration, getDaysInMonth(targetMonth));
    setEvents(prev => prev.map(event => event.id === draggedItem.id ? { ...event, month: targetMonth, startDay: targetDay, endDay: newEndDay } : event));
    if (isSupabaseConfigured()) {
      try { await supabase.from('events').update({ month: targetMonth, start_day: targetDay, end_day: newEndDay }).eq('id', draggedItem.id); } catch {}
    }
    setDraggedItem(null);
  };

  const getCalendarDays = (month) => {
    const firstDay = new Date(2026, month, 1);
    const daysInMonth = new Date(2026, month + 1, 0).getDate();
    const startingDay = (firstDay.getDay() + 6) % 7;
    const days = [];
    const prevMonthLastDay = new Date(2026, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) days.push({ day: prevMonthLastDay - i, currentMonth: false, month: month - 1 });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, currentMonth: true, month });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ day: i, currentMonth: false, month: month + 1 });
    return days;
  };

  const getMonthStats = () => {
    const stats = {};
    categories.forEach(cat => { stats[cat.id] = { total: 0, done: 0, amount: 0, days: 0 }; });
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
    categories.forEach(cat => { stats[cat.id] = { total: 0, done: 0, amount: 0, days: 0 }; });
    events.forEach(event => {
      stats[event.categoryId].total++;
      stats[event.categoryId].days += (event.endDay - event.startDay + 1);
      if (event.done) stats[event.categoryId].done++;
      if (event.amount) stats[event.categoryId].amount += event.amount;
    });
    return stats;
  };

  // Dish functions
  const addDish = () => {
    if (!newDishName.trim()) return;
    const newDish = { id: Date.now(), name: newDishName, category: newDishCategory, favorite: false };
    setDishes(prev => [...prev, newDish]);
    setNewDishName('');
  };

  const toggleDishFavorite = (dishId) => {
    setDishes(prev => prev.map(d => d.id === dishId ? { ...d, favorite: !d.favorite } : d));
  };

  const removeDish = (dishId) => {
    setDishes(prev => prev.filter(d => d.id !== dishId));
  };

  const addMealToDaySlot = (month, day, slot, dishId) => {
    const key = `${month}-${day}`;
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;
    setMeals(prev => ({
      ...prev,
      [key]: { ...prev[key], [slot]: [...(prev[key]?.[slot] || []), { id: Date.now(), dishId, dishName: dish.name }] }
    }));
  };

  const removeMealFromDaySlot = (month, day, slot, mealId) => {
    const key = `${month}-${day}`;
    setMeals(prev => ({
      ...prev,
      [key]: { ...prev[key], [slot]: (prev[key]?.[slot] || []).filter(m => m.id !== mealId) }
    }));
  };

  const getMealsForDay = (month, day) => {
    const key = `${month}-${day}`;
    return meals[key] || {};
  };

  const calendarDays = getCalendarDays(selectedMonth);
  const monthStats = getMonthStats();
  const yearStats = getYearStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Bottom Navigation
  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex justify-around items-center h-16">
        <button onClick={() => setCurrentPage('calendar')} className={`flex flex-col items-center gap-1 px-4 py-2 ${currentPage === 'calendar' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Calendar className="w-6 h-6" />
          <span className="text-xs">Calendario</span>
        </button>
        <button onClick={() => setCurrentPage('alimentazione')} className={`flex flex-col items-center gap-1 px-4 py-2 ${currentPage === 'alimentazione' ? 'text-orange-600' : 'text-gray-500'}`}>
          <UtensilsCrossed className="w-6 h-6" />
          <span className="text-xs">Cucina</span>
        </button>
        <button onClick={() => setShowStats(true)} className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500">
          <TrendingUp className="w-6 h-6" />
          <span className="text-xs">Stats</span>
        </button>
      </div>
    </nav>
  );

  // Header component
  const Header = () => (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Life Planner
          </h1>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            {isSupabaseConfigured() ? <Database className="w-3 h-3" /> : <Cloud className="w-3 h-3" />}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={exportData} className="p-2 text-gray-500 hover:text-blue-600"><Download className="w-5 h-5" /></button>
          <label className="p-2 text-gray-500 hover:text-purple-600 cursor-pointer">
            <Upload className="w-5 h-5" />
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
          <button onClick={() => setShowResetConfirm(true)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
        </div>
      </div>
    </header>
  );

  // Calendar Page
  const CalendarPage = () => (
    <div className="pb-20">
      {/* Month navigation */}
      <div className="bg-white px-3 py-3 flex items-center justify-between border-b">
        <button onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))} disabled={selectedMonth === 0} className="p-2 rounded-full bg-gray-100 disabled:opacity-30">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold">{months[selectedMonth]}</h2>
          <p className="text-xs text-gray-500">2026</p>
        </div>
        <button onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))} disabled={selectedMonth === 11} className="p-2 rounded-full bg-gray-100 disabled:opacity-30">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Mini month selector */}
      <div className="bg-white px-2 py-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          {months.map((m, i) => (
            <button key={i} onClick={() => setSelectedMonth(i)} className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${selectedMonth === i ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, idx) => (
            <div key={day} className={`py-2 text-center text-xs font-medium ${idx >= 5 ? 'text-purple-600' : 'text-gray-600'}`}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((dayObj, idx) => {
            const isCurrentMonth = dayObj.currentMonth;
            const isWeekend = idx % 7 >= 5;
            const dayEvents = isCurrentMonth ? getEventsStartingOnDay(selectedMonth, dayObj.day) : [];
            const allDayEvents = isCurrentMonth ? getEventsForDay(selectedMonth, dayObj.day) : [];

            return (
              <div
                key={idx}
                onClick={() => isCurrentMonth && setSelectedDay(dayObj.day)}
                onDragOver={(e) => handleDragOver(e, dayObj.day, isCurrentMonth)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => isCurrentMonth && handleDrop(e, selectedMonth, dayObj.day)}
                className={`min-h-[60px] p-1 border-b border-r border-gray-100 ${isCurrentMonth ? '' : 'opacity-30'} ${isWeekend && isCurrentMonth ? 'bg-purple-50/50' : ''} ${dragOverDay === dayObj.day && isCurrentMonth ? 'bg-blue-100' : ''}`}
              >
                <div className={`text-right text-xs mb-0.5 ${isCurrentMonth ? (isWeekend ? 'text-purple-600 font-medium' : 'text-gray-700') : 'text-gray-300'}`}>
                  {dayObj.day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map(event => {
                    const cat = categories.find(c => c.id === event.categoryId);
                    return (
                      <div key={event.id} className={`${cat.bg} text-white text-[10px] px-1 py-0.5 rounded truncate ${event.done ? 'opacity-50' : ''}`}>
                        {event.done && '✓'}{event.text.slice(0, 8)}
                      </div>
                    );
                  })}
                  {allDayEvents.length > 3 && <div className="text-[10px] text-gray-400 text-center">+{allDayEvents.length - 3}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Helper function for week days in Alimentazione
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = viewingWeekStart + i;
      if (day <= getDaysInMonth(selectedMonth)) {
        days.push(day);
      }
    }
    return days;
  };

  // Get ingredients and composed dishes
  const ingredients = dishes.filter(d => d.isIngredient);
  const composedDishes = dishes.filter(d => !d.isIngredient);

  // Function to add ingredient
  const addIngredient = () => {
    if (!newDishName.trim()) return;
    const newIngredient = {
      id: `ing_${Date.now()}`,
      name: newDishName,
      category: newDishCategory,
      isIngredient: true,
      favorite: false
    };
    setDishes(prev => [...prev, newIngredient]);
    setNewDishName('');
  };

  // Function to create composed dish
  const createComposedDish = () => {
    if (composingDish.ingredients.length === 0) return;
    const ingredientNames = composingDish.ingredients.map(id => {
      const ing = dishes.find(d => d.id === id);
      return ing ? ing.name : '';
    }).filter(Boolean);

    const dishName = composingDish.name || ingredientNames.join(' + ');
    const newDish = {
      id: `dish_${Date.now()}`,
      name: dishName,
      category: composingDish.category,
      isComposite: true,
      ingredientIds: composingDish.ingredients,
      favorite: false
    };
    setDishes(prev => [...prev, newDish]);
    setComposingDish({ name: '', category: 'pranzo', ingredients: [] });
    setIsComposing(false);
  };

  // Toggle ingredient selection for composing
  const toggleIngredientForComposition = (ingredientId) => {
    setComposingDish(prev => ({
      ...prev,
      ingredients: prev.ingredients.includes(ingredientId)
        ? prev.ingredients.filter(id => id !== ingredientId)
        : [...prev.ingredients, ingredientId]
    }));
  };

  // Render Alimentazione Page inline (to avoid re-render issues)
  const renderAlimentazionePage = () => (
    <div className="pb-20">
      {/* Tabs with icons */}
      <div className="bg-white border-b sticky top-[52px] z-30">
        <div className="flex">
          <button
            onClick={() => setAlimentazioneTab('ingredienti')}
            className={`flex-1 py-3 flex items-center justify-center gap-1 text-xs font-medium border-b-2 transition-colors ${alimentazioneTab === 'ingredienti' ? 'border-green-500 text-green-600 bg-green-50/50' : 'border-transparent text-gray-500'}`}
          >
            <span>🥗</span>
            Ingredienti
          </button>
          <button
            onClick={() => setAlimentazioneTab('piatti')}
            className={`flex-1 py-3 flex items-center justify-center gap-1 text-xs font-medium border-b-2 transition-colors ${alimentazioneTab === 'piatti' ? 'border-orange-500 text-orange-600 bg-orange-50/50' : 'border-transparent text-gray-500'}`}
          >
            <ChefHat className="w-4 h-4" />
            Piatti
          </button>
          <button
            onClick={() => setAlimentazioneTab('planning')}
            className={`flex-1 py-3 flex items-center justify-center gap-1 text-xs font-medium border-b-2 transition-colors ${alimentazioneTab === 'planning' ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-gray-500'}`}
          >
            <Calendar className="w-4 h-4" />
            Pianifica
          </button>
        </div>
      </div>

      {/* INGREDIENTI TAB */}
      {alimentazioneTab === 'ingredienti' && (
        <div className="p-4">
          {/* Add new ingredient */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 shadow-lg mb-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Aggiungi ingrediente
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newDishName}
                onChange={(e) => setNewDishName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                placeholder="Es: Pollo, Quinoa, Spinaci..."
                className="flex-1 px-4 py-3 border-0 rounded-xl text-sm focus:ring-2 focus:ring-white/50 shadow-inner"
              />
              <button
                onClick={addIngredient}
                disabled={!newDishName.trim()}
                className="bg-white text-green-600 px-5 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredientCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNewDishCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${newDishCategory === cat.id ? 'bg-white text-green-600 shadow-md scale-105' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients list by category */}
          {ingredientCategories.map(cat => {
            const catIngredients = ingredients.filter(d => d.category === cat.id);
            if (catIngredients.length === 0) return null;
            return (
              <div key={cat.id} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{cat.emoji}</span>
                  <h4 className="text-sm font-semibold text-gray-700">{cat.name}</h4>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{catIngredients.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {catIngredients.map(ing => (
                    <div
                      key={ing.id}
                      className={`${cat.color} text-white rounded-full px-3 py-1.5 text-sm flex items-center gap-2 shadow-sm`}
                    >
                      <span>{ing.name}</span>
                      <button
                        onClick={() => removeDish(ing.id)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {ingredients.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🥗</span>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Nessun ingrediente salvato</h3>
              <p className="text-gray-400 text-sm">Aggiungi le tue materie prime!</p>
            </div>
          )}
        </div>
      )}

      {/* PIATTI TAB */}
      {alimentazioneTab === 'piatti' && (
        <div className="p-4">
          {/* Compose new dish */}
          {!isComposing ? (
            <button
              onClick={() => setIsComposing(true)}
              className="w-full bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-4 shadow-lg mb-5 text-white text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Componi un nuovo piatto
                  </h3>
                  <p className="text-orange-100 text-sm mt-1">Seleziona gli ingredienti per creare una combinazione</p>
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
            </button>
          ) : (
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-4 shadow-lg mb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Componi piatto
                </h3>
                <button onClick={() => { setIsComposing(false); setComposingDish({ name: '', category: 'pranzo', ingredients: [] }); }} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category selector */}
              <div className="flex flex-wrap gap-2 mb-3">
                {dishCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setComposingDish(prev => ({ ...prev, category: cat.id }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${composingDish.category === cat.id ? 'bg-white text-orange-600 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Selected ingredients */}
              <div className="bg-white/20 rounded-xl p-3 mb-3 min-h-[60px]">
                {composingDish.ingredients.length === 0 ? (
                  <p className="text-white/70 text-sm text-center">Seleziona gli ingredienti qui sotto</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {composingDish.ingredients.map(id => {
                      const ing = dishes.find(d => d.id === id);
                      if (!ing) return null;
                      const cat = ingredientCategories.find(c => c.id === ing.category);
                      return (
                        <span key={id} className={`${cat?.color || 'bg-gray-500'} text-white rounded-full px-3 py-1 text-sm flex items-center gap-1`}>
                          {ing.name}
                          <button onClick={() => toggleIngredientForComposition(id)} className="hover:bg-white/20 rounded-full">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Ingredient picker */}
              <div className="bg-white rounded-xl p-3 max-h-48 overflow-y-auto mb-3">
                {ingredientCategories.map(cat => {
                  const catIngredients = ingredients.filter(d => d.category === cat.id);
                  if (catIngredients.length === 0) return null;
                  return (
                    <div key={cat.id} className="mb-2">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <span>{cat.emoji}</span> {cat.name}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {catIngredients.map(ing => {
                          const isSelected = composingDish.ingredients.includes(ing.id);
                          return (
                            <button
                              key={ing.id}
                              onClick={() => toggleIngredientForComposition(ing.id)}
                              className={`px-2 py-1 rounded-full text-xs transition-all ${isSelected ? cat.color + ' text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                              {ing.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional custom name */}
              <input
                type="text"
                value={composingDish.name}
                onChange={(e) => setComposingDish(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome personalizzato (opzionale)"
                className="w-full px-4 py-2 rounded-xl text-sm mb-3"
              />

              {/* Create button */}
              <button
                onClick={createComposedDish}
                disabled={composingDish.ingredients.length === 0}
                className="w-full bg-white text-orange-600 py-3 rounded-xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crea Piatto ({composingDish.ingredients.length} ingredienti)
              </button>
            </div>
          )}

          {/* Composed dishes list by category */}
          {dishCategories.map(cat => {
            const catDishes = composedDishes.filter(d => d.category === cat.id);
            if (catDishes.length === 0) return null;
            return (
              <div key={cat.id} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{cat.emoji}</span>
                  <h4 className="text-sm font-semibold text-gray-700">{cat.name}</h4>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{catDishes.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {catDishes.map(dish => (
                    <div
                      key={dish.id}
                      className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-8 rounded-full ${cat.color}`}></div>
                            <span className="font-medium text-gray-800">{dish.name}</span>
                          </div>
                          {dish.ingredientIds && (
                            <div className="flex flex-wrap gap-1 mt-2 ml-5">
                              {dish.ingredientIds.map(ingId => {
                                const ing = dishes.find(d => d.id === ingId);
                                const ingCat = ing ? ingredientCategories.find(c => c.id === ing.category) : null;
                                return ing ? (
                                  <span key={ingId} className={`text-xs px-2 py-0.5 rounded-full ${ingCat?.color || 'bg-gray-400'} text-white`}>
                                    {ing.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleDishFavorite(dish.id)}
                            className={`p-1.5 rounded-full transition-all ${dish.favorite ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'}`}
                          >
                            <Star className="w-5 h-5" fill={dish.favorite ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => removeDish(dish.id)}
                            className="p-1.5 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {composedDishes.length === 0 && !isComposing && (
            <div className="text-center py-12">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Nessun piatto creato</h3>
              <p className="text-gray-400 text-sm">Componi i tuoi piatti combinando gli ingredienti!</p>
            </div>
          )}
        </div>
      )}

      {alimentazioneTab === 'planning' && (
        <div className="p-4">
          {/* Week navigation - improved */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex items-center justify-between">
            <button
              onClick={() => setViewingWeekStart(Math.max(1, viewingWeekStart - 7))}
              className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Settimana</p>
              <p className="font-semibold text-gray-800">{viewingWeekStart} - {Math.min(viewingWeekStart + 6, getDaysInMonth(selectedMonth))} {months[selectedMonth]}</p>
            </div>
            <button
              onClick={() => setViewingWeekStart(Math.min(getDaysInMonth(selectedMonth) - 6, viewingWeekStart + 7))}
              className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week days - improved */}
          <div className="space-y-4">
            {getWeekDays().map(day => {
              const dayMeals = getMealsForDay(selectedMonth, day);
              const dayOfWeek = new Date(2026, selectedMonth, day).getDay();
              const dayName = weekDaysFull[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const hasMeals = Object.values(dayMeals).some(arr => arr && arr.length > 0);

              return (
                <div
                  key={day}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${isWeekend ? 'border-purple-200' : 'border-gray-100'}`}
                >
                  {/* Day header */}
                  <div className={`px-4 py-3 flex items-center justify-between ${isWeekend ? 'bg-purple-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${isWeekend ? 'bg-purple-500' : 'bg-orange-500'}`}>
                        {day}
                      </div>
                      <div>
                        <p className={`font-semibold ${isWeekend ? 'text-purple-700' : 'text-gray-800'}`}>{dayName}</p>
                        <p className="text-xs text-gray-400">{months[selectedMonth]}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMealDay({ month: selectedMonth, day })}
                      className={`p-2 rounded-xl transition-colors ${isWeekend ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Meals grid */}
                  <div className="p-3">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { slot: 'colazione', icon: Coffee, label: 'Colazione', color: 'amber' },
                        { slot: 'pranzo', icon: Sun, label: 'Pranzo', color: 'orange' },
                        { slot: 'cena', icon: Moon, label: 'Cena', color: 'indigo' }
                      ].map(({ slot, icon: SlotIcon, label, color }) => (
                        <div
                          key={slot}
                          className={`rounded-xl p-2 bg-${color}-50 border border-${color}-100`}
                          onClick={() => { setSelectedMealDay({ month: selectedMonth, day }); setMealPickerSlot(slot); }}
                        >
                          <div className={`flex items-center gap-1 mb-2 text-${color}-600`}>
                            <SlotIcon className="w-3 h-3" />
                            <span className="text-xs font-medium">{label}</span>
                          </div>
                          <div className="space-y-1 min-h-[40px]">
                            {(dayMeals[slot] || []).length > 0 ? (
                              (dayMeals[slot] || []).map(meal => (
                                <div
                                  key={meal.id}
                                  className="bg-white rounded-lg px-2 py-1.5 text-xs flex items-center justify-between shadow-sm"
                                >
                                  <span className="truncate font-medium text-gray-700">{meal.dishName}</span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); removeMealFromDaySlot(selectedMonth, day, slot, meal.id); }}
                                    className="text-gray-300 hover:text-red-500 ml-1 flex-shrink-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-300 text-center py-2">-</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {dishes.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
              <p className="text-amber-700 text-sm text-center">
                Aggiungi prima dei piatti nella sezione "I Miei Piatti" per poterli pianificare!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render Meal picker modal inline
  const renderMealPickerModal = () => {
    if (!selectedMealDay) return null;

    // Only show composed dishes, sorted by favorites first
    const availableDishes = composedDishes.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedMealDay(null)}>
        <div className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-orange-100 text-sm">Aggiungi pasto per</p>
                <h3 className="font-bold text-xl">{selectedMealDay.day} {months[selectedMealDay.month]}</h3>
              </div>
              <button onClick={() => setSelectedMealDay(null)} className="p-2 bg-white/20 rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Slot selector */}
            <div className="flex gap-2">
              {[
                { slot: 'colazione', icon: Coffee, label: 'Colazione' },
                { slot: 'pranzo', icon: Sun, label: 'Pranzo' },
                { slot: 'cena', icon: Moon, label: 'Cena' }
              ].map(({ slot, icon: SlotIcon, label }) => (
                <button
                  key={slot}
                  onClick={() => setMealPickerSlot(slot)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${mealPickerSlot === slot ? 'bg-white text-orange-600 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  <SlotIcon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes list */}
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {availableDishes.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UtensilsCrossed className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Nessun piatto disponibile</p>
                <p className="text-gray-400 text-sm">Vai su "I Miei Piatti" per aggiungerne</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableDishes.map(dish => {
                  const cat = dishCategories.find(c => c.id === dish.category);
                  return (
                    <button
                      key={dish.id}
                      onClick={() => { addMealToDaySlot(selectedMealDay.month, selectedMealDay.day, mealPickerSlot, dish.id); setSelectedMealDay(null); }}
                      className="w-full text-left p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors active:scale-[0.98]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {dish.favorite && <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />}
                          <span className="font-medium text-gray-800">{dish.name}</span>
                        </div>
                        {dish.ingredientIds && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dish.ingredientIds.slice(0, 3).map(ingId => {
                              const ing = dishes.find(d => d.id === ingId);
                              return ing ? (
                                <span key={ingId} className="text-xs text-gray-500">{ing.name}</span>
                              ) : null;
                            })}
                            {dish.ingredientIds.length > 3 && <span className="text-xs text-gray-400">+{dish.ingredientIds.length - 3}</span>}
                          </div>
                        )}
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${cat?.color} text-white ml-2`}>{cat?.emoji} {cat?.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Day Modal
  const DayModal = () => {
    if (selectedDay === null) return null;
    const dayOfWeek = new Date(2026, selectedMonth, selectedDay).getDay();
    const dayName = weekDaysFull[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
    const dayEvents = getEventsForDay(selectedMonth, selectedDay);

    return (
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => { setSelectedDay(null); setAddingTo(null); setModalTab('attivita'); setEditingEvent(null); }}>
        <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedDay} {months[selectedMonth]}</h2>
                <p className="text-sm opacity-80">{dayName} 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copyDay(selectedDay)} className="p-2 bg-white/20 rounded-lg"><Copy className="w-4 h-4" /></button>
                {copiedDay && <button onClick={() => pasteDay(selectedDay)} className="p-2 bg-green-500 rounded-lg"><ClipboardPaste className="w-4 h-4" /></button>}
                <button onClick={() => copyWeekSport(selectedDay)} className="p-2 bg-green-400/30 rounded-lg"><Dumbbell className="w-4 h-4" /></button>
                {copiedWeek && <button onClick={() => pasteWeekSport(selectedDay)} className="p-2 bg-green-500 rounded-lg"><ClipboardPaste className="w-4 h-4" /></button>}
                <button onClick={() => { setSelectedDay(null); setAddingTo(null); setModalTab('attivita'); setEditingEvent(null); }} className="p-2"><X className="w-6 h-6" /></button>
              </div>
            </div>
          </div>

          {dayEvents.length > 0 && (
            <div className="p-3 bg-gray-50 border-b">
              <div className="space-y-2">
                {dayEvents.map(event => {
                  const cat = categories.find(c => c.id === event.categoryId);
                  const Icon = cat.icon;
                  const isEditing = editingEvent?.id === event.id;

                  if (isEditing) {
                    return (
                      <div key={event.id} className={`p-3 rounded-xl ${cat.light} border ${cat.border}`}>
                        <input type="text" value={editingEvent.editText} onChange={e => setEditingEvent({...editingEvent, editText: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm mb-2" />
                        {cat.hasTimeSlot && (
                          <div className="flex gap-2 mb-2">
                            <button onClick={() => setEditingEvent({...editingEvent, editTimeSlot: 'mattina'})} className={`flex-1 py-2 rounded-lg text-sm ${editingEvent.editTimeSlot === 'mattina' ? 'bg-amber-400 text-white' : 'bg-gray-100'}`}><Sun className="w-4 h-4 mx-auto" /></button>
                            <button onClick={() => setEditingEvent({...editingEvent, editTimeSlot: 'sera'})} className={`flex-1 py-2 rounded-lg text-sm ${editingEvent.editTimeSlot === 'sera' ? 'bg-indigo-500 text-white' : 'bg-gray-100'}`}><Moon className="w-4 h-4 mx-auto" /></button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={saveEditEvent} className={`flex-1 ${cat.bg} text-white py-2 rounded-lg text-sm`}>Salva</button>
                          <button onClick={() => setEditingEvent(null)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Annulla</button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={event.id} className={`flex items-center gap-2 p-2 rounded-xl ${cat.light} border ${cat.border}`}>
                      <button onClick={() => toggleEvent(event.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${event.done ? cat.bg + ' border-transparent' : 'border-gray-300 bg-white'}`}>
                        {event.done && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className={`${cat.bg} p-1.5 rounded-lg`}><Icon className="w-4 h-4 text-white" /></div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${event.done ? 'line-through opacity-50' : ''}`}>
                          {event.text}
                          {event.timeSlot && <span className={`ml-1 text-xs ${event.timeSlot === 'mattina' ? 'text-amber-600' : 'text-indigo-600'}`}>{event.timeSlot === 'mattina' ? '☀️' : '🌙'}</span>}
                        </p>
                      </div>
                      <button onClick={() => startEditEvent(event)} className="p-1 text-gray-400"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => removeEvent(event.id)} className="p-1 text-gray-400"><X className="w-4 h-4" /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-3">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              <button onClick={() => setModalTab('attivita')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${modalTab === 'attivita' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>Attività</button>
              <button onClick={() => setModalTab('alimentazione')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${modalTab === 'alimentazione' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>Alimentazione</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.filter(cat => modalTab === 'alimentazione' ? cat.id === 'alimentazione' : cat.id !== 'alimentazione').map(cat => {
                const Icon = cat.icon;
                const isAddingToThis = addingTo?.categoryId === cat.id;

                if (isAddingToThis) {
                  return (
                    <div key={cat.id} className={`col-span-2 ${cat.light} rounded-xl p-3 border ${cat.border}`}>
                      {!addingTo.subtypeId ? (
                        <div className="grid grid-cols-2 gap-2">
                          {cat.subtypes.map(sub => {
                            const SubIcon = sub.icon;
                            return <button key={sub.id} onClick={() => setAddingTo({ categoryId: cat.id, subtypeId: sub.id })} className="flex items-center gap-2 p-2 bg-white rounded-lg text-sm border"><SubIcon className={`w-4 h-4 ${cat.text}`} />{sub.name}</button>;
                          })}
                          <button onClick={() => setAddingTo(null)} className="col-span-2 p-2 text-gray-500 text-sm">Annulla</button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input type="text" value={newItemText} onChange={e => setNewItemText(e.target.value)} placeholder="Descrizione" className="w-full px-3 py-2 rounded-lg border text-sm" autoFocus />
                          {cat.hasTimeSlot && (
                            <div className="flex gap-2">
                              <button onClick={() => setNewItemTimeSlot(newItemTimeSlot === 'mattina' ? '' : 'mattina')} className={`flex-1 py-2 rounded-lg text-sm ${newItemTimeSlot === 'mattina' ? 'bg-amber-400 text-white' : 'bg-gray-100'}`}><Sun className="w-4 h-4 mx-auto" /></button>
                              <button onClick={() => setNewItemTimeSlot(newItemTimeSlot === 'sera' ? '' : 'sera')} className={`flex-1 py-2 rounded-lg text-sm ${newItemTimeSlot === 'sera' ? 'bg-indigo-500 text-white' : 'bg-gray-100'}`}><Moon className="w-4 h-4 mx-auto" /></button>
                            </div>
                          )}
                          <button onClick={() => setIsMultiDay(!isMultiDay)} className={`w-full py-2 rounded-lg text-sm ${isMultiDay ? cat.bg + ' text-white' : 'bg-gray-100'}`}>
                            <CalendarDays className="w-4 h-4 inline mr-1" />Più giorni
                          </button>
                          {isMultiDay && (
                            <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                              <span className="text-sm">Dal {selectedDay} al</span>
                              <input type="number" min={selectedDay} max={getDaysInMonth(selectedMonth)} value={newItemEndDay} onChange={e => setNewItemEndDay(e.target.value)} className="w-16 px-2 py-1 border rounded text-sm text-center" />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button onClick={() => addEvent(selectedMonth, selectedDay, cat.id, addingTo.subtypeId)} className={`flex-1 ${cat.bg} text-white py-2 rounded-lg text-sm`}>Aggiungi</button>
                            <button onClick={() => { setAddingTo(null); setIsMultiDay(false); }} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">✕</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button key={cat.id} onClick={() => setAddingTo({ categoryId: cat.id, subtypeId: null })} className={`${cat.light} rounded-xl p-3 border ${cat.border} text-left`}>
                    <div className="flex items-center gap-2">
                      <div className={`${cat.bg} p-1.5 rounded-lg`}><Icon className="w-4 h-4 text-white" /></div>
                      <span className={`text-sm font-medium ${cat.text}`}>{cat.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Stats Modal
  const StatsModal = () => {
    if (!showStats) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowStats(false)}>
        <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-emerald-500 p-4 text-white rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Statistiche 2026</h2>
              <button onClick={() => setShowStats(false)}><X className="w-6 h-6" /></button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {categories.map(cat => {
              const Icon = cat.icon;
              const stats = yearStats[cat.id];
              if (stats.total === 0) return null;
              return (
                <div key={cat.id} className={`${cat.light} rounded-xl p-3 border ${cat.border}`}>
                  <div className="flex items-center gap-2">
                    <div className={`${cat.bg} p-2 rounded-lg`}><Icon className="w-5 h-5 text-white" /></div>
                    <div className="flex-1">
                      <p className={`font-medium ${cat.text}`}>{cat.name}</p>
                      <p className="text-xs text-gray-500">{stats.total} eventi • {stats.done} completati</p>
                    </div>
                    {stats.amount > 0 && <span className={`font-bold ${cat.text}`}>€{stats.amount}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Reset confirm modal
  const ResetConfirmModal = () => {
    if (!showResetConfirm) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowResetConfirm(false)}>
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
          <div className="text-center">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Eliminare tutti i dati?</h3>
            <p className="text-gray-500 text-sm mb-4">Questa azione non può essere annullata.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2 bg-gray-100 rounded-xl">Annulla</button>
              <button onClick={resetAllData} className="flex-1 py-2 bg-red-500 text-white rounded-xl">Elimina</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {currentPage === 'calendar' && <CalendarPage />}
      {currentPage === 'alimentazione' && renderAlimentazionePage()}
      <BottomNav />
      <DayModal />
      <StatsModal />
      <ResetConfirmModal />
      {renderMealPickerModal()}
      {draggedItem && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm z-40">
          Trascinando: {draggedItem.text}
        </div>
      )}
    </div>
  );
}

export default App;
