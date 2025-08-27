if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").then(() => {
    console.log("Service Worker Registered");
  });
}

const publicVapidKey = "BGt5cbiXzFPOmiAzS8pUfZixrQc2NJdcpmkFYzbqssgjEFvaQqhpKbayoXjYfkIo7u43PhN0SAKJBgO1umOtAzs";

document.getElementById("subscribe").addEventListener("click", async () => {
  const register = await navigator.serviceWorker.ready;

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: { "Content-Type": "application/json" }
  });

  alert("✅ Subscribed to daily reminders!");
});

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
