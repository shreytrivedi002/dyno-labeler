"use client";

import { useState } from "react";
import { Card, CardActions, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", contact: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const payload = (await res.json()) as { error?: string };
        throw new Error(payload.error || "Failed");
      }
      window.location.href = "/login";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>Register your shop</CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>Shop name</Label>
              <Input full placeholder="Shop name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Contact</Label>
              <Input full placeholder="Contact" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input full placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Password</Label>
              <Input full placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <CardActions>
              <Button disabled={loading} type="submit">{loading ? "Creating..." : "Create account"}</Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
