import { useCallback, useState } from 'react';
import { useInterventionStore } from '@/store/interventions.store';
import { getApiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

export const useInterventions = () => {
  const {
    interventions,
    setInterventions,
    setCurrentIntervention,
    setLoading,
    setError,
    addIntervention,
    updateIntervention,
  } = useInterventionStore();

  const api = getApiClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInterventions = useCallback(
    async (filters?: any) => {
      try {
        setLoading(true);
        const response = await api.get('/interventions', { params: filters });
        setInterventions(response.data.data);
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Erreur lors du chargement';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [api, setInterventions, setLoading, setError],
  );

  const fetchIntervention = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const response = await api.get(`/interventions/${id}`);
        setCurrentIntervention(response.data);
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Erreur lors du chargement';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [api, setCurrentIntervention, setLoading, setError],
  );

  const createIntervention = useCallback(
    async (data: any) => {
      try {
        setIsSubmitting(true);
        const response = await api.post('/interventions', data);
        addIntervention(response.data);
        toast.success('Intervention créée avec succès');
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Erreur lors de la création';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [api, addIntervention, setError],
  );

  const updateInterventionData = useCallback(
    async (id: string, data: any) => {
      try {
        setIsSubmitting(true);
        const response = await api.put(`/interventions/${id}`, data);
        updateIntervention(response.data);
        toast.success('Intervention mise à jour');
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [api, updateIntervention, setError],
  );

  return {
    interventions,
    fetchInterventions,
    fetchIntervention,
    createIntervention,
    updateInterventionData,
    isSubmitting,
  };
};
