import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EventsState, GameEvent, EventType } from '../../game/types';
import type { RootState } from '../index';
import { 
  initializeGame, 
  launchSatellite, 
  launchDRV
} from './gameSlice';
import { notifyMissionComplete } from './missionsSlice';

const generateId = () => Math.random().toString(36).substring(2, 11);

const MAX_EVENTS = 200;

const initialState: EventsState = {
  events: [],
};

const addEventToState = (
  state: EventsState,
  type: EventType,
  turn: number,
  message: string,
  details?: Record<string, unknown>
) => {
  const event: GameEvent = {
    id: generateId(),
    type,
    turn,
    message,
    details,
  };
  state.events.unshift(event);
  
  if (state.events.length > MAX_EVENTS) {
    state.events = state.events.slice(0, MAX_EVENTS);
  }
};

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<{
      type: EventType;
      turn: number;
      message: string;
      details?: Record<string, unknown>;
    }>) => {
      addEventToState(
        state,
        action.payload.type,
        action.payload.turn,
        action.payload.message,
        action.payload.details
      );
    },
    
    clearEvents: (state) => {
      state.events = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeGame, (state) => {
        state.events = [];
      })
      .addCase(launchSatellite, (state, action) => {
        addEventToState(
          state,
          'satellite-launch',
          action.payload.turn,
          `Launched ${action.payload.purpose} satellite in ${action.payload.orbit} orbit`,
          { orbit: action.payload.orbit, purpose: action.payload.purpose, insuranceTier: action.payload.insuranceTier }
        );
      })
      .addCase(launchDRV, (state, action) => {
        addEventToState(
          state,
          'drv-launch',
          action.payload.turn,
          `Deployed ${action.payload.drvType} DRV to ${action.payload.orbit} orbit`,
          { orbit: action.payload.orbit, drvType: action.payload.drvType, targetPriority: action.payload.targetPriority }
        );
      })
      .addCase(notifyMissionComplete, (state, action) => {
        addEventToState(
          state,
          'mission-complete',
          action.payload.turn,
          `Mission completed: ${action.payload.title}`,
          { title: action.payload.title }
        );
      });
  },
});

export const { addEvent, clearEvents } = eventSlice.actions;

export const selectAllEvents = (state: RootState) => state.events.events;

export const selectRecentEvents = (state: RootState, count: number) => 
  state.events.events.slice(0, count);

export default eventSlice.reducer;
