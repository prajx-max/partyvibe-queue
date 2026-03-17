import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Join ${sessionName} on BeatBaaja`, text: 'Vote for songs at the party! 🎶', url: guestUrl });
      } catch {}
    } else {
      copyToClipboard();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center rounded-xl glass-heavy p-6 neon-border"
    >
      <h3 className="mb-1 font-display text-lg font-semibold">Scan to Join</h3>
      <p className="mb-4 text-sm text-muted-foreground text-center">{sessionName}</p>
      
      <div className="rounded-xl bg-white p-4 mb-4 shadow-[0_0_32px_hsl(var(--primary)/0.15)]">
        <QRCodeSVG value={guestUrl} size={180} level="H" includeMargin={false} bgColor="#ffffff" fgColor="#0a0a0a" />
      </div>

      <div className="flex gap-2 w-full">
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1 gap-2 rounded-lg min-h-[44px]">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
        <Button variant="outline" size="sm" onClick={shareLink} className="gap-2 rounded-lg min-h-[44px]">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}
