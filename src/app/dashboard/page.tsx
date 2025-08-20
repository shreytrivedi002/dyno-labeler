import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="text-black/80">Materials</CardHeader>
        <CardContent>
          <p className="text-sm text-black/70 mb-3">Manage your price chart (gold, diamond, etc.).</p>
          <Link className="ui-link" href="/dashboard/materials">Go to materials →</Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="text-black/80">Products</CardHeader>
        <CardContent>
          <p className="text-sm text-black/70 mb-3">Create products and generate QR codes.</p>
          <Link className="ui-link" href="/dashboard/products">Go to products →</Link>
        </CardContent>
      </Card>
    </div>
  );
}
