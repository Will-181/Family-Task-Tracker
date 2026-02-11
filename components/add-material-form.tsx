"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type AddMaterialFormProps = {
  taskId?: string;
  onAdd: (body: {
    description: string;
    quantity?: number;
    unit?: string;
    unitPrice?: number;
    vendor?: string;
    link?: string;
    haveIt?: boolean;
  }) => Promise<unknown>;
};

export function AddMaterialForm({ onAdd }: AddMaterialFormProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [vendor, setVendor] = useState("");
  const [link, setLink] = useState("");
  const [haveIt, setHaveIt] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSaving(true);
    try {
      await onAdd({
        description: description.trim(),
        quantity: parseFloat(quantity) || 1,
        unit: unit.trim() || undefined,
        unitPrice: unitPrice ? parseFloat(unitPrice) : undefined,
        vendor: vendor.trim() || undefined,
        link: link.trim() || undefined,
        haveIt,
      });
      setDescription("");
      setQuantity("1");
      setUnit("");
      setUnitPrice("");
      setVendor("");
      setLink("");
      setHaveIt(false);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" aria-label="Add material">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="mat-desc">Description *</Label>
            <Input
              id="mat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="e.g. 2x4 lumber"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mat-qty">Quantity</Label>
              <Input
                id="mat-qty"
                type="number"
                min={0.01}
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mat-unit">Unit</Label>
              <Input
                id="mat-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. ft, each"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="mat-price">Unit price</Label>
            <Input
              id="mat-price"
              type="number"
              min={0}
              step="any"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="mat-vendor">Vendor</Label>
            <Input
              id="mat-vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="mat-link">Link</Label>
            <Input
              id="mat-link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="mat-have"
              checked={haveIt}
              onCheckedChange={(v) => setHaveIt(Boolean(v))}
            />
            <Label htmlFor="mat-have">Have it?</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !description.trim()}>
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
