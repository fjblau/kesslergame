import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EventsState, GameEvent, EventType } from '../../game/types';
import type { RootState } from '../index';
import { 
  initializeGame, 
  launchDRV
} from './gameSlice';
import { notifyMissionComplete } from './missionsSlice';

const generateId = () => Math.random().toString(36).substring(2, 11);

const initialState: EventsState = {
  events: [],
};

const addEventToState = (
  state: EventsState,
  type: EventType,
  turn: number,
  day: number,
  message: string,
  details?: Record<string, unknown>
) => {
  const event: GameEvent = {
    id: generateId(),
    type,
    turn,
    day,
    timestamp: Date.now() % 86400000,
    message,
    details,
  };
  state.events.unshift(event);
};

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<{
      type: EventType;
      turn: number;
      day: number;
      message: string;
      details?: Record<string, unknown>;
    }>) => {
      addEventToState(
        state,
        action.payload.type,
        action.payload.turn,
        action.payload.day,
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
      .addCase(launchDRV, (state, action) => {
        const { drvType, orbit, turn, day, metadata } = action.payload;
        const drvName = metadata?.name || `${drvType} DRV`;
        const countryOrOperator = metadata?.country || metadata?.operator;
        const message = countryOrOperator 
          ? `Deployed ${drvName} (${countryOrOperator}) to ${orbit} orbit`
          : `Deployed ${drvName} to ${orbit} orbit`;
        
        const details: Record<string, unknown> = {
          orbit,
          drvType,
        };
        
        if (metadata) {
          details.name = metadata.name;
          details.organization = metadata.organization;
          details.capture_system = metadata.capture_system;
          details.icon_suggestion = metadata.icon_suggestion;
          if (metadata.operator) details.operator = metadata.operator;
          if (metadata.country) details.country = metadata.country;
        }
        
        addEventToState(
          state,
          'drv-launch',
          turn,
          day ?? 0,
          message,
          details
        );
      })
      .addCase(notifyMissionComplete, (state, action) => {
        addEventToState(
          state,
          'mission-complete',
          action.payload.turn,
          action.payload.day ?? 0,
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
