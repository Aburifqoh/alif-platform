import { createClient } from "@alif/database/server";
import { User, Shield, Activity } from "lucide-react";

export default async function UsersAdminPage() {
  const supabase = await createClient();
  
  // We will fetch users and their roles here
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*, user_roles(roles(*))')
    .limit(10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users & Roles</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Invite Admin
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">1,248</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Admins & Staff</p>
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">24</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Recent Activity</p>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">156</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Admin Personnel</h2>
          <input 
            type="text" 
            placeholder="Search users..." 
            className="text-sm rounded border px-3 py-1"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Roles</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.full_name || 'Unnamed User'}</div>
                    <div className="text-xs text-gray-500">{user.membership_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    {user.user_roles?.map((ur: any) => (
                      <span key={ur.roles?.id} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                        {ur.roles?.label}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
