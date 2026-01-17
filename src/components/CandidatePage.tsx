import { ArrowLeft, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { mockTimeline } from '../mock/mockTimeline';
import { EventRenderer } from './EventRenderer';

export default function CandidatePage({ application, onBack }: any) {
  const candidate = application.candidate;

  const events = mockTimeline[application.id];
  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  return (
    <div className="flex h-screen bg-gray-50">

      {/* LEFT – TIMELINE */}
      <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to candidates
        </button>

        <h3 className="font-semibold mb-4">Timeline</h3>

        {events.map((event: any) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}   // ✅ CLICK HERE
            className={`p-3 mb-3 rounded-lg border cursor-pointer ${
              selectedEvent.id === event.id
                ? 'bg-blue-50 border-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            <p className="font-medium text-sm">{event.title}</p>
            <p className="text-xs text-gray-500">{event.summary}</p>
            <p className="text-xs text-gray-400 mt-1">{event.date}</p>
          </div>
        ))}
      </div>

      {/* RIGHT – DETAILS */}
      <div className="w-2/3 p-6 overflow-y-auto">

        {/* PROFILE HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{candidate.full_name}</h2>

          <div className="flex gap-6 mt-2 text-sm text-gray-600">
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {candidate.email}
            </span>
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {candidate.phone}
            </span>
            <span className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              {candidate.years_of_experience} yrs
            </span>
            <span className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-1" />
              {candidate.education}
            </span>
          </div>
        </div>

        {/* EVENT DETAILS */}
        <EventRenderer event={selectedEvent} />
      </div>
    </div>
  );
}
