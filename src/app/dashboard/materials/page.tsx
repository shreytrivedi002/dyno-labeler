"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

type Material = { _id: string; name: string; unit: string; pricePerUnit: number };

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [form, setForm] = useState({ name: "", unit: "g", pricePerUnit: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<{ name: string; unit: string; pricePerUnit: number }>({ name: "", unit: "g", pricePerUnit: 0 });
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/materials");
    if (res.ok) setMaterials(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function addMaterial(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, pricePerUnit: Number(form.pricePerUnit) }),
    });
    if (res.ok) {
      setForm({ name: "", unit: "g", pricePerUnit: 0 });
      await load();
      setMessage("Material added");
    }
  }

  async function remove(id: string) {
    setMessage(null);
    const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
      setMessage("Material deleted");
    }
  }

  function startEdit(m: Material) {
    setEditingId(m._id);
    setEdit({ name: m.name, unit: m.unit, pricePerUnit: m.pricePerUnit });
  }

  function cancelEdit() {
    setEditingId(null);
    setEdit({ name: "", unit: "g", pricePerUnit: 0 });
  }

  async function saveEdit(id: string) {
    setMessage(null);
    const res = await fetch(`/api/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: edit.name, unit: edit.unit, pricePerUnit: Number(edit.pricePerUnit) }),
    });
    if (res.ok) {
      await load();
      cancelEdit();
      setMessage("Material updated");
    } else {
      const payload = await res.json().catch(() => ({}));
      setMessage(payload?.error || "Update failed");
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>Add material</CardHeader>
        <CardContent>
          <form onSubmit={addMaterial} className="grid sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <Label>Name</Label>
              <Input full placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Unit</Label>
              <Input full placeholder="Unit" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div>
              <Label>Price/Unit</Label>
              <Input full type="number" placeholder="Price/Unit" value={form.pricePerUnit} onChange={e => setForm({ ...form, pricePerUnit: Number(e.target.value) })} />
            </div>
            <div className="sm:col-span-4">
              <Button type="submit">Add</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {message && <p className="text-sm text-black/70">{message}</p>}

      <Card>
        <CardHeader>Price chart</CardHeader>
        <CardContent>
          <div className="divide-y divide-black/10">
            {materials.map(m => (
              <div key={m._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                {editingId === m._id ? (
                  <div className="flex flex-wrap gap-2 items-center">
                    <Input value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} />
                    <Input className="w-24" value={edit.unit} onChange={e => setEdit({ ...edit, unit: e.target.value })} />
                    <Input className="w-32" type="number" value={edit.pricePerUnit} onChange={e => setEdit({ ...edit, pricePerUnit: Number(e.target.value) })} />
                  </div>
                ) : (
                  <div className="font-medium">{m.name} <span className="text-black/50">({m.unit})</span> - {m.pricePerUnit}</div>
                )}
                <div className="flex gap-2">
                  {editingId === m._id ? (
                    <>
                      <Button variant="secondary" onClick={() => saveEdit(m._id)}>Save</Button>
                      <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" onClick={() => startEdit(m)}>Edit</Button>
                      <Button variant="ghost" onClick={() => remove(m._id)}>Delete</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
