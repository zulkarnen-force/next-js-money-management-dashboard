"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CreditCardProps {
  name?: string;
  number?: string;
  expiry?: string;
  className?: string;
  variant?: "dark" | "light" | "gradient";
}

const CreditCard = ({
  name = "John Doe",
  number = "4242 4242 4242 4242",
  expiry = "12/25",
  className,
  variant = "dark",
}: CreditCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Format card number with spaces and mask all but last 4 digits
  const formatCardNumber = (num: string) => {
    const cleaned = num.replace(/\s+/g, "");
    const masked = cleaned.slice(0, -4).replace(/\d/g, "•") + cleaned.slice(-4);
    return masked.match(/.{1,4}/g)?.join(" ") || masked;
  };

  // Format card number for clipboard (only last 4 digits visible for security)
  const clipboardCardNumber = (num: string) => {
    const cleaned = num.replace(/\s+/g, "");
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  const copyToClipboard = () => {
    // Create text to copy
    const textToCopy = `Cardholder: ${name}\nCard Number: ${clipboardCardNumber(
      number
    )}\nExpiry: ${expiry}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleClick = () => {
    copyToClipboard();
  };

  const variants = {
    dark: {
      primary: "bg-gray-900",
      secondary: "bg-gray-800",
      text: "text-white",
    },
    light: {
      primary: "bg-gray-100",
      secondary: "bg-gray-200",
      text: "text-gray-900",
    },
    gradient: {
      primary: "bg-gradient-to-br from-purple-500 to-indigo-800",
      secondary: "bg-purple-900/30",
      text: "text-white",
    },
  };

  const { primary, secondary, text } = variants[variant];

  return (
    <div className="relative perspective">
      <div
        className={cn(
          "relative w-full max-w-[380px] h-[220px] rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 transform hover:shadow-xl",
          primary,
          className
        )}
        onClick={handleClick}
      >
        {/* Card background shape */}
        <div
          className={cn(
            "absolute bottom-0 right-0 w-2/3 h-full rounded-tl-full",
            secondary
          )}
        ></div>

        {/* Card content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="text-xs font-medium uppercase opacity-70">
              Credit Card
            </div>
            <div className="flex space-x-1">
              <div className="h-8 w-8 rounded-full bg-red-500"></div>
              <div className="h-8 w-8 rounded-full bg-orange-400 -ml-4 opacity-80"></div>
            </div>
          </div>

          <div className="mt-6">
            <div className={cn("text-lg font-mono tracking-wider", text)}>
              {formatCardNumber(number)}
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className={cn("text-xs opacity-70 mb-1", text)}>
                Card Holder
              </div>
              <div className={cn("text-sm font-medium uppercase", text)}>
                {name}
              </div>
            </div>
            <div>
              <div className={cn("text-xs opacity-70 mb-1", text)}>Expires</div>
              <div className={cn("text-sm font-medium", text)}>{expiry}</div>
            </div>
          </div>
        </div>

        {/* Copy feedback overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300",
            copied ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="bg-white text-gray-900 px-4 py-2 rounded-md flex items-center gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Copied to clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy card details</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
