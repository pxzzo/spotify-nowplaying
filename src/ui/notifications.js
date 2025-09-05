export function notify(msg) {
  if (Notification.permission === 'granted') new Notification(msg);
}

export function initNotifications() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}
