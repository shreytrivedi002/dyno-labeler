"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Card, CardActions, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { redirect: false, email: form.email, password: form.password });
    if (res?.error) {
      setError(res.error);
    } else {
      window.location.href = "/dashboard";
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>Login</CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
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
              <Button disabled={loading} type="submit">{loading ? "Logging in..." : "Login"}</Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
