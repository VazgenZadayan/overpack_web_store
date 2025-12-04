export type DeviceType = 'ios' | 'android' | 'desktop';

export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  if (isIOS) {
    return 'ios';
  }

  if (isAndroid) {
    return 'android';
  }

  return 'desktop';
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const deviceType = getDeviceType();
  return deviceType === 'ios' || deviceType === 'android';
}

