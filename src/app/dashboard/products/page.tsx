"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

type Material = { _id: string; name: string; unit: string; pricePerUnit: number };

type Product = {
  _id: string;
  name: string;
  materials: { materialId: string; quantity: number }[];
  makingCharges: number;
  taxPercentage: number;
  qrCodeUrl?: string;
  publicId?: string;
};

export default function ProductsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({
    _id: "",
    name: "",
    materials: [],
    makingCharges: 0,
    taxPercentage: 3,
  });

  useEffect(() => {
    (async () => {
      const [mRes, pRes] = await Promise.all([fetch("/api/materials"), fetch("/api/products")]);
      if (mRes.ok) setMaterials(await mRes.json());
      if (pRes.ok) setProducts(await pRes.json());
    })();
  }, []);

  const materialCost = useMemo(() => {
    const map = new Map(materials.map(m => [m._id, m]));
    return form.materials.reduce((sum, item) => {
      const m = map.get(item.materialId);
      if (!m) return sum;
      return sum + item.quantity * m.pricePerUnit;
    }, 0);
  }, [form.materials, materials]);

  const subtotal = materialCost + form.makingCharges;
  const taxAmount = subtotal * (form.taxPercentage / 100);
  const finalPrice = subtotal + taxAmount;

  function addItem() {
    setForm(f => ({ ...f, materials: [...f.materials, { materialId: materials[0]?._id || "", quantity: 1 }] }));
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        materials: form.materials,
        makingCharges: form.makingCharges,
        taxPercentage: form.taxPercentage,
      }),
    });
    if (res.ok) {
      setForm({ _id: "", name: "", materials: [], makingCharges: 0, taxPercentage: 3 });
      const list = await fetch("/api/products");
      if (list.ok) setProducts(await list.json());
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>Create product</CardHeader>
        <CardContent>
          <form onSubmit={createProduct} className="space-y-4">
            <div>
              <Label>Product name</Label>
              <Input full placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Materials</Label>
                <Button type="button" variant="secondary" onClick={addItem}>Add material</Button>
              </div>
              {form.materials.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <select className="border border-black/10 rounded-md px-3 py-2" value={item.materialId} onChange={e => setForm(f => ({ ...f, materials: f.materials.map((it, i) => i === idx ? { ...it, materialId: e.target.value } : it) }))}>
                    {materials.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                  <Input className="w-28" type="number" value={item.quantity} onChange={e => setForm(f => ({ ...f, materials: f.materials.map((it, i) => i === idx ? { ...it, quantity: Number(e.target.value) } : it) }))} />
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-4 gap-2 text-sm">
              <div>Material cost: <span className="font-medium">{materialCost.toFixed(2)}</span></div>
              <div>Subtotal: <span className="font-medium">{subtotal.toFixed(2)}</span></div>
              <div>Tax ({form.taxPercentage}%): <span className="font-medium">{taxAmount.toFixed(2)}</span></div>
              <div className="font-semibold">Final: {finalPrice.toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              <Input className="w-40" type="number" placeholder="Making charges" value={form.makingCharges} onChange={e => setForm({ ...form, makingCharges: Number(e.target.value) })} />
              <Input className="w-32" type="number" placeholder="Tax %" value={form.taxPercentage} onChange={e => setForm({ ...form, taxPercentage: Number(e.target.value) })} />
            </div>
            <Button type="submit">Create product</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Products</CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p._id} className="rounded-lg border border-black/10 bg-white p-4">
                <div className="font-medium">{p.name}</div>
                {p.qrCodeUrl && <img src={p.qrCodeUrl} alt="QR" className="w-24 h-24 mt-2" />}
                {p.publicId && (
                  <a className="underline text-sm" href={`/product/${p.publicId}`} target="_blank">Open public page</a>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
