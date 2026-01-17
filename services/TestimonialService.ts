import { supabase } from '../lib/supabase';
import { Testimonial } from '../types';

export const TestimonialService = {
    // Submit a new testimonial
    submitTestimonial: async (userId: string, userName: string, userRole: string, text: string, rating: number) => {
        const { data, error } = await supabase
            .from('testimonials')
            .insert([{
                user_id: userId,
                user_name: userName,
                user_role: userRole,
                text: text,
                rating: rating,
                status: 'pending', // Default status
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all approved testimonials (for Landing Page)
    getApprovedTestimonials: async (): Promise<Testimonial[]> => {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map DB fields to Interface
        return (data || []).map((t: any) => ({
            id: t.id,
            userId: t.user_id,
            userName: t.user_name,
            userRole: t.user_role,
            text: t.text,
            rating: t.rating,
            status: t.status,
            createdAt: t.created_at
        }));
    },

    // Get all pending testimonials (for Admin Dashboard)
    getPendingTestimonials: async (): Promise<Testimonial[]> => {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((t: any) => ({
            id: t.id,
            userId: t.user_id,
            userName: t.user_name,
            userRole: t.user_role,
            text: t.text,
            rating: t.rating,
            status: t.status,
            createdAt: t.created_at
        }));
    },

    // Get ALL testimonials (for Admin Dashboard Management)
    getAllTestimonials: async (): Promise<Testimonial[]> => {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((t: any) => ({
            id: t.id,
            userId: t.user_id,
            userName: t.user_name,
            userRole: t.user_role,
            text: t.text,
            rating: t.rating,
            status: t.status,
            createdAt: t.created_at
        }));
    },

    // Update testimonial status (Admin)
    updateStatus: async (id: string, status: 'approved' | 'rejected' | 'pending') => {
        const { error } = await supabase
            .from('testimonials')
            .update({ status: status })
            .eq('id', id);

        if (error) throw error;
    }
};
