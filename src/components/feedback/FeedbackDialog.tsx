import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FeedbackForm } from './FeedbackForm';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedbackDialogProps {
  trigger: React.ReactNode;
}

export const FeedbackDialog = ({ trigger }: FeedbackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Share Your Feedback</DialogTitle>
              <DialogDescription>
                Your input helps us improve PrivacyGuard and serve you better
              </DialogDescription>
            </DialogHeader>
            <FeedbackForm onSuccess={handleSuccess} />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h3 className="text-2xl font-semibold">Thank you! 🙏</h3>
            <p className="text-muted-foreground text-center">
              Your feedback helps us improve PrivacyGuard
            </p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
