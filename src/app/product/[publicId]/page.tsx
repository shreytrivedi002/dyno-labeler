import { headers } from "next/headers";

async function getData(publicId: string) {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") || "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/public/products/${publicId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicProductPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const data = await getData(publicId);
  if (!data) return <div className="p-6">Not found</div>;

  return (
    <div className={`min-h-screen theme-${data.theme} flex items-start justify-center`} style={{ background: "#fafafa" }}>
      <div className="w-full max-w-md p-6 mt-8 bg-white rounded-xl border border-black/10">
        <h1 className="text-2xl font-semibold mb-1">{data.name}</h1>
        {data.shopName && <div className="text-sm text-black/60 mb-1">{data.shopName}</div>}
        <div className="text-sm text-black/50 mb-4">ID: {data.publicId}</div>

        <div className="space-y-1 mb-4 text-sm">
          <div>Making charges: <span className="font-medium">{data.makingCharges}</span></div>
          <div>Tax: <span className="font-medium">{data.taxPercentage}%</span></div>
          <div className="font-medium">Subtotal: {data.totals.subtotal.toFixed(2)}</div>
          <div>Tax amount: {data.totals.taxAmount.toFixed(2)}</div>
          <div className="text-lg font-semibold text-[var(--primary)]">Final: {data.totals.finalPrice.toFixed(2)}</div>
        </div>

        {data.qrCodeUrl && (
          <div className="flex justify-center mb-3">
            <img src={data.qrCodeUrl} alt="QR" className="w-40 h-40" />
          </div>
        )}
        {data.barcodeUrl && (
          <div className="flex justify-center">
            <img src={data.barcodeUrl} alt="Barcode" className="h-16 max-w-[240px] w-auto object-contain" />
          </div>
        )}
      </div>
    </div>
  );
}
