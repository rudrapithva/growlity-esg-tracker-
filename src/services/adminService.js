import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * AdminService handles platform-wide data oversight and global configuration.
 */
export const verifyAdminCredentials = async (email, password) => {
    try {
        // Fetch admin gatekeeper credentials from the specific config document
        const docRef = doc(db, 'config', '9rPzdDvAUTm1SJ92puXs');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const adminData = docSnap.data();
            if (email === adminData.username && password === adminData.password) {
                return { success: true, profile: { name: 'System Admin', role: 'Platform ESG Admin', email } };
            }
        }
        return { success: false, message: 'Invalid admin credentials or security key.' };
    } catch (e) {
        console.error("Admin verification failed:", e);
        return { success: false, message: 'System configuration error. Access denied.' };
    }
};
export const getPlatformMetrics = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'user_data'));
        let totalCO2 = 0;
        let totalLogs = 0;
        const clients = [];

        snapshot.forEach(userDoc => {
            const data = userDoc.data().history || [];
            let userTotal = 0;
            data.forEach(log => {
                userTotal += parseFloat(log.total) || 0;
            });

            totalCO2 += userTotal;
            totalLogs += data.length;
            clients.push({
                email: userDoc.id,
                logCount: data.length,
                totalCO2: userTotal,
                history: data
            });
        });

        return {
            totalUsers: clients.length,
            totalCO2,
            totalLogs,
            avgImpact: clients.length > 0 ? totalCO2 / clients.length : 0,
            clients
        };
    } catch (e) {
        console.error("Failed to fetch platform metrics:", e);
        throw e;
    }
};

export const getGlobalFactors = async () => {
    try {
        const docRef = doc(db, 'global_settings', 'constants');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().emission_factors;
        }
        
        // Default factors if cloud is empty
        return {
            electricity: 0.82,
            diesel: 2.68,
            petrol: 2.31,
            flights: 0.15,
            waste: 0.5
        };
    } catch (e) {
        console.error("Failed to fetch global factors:", e);
        return null;
    }
};

export const updateGlobalFactors = async (factors) => {
    try {
        await setDoc(doc(db, 'global_settings', 'constants'), {
            emission_factors: factors,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (e) {
        console.error("Failed to update global factors:", e);
        return false;
    }
};
