'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export type NavDropdownPosition = {
  top: number;
  right: number;
};

type UseNavDropdownOptions = {
  panelWidth?: number;
  dataAttribute?: string;
};

export function useNavDropdown({
  panelWidth = 360,
  dataAttribute = 'data-nav-dropdown',
}: UseNavDropdownOptions = {}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<NavDropdownPosition>({ top: 0, right: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const right = Math.max(12, Math.min(window.innerWidth - panelWidth - 12, window.innerWidth - rect.right));
    setPosition({
      top: rect.bottom + 8,
      right,
    });
  }, [panelWidth]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest(`[${dataAttribute}]`)) return;
      close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close, dataAttribute]);

  return {
    open,
    setOpen,
    toggle,
    close,
    mounted,
    position,
    rootRef,
    buttonRef,
    dataAttribute,
  };
}
