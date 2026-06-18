'use client';

import { getAnalytics, isSupported } from 'firebase/analytics';
import { getApp } from 'firebase/app';
import { useEffect } from 'react';

export function FirebaseAnalytics() {
  useEffect(() => {
    void isSupported().then((supported) => {
      if (supported) {
        getAnalytics(getApp());
      }
    });
  }, []);

  return null;
}
