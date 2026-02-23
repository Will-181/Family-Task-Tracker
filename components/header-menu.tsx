"use client";

import { useState } from "react";
import { MoreVertical, Settings, Info, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useColorPalette, type ColorPalette } from "@/lib/color-palette";
import { APP_VERSION, APP_UPDATE_DATE } from "@/lib/app-config";

const PALETTE_LABELS: Record<ColorPalette, string> = {
  default: "Default",
  ocean: "Ocean",
  violet: "Violet",
};

export function HeaderMenu() {
  const { colorPalette, setColorPalette } = useColorPalette();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label="Open menu"
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
            <Settings className="h-4 w-4 shrink-0" aria-hidden />
            Settings
          </DropdownMenuLabel>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-0 pl-6">
            Color theme
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={colorPalette}
            onValueChange={(v) => setColorPalette(v as ColorPalette)}
          >
            {(Object.keys(PALETTE_LABELS) as ColorPalette[]).map((p) => (
              <DropdownMenuRadioItem key={p} value={p} className="pl-6">
                {PALETTE_LABELS[p]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setAboutOpen(true)}>
            <Info className="mr-2 h-4 w-4" aria-hidden />
            About
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setVersionOpen(true)}>
            <Tag className="mr-2 h-4 w-4" aria-hidden />
            Version
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Family Task Tracker</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Family Task Tracker is a household project request manager. Use it to
            create and track tasks, move them through New / Open, In Progress,
            and Completed on a Kanban board, and schedule tasks on a calendar.
            You can add materials, tools, notes, and requesters. Access is
            protected by a simple shared passcode.
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={versionOpen} onOpenChange={setVersionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium text-foreground">Version:</span>{" "}
              {APP_VERSION}
            </p>
            <p>
              <span className="font-medium text-foreground">Updated:</span>{" "}
              {APP_UPDATE_DATE}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
