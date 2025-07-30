export interface GoogleMeetConfig {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface MeetingDetails {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  joinUrl: string;
  recordingUrl?: string;
  attendees: string[];
  description?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
    displayName?: string;
  }>;
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
}

export class GoogleMeetService {
  private config: GoogleMeetConfig;
  private accessToken: string | null = null;

  constructor(config: GoogleMeetConfig) {
    this.config = config;
  }

  // Initialize Google API client
  async initialize(): Promise<void> {
    try {
      // Load Google API client
      await this.loadGoogleAPI();
      
      // Initialize the client
      await new Promise<void>((resolve, reject) => {
        gapi.load('client:auth2', async () => {
          try {
            await gapi.client.init({
              apiKey: this.config.apiKey,
              clientId: this.config.clientId,
              scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Failed to initialize Google API:', error);
      throw error;
    }
  }

  // Load Google API script
  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  // Authenticate user
  async authenticate(): Promise<void> {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }
      this.accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  // Create a new meeting
  async createMeeting(meetingDetails: Omit<MeetingDetails, 'id' | 'joinUrl'>): Promise<MeetingDetails> {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const event: CalendarEvent = {
        id: `meeting_${Date.now()}`,
        summary: meetingDetails.title,
        description: meetingDetails.description || 'Maya LMS Class Meeting',
        start: {
          dateTime: meetingDetails.startTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: meetingDetails.endTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        attendees: meetingDetails.attendees.map(email => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: `meeting_${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        }
      };

      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      });

      const createdEvent = response.result;
      
      return {
        id: createdEvent.id!,
        title: createdEvent.summary!,
        startTime: createdEvent.start!.dateTime!,
        endTime: createdEvent.end!.dateTime!,
        duration: meetingDetails.duration,
        joinUrl: createdEvent.hangoutLink!,
        attendees: createdEvent.attendees?.map((a: any) => a.email!) || [],
        description: createdEvent.description
      };
    } catch (error) {
      console.error('Failed to create meeting:', error);
      throw error;
    }
  }

  // Get meeting details
  async getMeeting(meetingId: string): Promise<MeetingDetails> {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const response = await gapi.client.calendar.events.get({
        calendarId: 'primary',
        eventId: meetingId
      });

      const event = response.result;
      
      return {
        id: event.id!,
        title: event.summary!,
        startTime: event.start!.dateTime!,
        endTime: event.end!.dateTime!,
        duration: this.calculateDuration(event.start!.dateTime!, event.end!.dateTime!),
        joinUrl: event.hangoutLink!,
        attendees: event.attendees?.map(a => a.email!) || [],
        description: event.description
      };
    } catch (error) {
      console.error('Failed to get meeting:', error);
      throw error;
    }
  }

  // Update meeting
  async updateMeeting(meetingId: string, updates: Partial<MeetingDetails>): Promise<MeetingDetails> {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const event: Partial<CalendarEvent> = {};
      
      if (updates.title) event.summary = updates.title;
      if (updates.description) event.description = updates.description;
      if (updates.startTime) event.start = { dateTime: updates.startTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      if (updates.endTime) event.end = { dateTime: updates.endTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      if (updates.attendees) event.attendees = updates.attendees.map(email => ({ email }));

      const response = await gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: meetingId,
        resource: event
      });

      const updatedEvent = response.result;
      
      return {
        id: updatedEvent.id!,
        title: updatedEvent.summary!,
        startTime: updatedEvent.start!.dateTime!,
        endTime: updatedEvent.end!.dateTime!,
        duration: this.calculateDuration(updatedEvent.start!.dateTime!, updatedEvent.end!.dateTime!),
        joinUrl: updatedEvent.hangoutLink!,
        attendees: updatedEvent.attendees?.map((a: any) => a.email!) || [],
        description: updatedEvent.description
      };
    } catch (error) {
      console.error('Failed to update meeting:', error);
      throw error;
    }
  }

  // Delete meeting
  async deleteMeeting(meetingId: string): Promise<void> {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      await gapi.client.calendar.events.deleteEvent({
        calendarId: 'primary',
        eventId: meetingId
      });
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      throw error;
    }
  }

  // List upcoming meetings
  async listUpcomingMeetings(maxResults: number = 10): Promise<MeetingDetails[]> {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const now = new Date().toISOString();
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: now,
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items?.map((event: any) => ({
        id: event.id!,
        title: event.summary!,
        startTime: event.start!.dateTime!,
        endTime: event.end!.dateTime!,
        duration: this.calculateDuration(event.start!.dateTime!, event.end!.dateTime!),
        joinUrl: event.hangoutLink!,
        attendees: event.attendees?.map((a: any) => a.email!) || [],
        description: event.description
      })) || [];
    } catch (error) {
      console.error('Failed to list meetings:', error);
      throw error;
    }
  }

  // Generate meeting link (fallback method)
  generateMeetingLink(title: string, startTime: string): string {
    const encodedTitle = encodeURIComponent(title);
    const encodedTime = encodeURIComponent(startTime);
    return `https://meet.google.com/new?title=${encodedTitle}&time=${encodedTime}`;
  }

  // Calculate duration between two times
  private calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Duration in minutes
  }

  // Get recording URL (if available)
  async getRecordingUrl(meetingId: string): Promise<string | null> {
    try {
      // This would require additional Google Drive API integration
      // For now, return null as recordings are typically stored in Google Drive
      console.log('Recording URL retrieval not implemented yet');
      return null;
    } catch (error) {
      console.error('Failed to get recording URL:', error);
      return null;
    }
  }
}

// Mock implementation for development
export class MockGoogleMeetService {
  async createMeeting(meetingDetails: Omit<MeetingDetails, 'id' | 'joinUrl'>): Promise<MeetingDetails> {
    const mockMeeting: MeetingDetails = {
      id: `mock_meeting_${Date.now()}`,
      title: meetingDetails.title,
      startTime: meetingDetails.startTime,
      endTime: meetingDetails.endTime,
      duration: meetingDetails.duration,
      joinUrl: `https://meet.google.com/mock-${Date.now()}`,
      attendees: meetingDetails.attendees,
      description: meetingDetails.description
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return mockMeeting;
  }

  async getMeeting(meetingId: string): Promise<MeetingDetails> {
    const mockMeeting: MeetingDetails = {
      id: meetingId,
      title: 'Mock Class Meeting',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
      duration: 60,
      joinUrl: `https://meet.google.com/mock-${meetingId}`,
      attendees: ['student@example.com', 'teacher@example.com'],
      description: 'Mock class meeting for testing'
    };

    return mockMeeting;
  }

  async listUpcomingMeetings(): Promise<MeetingDetails[]> {
    return [
      {
        id: 'mock_1',
        title: 'N5 Grammar Class',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        joinUrl: 'https://meet.google.com/mock-n5-grammar',
        attendees: ['student1@example.com', 'teacher@example.com']
      },
      {
        id: 'mock_2',
        title: 'N4 Vocabulary Class',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        duration: 60,
        joinUrl: 'https://meet.google.com/mock-n4-vocab',
        attendees: ['student2@example.com', 'teacher@example.com']
      }
    ];
  }
}

// Export singleton instance
let googleMeetInstance: GoogleMeetService | MockGoogleMeetService | null = null;

export const getGoogleMeetService = (config?: GoogleMeetConfig): GoogleMeetService | MockGoogleMeetService => {
  if (!googleMeetInstance) {
    if (config && process.env.NODE_ENV === 'production') {
      googleMeetInstance = new GoogleMeetService(config);
    } else {
      googleMeetInstance = new MockGoogleMeetService();
    }
  }
  return googleMeetInstance;
}; 