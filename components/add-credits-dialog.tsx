"use client";

import { useState } from "react";
import { useUser } from "@/lib/hooks";
import { addCredits } from "@/lib/services/credit-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Info, CreditCard } from "lucide-react";
import { showToast } from "@/lib/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CREDIT_OPTIONS = [
  { amount: 10, price: 0.99, perCredit: "$0.099 per credit" },
  { amount: 20, price: 1.99, perCredit: "$0.099 per credit" },
  { amount: 50, price: 4.99, perCredit: "$0.099 per credit" },
  {
    amount: 100,
    price: 9.99,
    perCredit: "$0.099 per credit",
    recommended: true,
  },
];

type AddCreditsDialogProps = {
  trigger?: React.ReactNode;
  onCreditsAdded?: () => void;
};

export function AddCreditsDialog({
  trigger,
  onCreditsAdded,
}: AddCreditsDialogProps) {
  const { user } = useUser();
  const [isAddingCredits, setIsAddingCredits] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("100"); // Default to 100 credits
  const [customAmount, setCustomAmount] = useState("");

  const handleAddCredits = async () => {
    if (!user?.id) {
      showToast.error("You must be logged in to add credits");
      return;
    }

    let amount = parseInt(selectedOption);

    if (selectedOption === "custom") {
      amount = parseInt(customAmount);
      if (isNaN(amount) || amount <= 0) {
        showToast.error("Please enter a valid amount");
        return;
      }
    }

    setIsAddingCredits(true);

    try {
      await addCredits(user.id, amount, "Credits purchase");
      showToast.success(`Added ${amount} credits to your account`);
      setDialogOpen(false);
      setCustomAmount("");
      setSelectedOption("100");

      // Call the callback if provided
      if (onCreditsAdded) {
        onCreditsAdded();
      }
    } catch (error) {
      console.error("Failed to add credits:", error);
      showToast.error("Failed to add credits to your account");
    } finally {
      setIsAddingCredits(false);
    }
  };

  // Calculate price for the selected option
  const getPrice = () => {
    if (selectedOption === "custom") {
      const amount = parseInt(customAmount);
      if (!isNaN(amount) && amount > 0) {
        // Apply a pricing formula for custom amounts
        return (amount * 0.1).toFixed(2);
      }
      return "0.00";
    }

    const option = CREDIT_OPTIONS.find(
      (opt) => opt.amount === parseInt(selectedOption)
    );
    return option ? option.price.toFixed(2) : "0.00";
  };

  const defaultTrigger = (
    <Button className="bg-indigo-600 hover:bg-indigo-700">
      <Plus className="h-4 w-4 mr-2" /> Add Credits
    </Button>
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-medium">Add Credits</DialogTitle>
          <DialogDescription>
            Choose how many credits you want to add to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-2"
          >
            {CREDIT_OPTIONS.map((option) => {
              const isSelected = selectedOption === option.amount.toString();

              return (
                <div
                  key={option.amount}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 border rounded-lg cursor-pointer transition-all",
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                  onClick={() => setSelectedOption(option.amount.toString())}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={option.amount.toString()}
                      id={`option-${option.amount}`}
                    />
                    <div className="flex flex-col">
                      <Label
                        htmlFor={`option-${option.amount}`}
                        className="cursor-pointer font-medium"
                      >
                        {option.amount} Credits
                        {option.recommended && (
                          <span className="ml-2 text-xs text-green-600 font-medium">
                            BEST VALUE
                          </span>
                        )}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {option.perCredit}
                      </span>
                    </div>
                  </div>
                  <div className="font-semibold">
                    ${option.price.toFixed(2)}
                  </div>
                </div>
              );
            })}
            <div
              className={cn(
                "flex items-center justify-between px-4 py-3 border rounded-lg cursor-pointer transition-all",
                selectedOption === "custom"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "hover:bg-slate-50 dark:hover:bg-slate-900"
              )}
              onClick={() => setSelectedOption("custom")}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="custom" id="option-custom" />
                <Label
                  htmlFor="option-custom"
                  className="cursor-pointer font-medium"
                >
                  Custom Amount
                </Label>
              </div>
              <div className="font-semibold">
                ${selectedOption === "custom" ? getPrice() : "0.00"}
              </div>
            </div>
            {selectedOption === "custom" && (
              <div className="pl-10 pr-4 mt-1">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full"
                  min="1"
                  autoFocus
                />
              </div>
            )}
          </RadioGroup>

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-md flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Info className="h-4 w-4 flex-shrink-0" />
            <p>
              Premium templates typically cost between 10-50 credits depending
              on complexity. Credits never expire.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <div>
            <div className="text-sm text-slate-500">Total</div>
            <div className="font-semibold text-lg">${getPrice()}</div>
          </div>
          <Button
            onClick={handleAddCredits}
            disabled={isAddingCredits}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isAddingCredits ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Purchase Credits
              </span>
            )}
          </Button>
        </div>

        <div className="flex justify-center pb-4">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure payment processing</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
