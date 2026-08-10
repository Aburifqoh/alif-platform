import Link from "next/link";
import { MessageSquare, Mail, MessageCircle, BarChart3, Plus, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function NotificationsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Notification Center</h1>
        <Link 
          href="/notifications/new"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Broadcast
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Messages This Month</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-green-500" /> WhatsApp</div>
              <span className="font-semibold text-gray-900">3,820</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-blue-500" /> SMS</div>
              <span className="font-semibold text-gray-900">720</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-purple-500" /> Email</div>
              <span className="font-semibold text-gray-900">4,112</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm md:col-span-3">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Delivery Rates</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">96.2%</span>
              <span className="text-sm text-gray-500">WhatsApp Success</span>
            </div>
            <div className="flex flex-col border-l pl-4">
              <span className="text-2xl font-bold text-gray-900">98.1%</span>
              <span className="text-sm text-gray-500">SMS Success</span>
            </div>
            <div className="flex flex-col border-l pl-4">
              <span className="text-2xl font-bold text-gray-900">99.3%</span>
              <span className="text-sm text-gray-500">Email Success</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent Campaigns</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Campaign / Trigger</th>
                <th className="px-6 py-3">Audience</th>
                <th className="px-6 py-3">Channels</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock Data */}
              <tr className="border-b">
                <td className="px-6 py-4 font-medium text-gray-900">Hostel Payment Reminder</td>
                <td className="px-6 py-4">Hostel Residents</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">WhatsApp</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">Email</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Completed</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">221/238 Delivered</div>
                </td>
                <td className="px-6 py-4">Today, 09:00 AM</td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-4 font-medium text-gray-900">Ramadan Programme Announce</td>
                <td className="px-6 py-4">All Members</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">WhatsApp</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">SMS</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">Email</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-amber-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">450/1200 Sent</div>
                </td>
                <td className="px-6 py-4">Today, 08:30 AM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
