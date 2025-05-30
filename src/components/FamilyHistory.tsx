
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, MapPin, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FamilyEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  eventType: 'birth' | 'marriage' | 'death' | 'migration' | 'achievement' | 'other';
  participants: string[];
  documents?: string[];
}

interface FamilyHistoryProps {
  personId: string;
  familyEvents: FamilyEvent[];
}

export function FamilyHistory({ personId, familyEvents }: FamilyHistoryProps) {
  const [events, setEvents] = useState<FamilyEvent[]>(familyEvents);
  const [newEvent, setNewEvent] = useState<Partial<FamilyEvent>>({
    eventType: 'other',
    participants: []
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const eventTypeColors = {
    birth: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    marriage: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    death: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    migration: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    achievement: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    other: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and date",
        variant: "destructive"
      });
      return;
    }

    const event: FamilyEvent = {
      id: Date.now().toString(),
      title: newEvent.title || '',
      description: newEvent.description || '',
      date: newEvent.date || '',
      location: newEvent.location,
      eventType: newEvent.eventType || 'other',
      participants: newEvent.participants || [],
      documents: newEvent.documents
    };

    setEvents(prev => [...prev, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewEvent({ eventType: 'other', participants: [] });
    setShowAddForm(false);

    toast({
      title: "Family event added",
      description: "The family history has been updated"
    });
  };

  const EventCard = ({ event }: { event: FamilyEvent }) => (
    <div className="relative pl-8 pb-8 border-l-2 border-muted-foreground/20 last:border-l-0 last:pb-0">
      <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
      <Card className="smart-glass-card">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
                {event.location && (
                  <>
                    <MapPin className="h-3 w-3 ml-2" />
                    <span>{event.location}</span>
                  </>
                )}
              </div>
            </div>
            <Badge className={eventTypeColors[event.eventType]}>
              {event.eventType}
            </Badge>
          </div>
          
          {event.description && (
            <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
          )}
          
          {event.participants.length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {event.participants.join(', ')}
              </span>
            </div>
          )}
          
          {event.documents && event.documents.length > 0 && (
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {event.documents.length} document(s) attached
              </span>
            </div>
          )}
          
          <div className="flex gap-2 mt-3">
            <Button variant="ghost" size="sm">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Family History</h3>
          <p className="text-muted-foreground">Important events and milestones</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="smart-button-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <Card className="smart-glass-card">
          <CardHeader>
            <CardTitle>Add Family Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title *</Label>
                <Input
                  id="event-title"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Birth of John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-date">Date *</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <select
                  id="event-type"
                  value={newEvent.eventType || 'other'}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, eventType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="birth">Birth</option>
                  <option value="marriage">Marriage</option>
                  <option value="death">Death</option>
                  <option value="migration">Migration</option>
                  <option value="achievement">Achievement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={newEvent.location || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Yangon, Myanmar"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide details about this event..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddEvent} className="smart-button-primary">
                Add Event
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card className="smart-glass-card">
        <CardHeader>
          <CardTitle>Family Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-0">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No family events recorded</p>
              <p className="text-muted-foreground">Start building your family history by adding important events</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
