import { create } from 'zustand';

export interface Intervention {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  reportedDate: Date;
  reportedBy: string;
  technician?: {
    id: string;
    fullName: string;
    email: string;
  };
  department?: {
    id: string;
    name: string;
  };
  resolutionDuration?: string;
}

export interface InterventionFilters {
  status?: string;
  category?: string;
  priority?: string;
  technicianId?: string;
  departmentId?: string;
  skip?: number;
  take?: number;
}

export interface InterventionState {
  interventions: Intervention[];
  currentIntervention: Intervention | null;
  filters: InterventionFilters;
  isLoading: boolean;
  error: string | null;
  setInterventions: (interventions: Intervention[]) => void;
  setCurrentIntervention: (intervention: Intervention | null) => void;
  setFilters: (filters: InterventionFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addIntervention: (intervention: Intervention) => void;
  updateIntervention: (intervention: Intervention) => void;
}

export const useInterventionStore = create<InterventionState>((set) => ({
  interventions: [],
  currentIntervention: null,
  filters: {},
  isLoading: false,
  error: null,

  setInterventions: (interventions) => set({ interventions }),
  setCurrentIntervention: (currentIntervention) => set({ currentIntervention }),
  setFilters: (filters) => set({ filters }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addIntervention: (intervention) =>
    set((state) => ({
      interventions: [intervention, ...state.interventions],
    })),

  updateIntervention: (intervention) =>
    set((state) => ({
      interventions: state.interventions.map((i) =>
        i.id === intervention.id ? intervention : i,
      ),
    })),
}));
