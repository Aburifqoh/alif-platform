"use client";

import { useState } from "react";
import { MessageCircle, Mail, MessageSquare, Send, Save, AlertCircle } from "lucide-react";

export default function NewBroadcastPage() {
  const [audience, setAudience] = useState("");
  const [template, setTemplate] = useState("");
  
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Broadcast Campaign</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Composer Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
              <input type="text" placeholder="e.g. Ramadan Programme Announcement" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              >
                <option value="">Select Audience...</option>
                <option value="all">All Registered Members</option>
                <option value="hostel">Hostel Residents</option>
                <option value="students">All Students</option>
                <option value="donors">Donors</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Channels</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                  <MessageCircle className="h-4 w-4 text-green-500" /> <span className="text-sm">WhatsApp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                  <MessageSquare className="h-4 w-4 text-blue-500" /> <span className="text-sm">SMS</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                  <Mail className="h-4 w-4 text-purple-500" /> <span className="text-sm">Email</span>
                </label>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Message Content</label>
                <select className="text-xs text-blue-600 border-none bg-transparent outline-none cursor-pointer" value={template} onChange={(e) => setTemplate(e.target.value)}>
                  <option value="">Load Template...</option>
                  <option value="event">Event Reminder</option>
                  <option value="ramadan">Ramadan Notice</option>
                </select>
              </div>
              <textarea 
                rows={6}
                placeholder="Type your message here... Use {{name}} for personalized greeting."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Variables available: {'{{name}}'}, {'{{membership_id}}'}</p>
            </div>

            <div className="pt-4 flex gap-3 border-t">
              <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                <Send className="h-4 w-4" /> Send Broadcast
              </button>
              <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Save className="h-4 w-4" /> Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-blue-50 p-4 border-blue-100">
            <div className="flex items-start gap-3 text-blue-800">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">WhatsApp Templates</p>
                <p>If you are sending to users outside the 24-hour window, you must use a Meta-approved template.</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-2">Audience Estimate</h3>
            {audience ? (
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total People:</span>
                  <span className="font-semibold text-gray-900">
                    {audience === 'all' ? '1,248' : audience === 'hostel' ? '250' : '400'}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>WhatsApp Opt-in:</span>
                    <span>92%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>SMS Opt-in:</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select an audience to see reach estimates.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
