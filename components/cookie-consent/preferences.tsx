"use client";

import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import {
  acceptAllCookies,
  type ConsentState,
  DEFAULT_CONSENT,
  getConsentFromStorage,
  rejectAllCookies,
  updateCookieConsent,
} from "@/components/cookie-consent/cookie";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

type CookiePreferencesProps = {
  children: ReactNode;
  onClose: () => void;
};

export default function CookiePreferences({
  children,
  onClose,
}: CookiePreferencesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(
    getConsentFromStorage() ?? DEFAULT_CONSENT,
  );

  const closeDialog = () => {
    onClose();
    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    setConsent(acceptAllCookies());

    closeDialog();
    toast.success("All cookies accepted");
  };

  const handleRejectAll = () => {
    setConsent(rejectAllCookies());

    closeDialog();
    toast.success("Only essential cookies accepted");
  };

  const handleSavePreferences = () => {
    updateCookieConsent(consent);

    closeDialog();
    toast.success("Preferences saved");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cookie Preferences</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose which cookies you'd like to allow. Essential cookies are
            required for the site to work.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-6">
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">
              Essential (Required)
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Essential Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Required for basic website functionality and security
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">
              Optional
            </h3>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Help us understand how you use our website
                </p>
              </div>
              <Switch
                checked={consent.analytics}
                onCheckedChange={(val: boolean) =>
                  setConsent({ ...consent, analytics: val })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Marketing</p>
                <p className="text-sm text-muted-foreground">
                  Show you relevant advertisements
                </p>
              </div>
              <Switch
                checked={consent.marketing}
                onCheckedChange={(val: boolean) =>
                  setConsent({ ...consent, marketing: val })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Personalization</p>
                <p className="text-sm text-muted-foreground">
                  Customize your experience and content
                </p>
              </div>
              <Switch
                checked={consent.personalization}
                onCheckedChange={(val: boolean) =>
                  setConsent({
                    ...consent,
                    personalization: val,
                  })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="ghost"
            className="text-danger hover:bg-danger/5"
            onClick={handleRejectAll}
          >
            Reject All
          </Button>
          <Button
            variant="ghost"
            className="text-success hover:bg-success/5"
            onClick={handleAcceptAll}
          >
            Accept All
          </Button>
          <Button variant="primary" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
