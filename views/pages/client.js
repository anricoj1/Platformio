function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const publicVapidKey = "BIhZ6GWPPi1LXo6EtnoGLS4UI622Hs7wGY4PQxsCQTxEZcBxLYLatmAi8Qrizc8NukFPoe2YkjZTllVXFjPlAt4";

if ("serviceWorker" in navigator) {
  triggerPushNotification().catch(err => console.error(err));
}

async function triggerPushNotification() {
  const register = await navigator.serviceWorker.register('worker.js', {
    scope: "/"
  });

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  await fetch('/notifications', {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });

}
