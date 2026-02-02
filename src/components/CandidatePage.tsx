import { ArrowLeft, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { mockTimeline } from '../mock/mockTimeline';
import { EventRenderer } from './EventRenderer';
import { CheckCircle, Clock } from 'lucide-react';

const getStatusIcon = (event: any) => {
  if (event.status === 'completed')
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="w-5 h-5 text-green-600" />
      </div>
    );

  if (event.status === 'pending')
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100">
        <Clock className="w-5 h-5 text-orange-500" />
      </div>
    );

  if (event.type === 'email')
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100">
        <Mail className="w-5 h-5 text-blue-500" />
      </div>
    );

  if (event.type === 'bot_call')
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-100">
        <Phone className="w-5 h-5 text-purple-500" />
      </div>
    );

  return null;
};

export default function CandidatePage({ application, onBack }: any) {
  const candidate = application.candidate;

  const events = mockTimeline[application.id];
  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  return (
    <div className="ml-64 min-h-screen flex-1 bg-gray-50">
      <div className='flex gap-2'>
        {/* LEFT – TIMELINE */}
        <div className="w-1/4 bg-white min-h-screen border-r p-4 overflow-y-auto">
          <button
            onClick={onBack}
            className="flex items-center text-sm text-gray-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to candidates
          </button>

          <h3 className="text-lg font-semibold text-slate-900 mb-6">Timeline</h3>

          {events.map((event: any) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}   // ✅ CLICK HERE
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 relative ${
                selectedEvent.id === event.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'hover:bg-gray-50 border-2 border-transparent'
              }`}
            >
              {/* <p className="font-medium text-sm">{event.title}</p> */}
              <div className="flex items-start gap-3">
                {getStatusIcon(event)}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">{event.title}</p>
                  <p className="text-xs text-slate-500 mb-1">{event.stage}</p>
                  {event.date && (
                    <p className="text-xs text-slate-400">{event.date}</p>
                  )}
                </div>
              </div>

              {/* <p className="text-xs text-gray-500">{event.summary}</p>
              <p className="text-xs text-gray-400 mt-1">{event.date}</p> */}
            </div>
          ))}
        </div>

        {/* RIGHT – DETAILS */}
        <div className="w-2/3 p-6 overflow-y-auto">

          {/* PROFILE HEADER */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 backdrop-blur-sm mb-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{candidate.full_name}</h2>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 mr-1" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 mr-1" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Briefcase className="w-4 h-4 mr-1" />
                <span>{candidate.years_of_experience} yrs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span>{candidate.education}</span>
              </div>
            </div>
          </div>

          {/* EVENT DETAILS */}
          <EventRenderer event={selectedEvent} />
        </div>
      </div>
    </div>
  );
}
