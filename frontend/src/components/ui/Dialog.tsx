'use client';

import { Fragment } from 'react';
import type { RefObject } from 'react';
import { Dialog as HDialog, Transition } from '@headlessui/react';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** element that receives focus when the dialog opens (the safe action) */
  initialFocus?: RefObject<HTMLElement>;
}

export default function Dialog({ open, onClose, title, description, children, footer, initialFocus }: DialogProps) {
  return (
    <Transition show={open} as={Fragment}>
      <HDialog onClose={onClose} initialFocus={initialFocus} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="transition duration-150"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="transition duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HDialog.Panel className="w-full max-w-md rounded-t-2xl bg-surface p-6 shadow-float sm:rounded-2xl">
              <HDialog.Title className="font-display text-xl font-medium text-ink">{title}</HDialog.Title>
              {description && <HDialog.Description className="mt-2 text-ink-soft">{description}</HDialog.Description>}
              {children && <div className="mt-4">{children}</div>}
              {footer && <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div>}
            </HDialog.Panel>
          </Transition.Child>
        </div>
      </HDialog>
    </Transition>
  );
}
export { Dialog };
