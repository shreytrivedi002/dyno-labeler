"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

type Material = { _id: string; name: string; unit: string; pricePerUnit: number };

type Product = {
  _id: string;
  publicId: string;
  name: string;
  materials: { materialId: string; quantity: number }[];
  makingCharges: number;
  taxPercentage: number;
  qrCodeUrl?: string;
  barcodeUrl?: string;
};

type ContentType = "qr" | "barcode" | "both";

export default function LabelsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Layout options
  const [content, setContent] = useState<ContentType>("qr");
  const [cols, setCols] = useState<number>(3);
  const [labelW, setLabelW] = useState<number>(60); // mm
  const [labelH, setLabelH] = useState<number>(40); // mm
  const [gap, setGap] = useState<number>(2); // mm

  useEffect(() => {
    (async () => {
      const [mRes, pRes] = await Promise.all([fetch("/api/materials"), fetch("/api/products")]);
      if (mRes.ok) setMaterials(await mRes.json());
      if (pRes.ok) setProducts(await pRes.json());
    })();
  }, []);

  useMemo(() => new Map(materials.map(m => [m._id, m])), [materials]);

  function toggleAll(on: boolean) {
    const next: Record<string, boolean> = {};
    for (const p of products) next[p._id] = on;
    setSelected(next);
  }

  const selectedProducts = products.filter(p => selected[p._id]);

  function triggerPrint() {
    window.print();
  }

  return (
    <div className="grid gap-4">
      <Card className="no-print">
        <CardHeader>Print labels</CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-4 gap-3 mb-4">
            <div>
              <Label>Content</Label>
              <select className="border border-black/10 rounded-md px-3 py-2 w-full" value={content} onChange={e => setContent(e.target.value as ContentType)}>
                <option value="qr">QR only</option>
                <option value="barcode">Barcode only</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <Label>Columns</Label>
              <Input type="number" value={cols} onChange={e => setCols(Number(e.target.value))} />
            </div>
            <div>
              <Label>Label width (mm)</Label>
              <Input type="number" value={labelW} onChange={e => setLabelW(Number(e.target.value))} />
            </div>
            <div>
              <Label>Label height (mm)</Label>
              <Input type="number" value={labelH} onChange={e => setLabelH(Number(e.target.value))} />
            </div>
            <div>
              <Label>Gap (mm)</Label>
              <Input type="number" value={gap} onChange={e => setGap(Number(e.target.value))} />
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Button variant="secondary" onClick={() => toggleAll(true)}>Select all</Button>
            <Button variant="ghost" onClick={() => toggleAll(false)}>Clear</Button>
            <Button onClick={triggerPrint}>Print</Button>
          </div>

          <div className="grid gap-2 max-h-[320px] overflow-auto border border-black/10 rounded-md p-2">
            {products.map(p => (
              <label key={p._id} className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={!!selected[p._id]} onChange={e => setSelected(s => ({ ...s, [p._id]: e.target.checked }))} />
                <span className="font-medium">{p.name}</span>
                <span className="text-black/60">({p.publicId})</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Print preview */}
      <div
        id="print-area"
        style={{
          "--cols": String(cols),
          "--w": `${labelW}mm`,
          "--h": `${labelH}mm`,
          "--gap": `${gap}mm`,
        } as CSSProperties}
        className="bg-white border border-black/10 rounded-md p-3"
      >
        <style>{`
          @page { margin: 8mm; }
          @media print {
            header, nav, footer, .no-print, .${"controls"} { display: none !important; }
            body { background: #fff !important; }
            #print-area { border: none; padding: 0; }
          }
        `}</style>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, var(--w))`, gap: "var(--gap)" } as CSSProperties}>
          {selectedProducts.map(p => (
            <div key={p._id} className="border border-black/10 rounded-md p-2 flex flex-col items-center justify-center gap-1" style={{ width: "var(--w)", height: "var(--h)" }}>
              {(content === "qr" || content === "both") && p.qrCodeUrl && (
                <img src={p.qrCodeUrl} alt="QR" className="w-[36mm] h-[36mm]" />
              )}
              {(content === "barcode" || content === "both") && p.barcodeUrl && (
                <img src={p.barcodeUrl} alt="Barcode" className="h-[18mm] max-w-[40mm] w-auto object-contain" />
              )}
              <div className="text-[8px] leading-none text-center w-full mt-0.5">{p.publicId}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
