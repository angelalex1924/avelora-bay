'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/app/lib/cn';

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-[300] bg-[#2c2420]/45 backdrop-blur-[2px]',
        'data-[state=closed]:animate-[avelora-fade-out_200ms_ease-out] data-[state=open]:animate-[avelora-fade-in_200ms_ease-out]',
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-[300] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 outline-none',
          'data-[state=closed]:animate-[avelora-dialog-out_220ms_cubic-bezier(0.22,1,0.36,1)] data-[state=open]:animate-[avelora-dialog-in_220ms_cubic-bezier(0.22,1,0.36,1)]',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#8a6f5a] transition hover:bg-[#2c2420]/5 hover:text-[#2c2420] focus:outline-none">
          <X className="h-4 w-4" strokeWidth={2} />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('font-serif text-xl font-normal text-[#2c2420]', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm leading-relaxed text-[#8a6f5a]', className)}
      {...props}
    />
  );
}

export { Dialog, DialogContent, DialogDescription, DialogTitle };
