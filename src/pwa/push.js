/**
 * Web Push helpers for TicketMaster.
 * Private VAPID keys must never ship in the frontend — only the public key.
 */

import { api } from '../api/client';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function pushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function getPushPermission() {
  if (!pushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request permission and register a push subscription with Django.
 * Does nothing if the user denies permission.
 */
export async function subscribeToPush() {
  if (!pushSupported()) {
    throw new Error('Push notifications are not supported on this device.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { ok: false, reason: 'denied' };
  }

  const { publicKey } = await api.getPushVapidPublicKey();
  if (!publicKey) {
    throw new Error('Push is not configured on the server yet.');
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  await api.savePushSubscription(subscription.toJSON());
  return { ok: true, subscription };
}

export async function unsubscribeFromPush() {
  if (!pushSupported()) return { ok: false, reason: 'unsupported' };
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return { ok: true };

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();
  try {
    await api.deletePushSubscription(endpoint);
  } catch {
    /* best-effort server cleanup */
  }
  return { ok: true };
}
