import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export const calculateEmissions = (userData) => {
  const factors = getFactors();
  const s1Diesel = (userData.diesel || 0) * factors.diesel;
  const s1Petrol = (userData.petrol || 0) * factors.petrol;
  const scope1 = s1Diesel + s1Petrol;

  const scope2 = (userData.electricity || 0) * factors.electricity;
  const scope3 =
    (userData.flights || 0) * factors.flights +
    (userData.waste || 0) * factors.waste;

  const empCount = Math.max(1, parseInt(userData.employees) || 1);
  const totalMonthly = scope1 + scope2 + scope3;
  const annual = (totalMonthly * 12) / 1000;
  const perEmployee = (totalMonthly * 12) / empCount;
  const offsetCost = annual * 15;

  const s1Tons = (scope1 / 1000) / empCount;
  const s2Tons = (scope2 / 1000) / empCount;
  const s3Tons = (scope3 / 1000) / empCount;
  const tonsMonthlyIntensity = s1Tons + s2Tons + s3Tons;

  let riskLevel = "Low";
  if (tonsMonthlyIntensity > 15) {
    riskLevel = "High";
  } else if (tonsMonthlyIntensity >= 5) {
    riskLevel = "Medium";
  }

  return {
    scope1: s1Tons,
    scope2: s2Tons,
    scope3: s3Tons,
    total: tonsMonthlyIntensity,
    annual,
    perEmployee,
    offsetCost,
    riskLevel,
  };
};

export const saveRecord = async (userEmail, userData, results) => {
  if (!userEmail) return null;
  const record = {
    userEmail,
    date: new Date().toISOString().split("T")[0],
    id: Math.random().toString(36).substring(2, 9),
    entity: userData.companyName || "Unknown Org",
    s1: results.scope1,
    s2: results.scope2,
    s3: results.scope3,
    total: results.total,
    risk: results.riskLevel,
    fullData: { ...userData, results }, // Store results inside fullData for the report generator
  };

  // 1. Local Storage Sync (Immediate feedback)
  let history = JSON.parse(localStorage.getItem(`carbon_history_${userEmail}`) || "[]");
  history.unshift(record);
  localStorage.setItem(`carbon_history_${userEmail}`, JSON.stringify(history));

  // 2. Firestore Sync (Global persistence)
  try {
    const userDocRef = doc(db, 'user_data', userEmail);
    // Ensure document exists with history array
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, { history: [record] });
    } else {
      await updateDoc(userDocRef, {
        history: arrayUnion(record)
      });
    }
  } catch (e) {
    console.error("Firestore sync failed:", e);
  }

  return record;
};

export const getHistory = async (userEmail) => {
    if (!userEmail) return [];
    
    // Attempt Firestore fetch for source of truth
    try {
        const docSnap = await getDoc(doc(db, 'user_data', userEmail));
        if (docSnap.exists()) {
            const firestoreHistory = docSnap.data().history || [];
            // Sort by date descending (assuming record has date or we just trust the array order)
            // But Firestore arrayUnion appends to end, so we might need to reverse or sort
            const sorted = [...firestoreHistory].reverse(); 
            // Sync back to local storage
            localStorage.setItem(`carbon_history_${userEmail}`, JSON.stringify(sorted));
            return sorted;
        }
    } catch (e) {
        console.warn("Firestore fetch failed, falling back to local storage:", e);
    }

    return JSON.parse(localStorage.getItem(`carbon_history_${userEmail}`) || "[]");
};

export const deleteHistory = async (userEmail, id) => {
    if (!userEmail) return [];
    
    // 1. Local Update
    let history = JSON.parse(localStorage.getItem(`carbon_history_${userEmail}`) || "[]");
    history = history.filter(h => h.id !== id);
    localStorage.setItem(`carbon_history_${userEmail}`, JSON.stringify(history));

    // 2. Firestore update
    try {
        const docSnap = await getDoc(doc(db, 'user_data', userEmail));
        if (docSnap.exists()) {
            const firestoreHistory = docSnap.data().history || [];
            const filtered = firestoreHistory.filter(h => h.id !== id);
            await updateDoc(doc(db, 'user_data', userEmail), { history: filtered });
        }
    } catch (e) {
        console.error("Firestore deletion failed:", e);
    }

    return history;
};

const DEFAULT_FACTORS = {
  electricity: 0.82,
  diesel: 2.68,
  petrol: 2.31,
  flights: 0.15,
  waste: 0.5,
};

export const getFactors = (userEmail) => {
    if (!userEmail) return DEFAULT_FACTORS;
    const custom = JSON.parse(localStorage.getItem(`carbon_factors_${userEmail}`) || "{}");
    return { ...DEFAULT_FACTORS, ...custom };
};

export const saveFactors = (userEmail, factors) => {
    if (!userEmail) return;
    localStorage.setItem(`carbon_factors_${userEmail}`, JSON.stringify(factors));
};

export const getSettings = (userEmail) => {
    if (!userEmail) return {};
    return JSON.parse(localStorage.getItem(`carbon_settings_${userEmail}`) || "{}");
};

export const saveSettings = (userEmail, settings) => {
    if (!userEmail) return;
    localStorage.setItem(`carbon_settings_${userEmail}`, JSON.stringify(settings));
};
