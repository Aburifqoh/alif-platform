import { redirect } from 'next/navigation';

export default function AdminPage() {
  // TODO: Add auth check and redirect to dashboard or login
  redirect('/login');
}
