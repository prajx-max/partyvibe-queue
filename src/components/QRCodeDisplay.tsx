import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface QRCodeDisplayProps {
  sessionId: string;
  sessionName: string;
}

export function QRCodeDisplay({ sessionId, sessionName }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const guestUrl = `${window.location.origin}/session/${sessionId}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(guestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center rounded-2xl bg-card p-6 border border-border"
    >
      <h3 className="mb-2 font-display text-lg font-semibold">Scan to Join</h3>
      <p className="mb-4 text-sm text-muted-foreground text-center">{sessionName}</p>
      
      <div className="rounded-xl bg-white p-4 mb-4">
        <QRCodeSVG
          value={guestUrl}
          size={180}
          level="H"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#0a0a0f"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>
    </motion.div>
  );
}
