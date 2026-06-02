import { db, collection, doc } from '../lib/firebase';
import { addDoc, query, where, getDocs, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Testimonial } from '../types';

export const TestimonialService = {
    // Submit a new testimonial
    submitTestimonial: async (userId: string, userName: string, userRole: string, text: string, rating: number) => {
        try {
            const testimonialsRef = collection(db, 'testimonials');
            const docRef = await addDoc(testimonialsRef, {
                user_id: userId,
                user_name: userName,
                user_role: userRole,
                text: text,
                rating: rating,
                status: 'pending', // Default status
                created_at: serverTimestamp()
            });

            return {
                id: docRef.id,
                user_id: userId,
                user_name: userName,
                user_role: userRole,
                text: text,
                rating: rating,
                status: 'pending',
                created_at: new Date().toISOString()
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to submit testimonial");
        }
    },

    // Get all approved testimonials (for Landing Page)
    getApprovedTestimonials: async (): Promise<Testimonial[]> => {
        try {
            const testimonialsRef = collection(db, 'testimonials');
            const q = query(
                testimonialsRef,
                where('status', '==', 'approved'),
                orderBy('created_at', 'desc')
            );
            const querySnapshot = await getDocs(q);

            // Map Firestore docs to Interface
            return querySnapshot.docs.map((doc: any) => ({
                id: doc.id,
                userId: doc.data().user_id,
                userName: doc.data().user_name,
                userRole: doc.data().user_role,
                text: doc.data().text,
                rating: doc.data().rating,
                status: doc.data().status,
                createdAt: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString()
            }));
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch approved testimonials");
        }
    },

    // Get all pending testimonials (for Admin Dashboard)
    getPendingTestimonials: async (): Promise<Testimonial[]> => {
        try {
            const testimonialsRef = collection(db, 'testimonials');
            const q = query(
                testimonialsRef,
                where('status', '==', 'pending'),
                orderBy('created_at', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc: any) => ({
                id: doc.id,
                userId: doc.data().user_id,
                userName: doc.data().user_name,
                userRole: doc.data().user_role,
                text: doc.data().text,
                rating: doc.data().rating,
                status: doc.data().status,
                createdAt: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString()
            }));
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch pending testimonials");
        }
    },

    // Get ALL testimonials (for Admin Dashboard Management)
    getAllTestimonials: async (): Promise<Testimonial[]> => {
        try {
            const testimonialsRef = collection(db, 'testimonials');
            const q = query(testimonialsRef, orderBy('created_at', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc: any) => ({
                id: doc.id,
                userId: doc.data().user_id,
                userName: doc.data().user_name,
                userRole: doc.data().user_role,
                text: doc.data().text,
                rating: doc.data().rating,
                status: doc.data().status,
                createdAt: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString()
            }));
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch testimonials");
        }
    },

    // Update testimonial status (Admin)
    updateStatus: async (id: string, status: 'approved' | 'rejected' | 'pending') => {
        try {
            const testimonialDocRef = doc(db, 'testimonials', id);
            await updateDoc(testimonialDocRef, {
                status: status
            });
        } catch (error: any) {
            throw new Error(error.message || "Failed to update testimonial status");
        }
    }
};
