"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check, X } from "lucide-react";

type Material = {
  id: string;
  description: string;
  quantity: number;
  unit: string | null;
  unitPrice: number | null;
  vendor: string | null;
  link: string | null;
  haveIt: boolean;
};

type MaterialRowProps = {
  material: Material;
  onUpdate: (data: Partial<Material>) => Promise<unknown>;
  onDelete: () => Promise<unknown>;
};

export function MaterialRow({ material, onUpdate, onDelete }: MaterialRowProps) {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(material.description);
  const [quantity, setQuantity] = useState(String(material.quantity));
  const [unit, setUnit] = useState(material.unit ?? "");
  const [unitPrice, setUnitPrice] = useState(material.unitPrice != null ? String(material.unitPrice) : "");
  const [vendor, setVendor] = useState(material.vendor ?? "");
  const [link, setLink] = useState(material.link ?? "");
  const [haveIt, setHaveIt] = useState(material.haveIt);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        description,
        quantity: parseFloat(quantity) || 1,
        unit: unit || undefined,
        unitPrice: unitPrice ? parseFloat(unitPrice) : undefined,
        vendor: vendor || undefined,
        link: link || undefined,
        haveIt,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDescription(material.description);
    setQuantity(String(material.quantity));
    setUnit(material.unit ?? "");
    setUnitPrice(material.unitPrice != null ? String(material.unitPrice) : "");
    setVendor(material.vendor ?? "");
    setLink(material.link ?? "");
    setHaveIt(material.haveIt);
    setEditing(false);
  };

  if (editing) {
    return (
      <tr className="border-b">
        <td className="py-2">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-8 text-sm"
            aria-label="Description"
          />
        </td>
        <td className="py-2">
          <Input
            type="number"
            min={0.01}
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="h-8 w-20 text-sm"
            aria-label="Quantity"
          />
        </td>
        <td className="py-2">
          <Input
            type="number"
            min={0}
            step="any"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="h-8 w-24 text-sm"
            aria-label="Unit price"
          />
        </td>
        <td className="py-2">
          <Input
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="h-8 text-sm"
            aria-label="Vendor"
          />
        </td>
        <td className="py-2">
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="h-8 text-sm"
            placeholder="URL"
            aria-label="Link"
          />
        </td>
        <td className="py-2">
          <Checkbox
            checked={haveIt}
            onCheckedChange={(v) => setHaveIt(Boolean(v))}
            aria-label="Have it?"
          />
        </td>
        <td className="py-2">
          <div className="flex gap-1">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave} disabled={saving} aria-label="Save">
              <Check className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel} aria-label="Cancel">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b">
      <td className="py-2">{material.description}</td>
      <td className="py-2">{material.quantity}</td>
      <td className="py-2">{material.unitPrice != null ? `$${material.unitPrice.toFixed(2)}` : "—"}</td>
      <td className="py-2">{material.vendor ?? "—"}</td>
      <td className="py-2">
        {material.link ? (
          <a href={material.link} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">
            Link
          </a>
        ) : (
          "—"
        )}
      </td>
      <td className="py-2">{material.haveIt ? "Yes" : "No"}</td>
      <td className="py-2">
        <div className="flex gap-1">
          <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(true)} aria-label="Edit material">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onDelete()} aria-label="Delete material">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
