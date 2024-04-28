let isSubscribed = false;
let swRegistration = null;
let applicationKey = "BNinQP00uhbpNYht4PG990s2M-XinzpvBXIBkhLoADpYb4cQTWgfyXgcVrWHYNfahnmzyUYDQxbPq9H_mc0M9VY";




window.onload = () => {
    // (A1) ASK FOR PERMISSION
    if (Notification.permission === "default") {
        Notification.requestPermission().then(perm => {
            if (Notification.permission === "granted") {
                installSW();
            } else {
                alert("Please allow notifications.");
            }
        });
    }

    // (A2) GRANTED
    else if (Notification.permission === "granted") {
        installSW();
    }

    // (A3) DENIED
    else { alert("Please allow notifications."); }
};








// Url Encription
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}



function installSW() {
    // Installing service worker
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');
        navigator.serviceWorker.register('sw.js').then(function (swReg) {
                console.log('service worker registered');
                swRegistration = swReg;
                swRegistration.pushManager.getSubscription().then(function (subscription) {
                        isSubscribed = !(subscription === null);
                        if (isSubscribed) {
                            console.log('User is subscribed');
                            console.log("subscription: ", subscription?.toJSON());
                            if(subscription != undefined){
                                saveSubscription(subscription);
                            }
                        } else {
                            swRegistration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlB64ToUint8Array(applicationKey)
                            }).then(function (subscription) {
                                    console.log(subscription);
                                    console.log('User is subscribed two');
                                    saveSubscription(subscription);
                                    isSubscribed = true;
                                }).catch(function (err) {
                                    console.log('Failed to subscribe user: ', err);
                                });
                            console.log("subscriptionTwo: ", subscription?.toJSON());
                        }
                    });
            }).catch(function (error) {
                console.error('Service Worker Error', error);
            });
    } else {
        console.warn('Push messaging is not supported');
    }
}





// Send request to database for add new subscriber
function saveSubscription(subscription) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://localhost:8080/api/push/subscribe");
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState != 4) return;
        if (xmlHttp.status != 200 && xmlHttp.status != 304) {
            console.log('HTTP error ' + xmlHttp.status, null);
        } else {
            console.log("User subscribed to server");
        }
    };
    xmlHttp.send(JSON.stringify(subscription));
}