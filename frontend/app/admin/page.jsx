import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Platform Admin Console | Nirvana Space",
  description:
    "Super Admin dashboard for listings moderation, RERA compliance auditing, lead dispatch, and partner developer verification.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
