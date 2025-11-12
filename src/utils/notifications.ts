// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show notification
export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/scooter.png',
      badge: '/scooter.png',
      ...options,
    });
  }
};

// Check and notify for low range
export const checkAndNotifyLowRange = (
  currentRange: number,
  lowThreshold: number,
  criticalThreshold: number,
  lastNotificationRange: number | null
): number | null => {
  // Only notify once per threshold crossing
  if (currentRange < criticalThreshold && (lastNotificationRange === null || lastNotificationRange >= criticalThreshold)) {
    showNotification('🔴 CRITICAL: Very Low Range!', {
      body: `Only ${currentRange.toFixed(1)} km remaining. Charge immediately!`,
      tag: 'critical-range',
      requireInteraction: true,
    });
    return currentRange;
  } else if (currentRange < lowThreshold && (lastNotificationRange === null || lastNotificationRange >= lowThreshold)) {
    showNotification('⚠️ Low Range Alert', {
      body: `${currentRange.toFixed(1)} km remaining. Please charge your scooter soon.`,
      tag: 'low-range',
    });
    return currentRange;
  }

  // Reset notification state if range goes back up
  if (currentRange >= lowThreshold && lastNotificationRange !== null && lastNotificationRange < lowThreshold) {
    return null;
  }

  return lastNotificationRange;
};
