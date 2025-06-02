

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const PackageDialogForm = ({ triggerText, pkg, onChange }) => {
  const handleSave = () => {
    // You can customize this logic to persist or trigger a parent callback
    console.log("Saved Package:", pkg);
    alert("Package saved!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn border px-4 py-1 rounded-md bg-white hover:bg-gray-100">{triggerText}</button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Payable Start Date</Label>
            <Calendar
              mode="single"
              selected={pkg.packagePayableStartDate}
              onSelect={(date) => onChange("packagePayableStartDate", date)}
            />
          </div>

          <div>
            <Label>Payable End Date</Label>
            <Calendar
              mode="single"
              selected={pkg.packagePayableEndDate}
              onSelect={(date) => onChange("packagePayableEndDate", date)}
            />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={pkg.allowAfterEndDate}
                onCheckedChange={(val) => onChange("allowAfterEndDate", val)}
              />
              Allow After End Date
            </Label>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={pkg.allowPenaltyPayableAfterEndDate}
                onCheckedChange={(val) => onChange("allowPenaltyPayableAfterEndDate", val)}
              />
              Allow Penalty After End Date
            </Label>
          </div>

          {pkg.allowPenaltyPayableAfterEndDate && (
            <>
              <div>
                <Label>Penalty Type</Label>
                <Input
                  value={pkg.penaltyType}
                  onChange={(e) => onChange("penaltyType", e.target.value)}
                  placeholder="Fixed/Percentage"
                />
              </div>

              <div>
                <Label>Penalty Amount</Label>
                <Input
                  type="number"
                  value={pkg.penaltyAmount}
                  onChange={(e) => onChange("penaltyAmount", Number(e.target.value))}
                />
              </div>

              <div>
                <Label>Penalty Frequency</Label>
                <Input
                  value={pkg.penaltyFrequency}
                  onChange={(e) => onChange("penaltyFrequency", e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={pkg.allowDiscount}
                onCheckedChange={(val) => onChange("allowDiscount", val)}
              />
              Allow Discount
            </Label>
          </div>

          {pkg.allowDiscount && (
            <>
              <div>
                <Label>Discount Type</Label>
                <Input
                  value={pkg.discountType}
                  onChange={(e) => onChange("discountType", e.target.value)}
                  placeholder="Fixed/Percentage"
                />
              </div>

              <div>
                <Label>Discount Amount</Label>
                <Input
                  type="number"
                  value={pkg.discountAmount}
                  onChange={(e) => onChange("discountAmount", Number(e.target.value))}
                />
              </div>

              <div>
                <Label>Discount Frequency</Label>
                <Input
                  value={pkg.discountFrequency}
                  onChange={(e) => onChange("discountFrequency", e.target.value)}
                />
              </div>

              <div>
                <Label>Discount End Date</Label>
                <Calendar
                  mode="single"
                  selected={pkg.discountEndDate}
                  onSelect={(date) => onChange("discountEndDate", date)}
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={pkg.allowPackagePurchaseIfFeesPaid}
                onCheckedChange={(val) => onChange("allowPackagePurchaseIfFeesPaid", val)}
              />
              Allow Purchase if Fees Paid
            </Label>
          </div>

          <div className="md:col-span-2">
            <Label>Total Package Amount</Label>
            <Input
              type="number"
              value={pkg.packageAmount}
              onChange={(e) => onChange("packageAmount", Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDialogForm;