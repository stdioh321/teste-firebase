document.addEventListener("DOMContentLoaded", event => {

    const app = firebase.app();

    document.querySelector("#inpUpdatePost").addEventListener("input", _.debounce(onUpdatePost, 200));

    firestoreNormal();
    firestoreRealtime();


});

function getDoc(collection = "posts", doc = "mypost") {
    const db = firebase.firestore();
    const res = db.collection(collection).doc(doc);
    return res;
}

async function onUpdatePost(ev) {
    const value = ev.target.value;
    const myPost = getDoc();
    try {
        const doc = await myPost.update({ title: value });
        console.log("Doc updated");
    } catch (error) {
        console.log(error);
    }
}

function firestoreNormal() {
    const myPost = getDoc();

    // NORMAL
    myPost.get()
        .then(doc => {

            const data = doc.data();
            normal = document.querySelector("#firestoreNormalRes") || {};
            normal.innerHTML = `<pre class="small text-success">${JSON.stringify(data, null, 2)}</pre>`;
            (document.querySelector("#inpUpdatePost") || {}).value = data.title;
        })
        .catch(err => {
            console.log(err);
        });

}

function firestoreRealtime() {
    const myPost = getDoc();

    // Realtime
    myPost.onSnapshot(doc => {
        const data = doc.data();
        (document.querySelector("#firestoreRealtimeRes") || {}).innerHTML = `<pre class="small text-info">${JSON.stringify(data, null, 2)}</pre>`;
    });
}


let loginWithGoogleLoading = false;
// GLOBAL



async function loginWithGoogle(self) {
    if (loginWithGoogleLoading) return;
    loginWithGoogle = true;
    self.disabled = true;
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth();

    try {
        const res = await auth.signInWithPopup(provider);
        const { user } = res;
        document.querySelector("#loginWithGoogleRes").innerHTML = `Hello: ${user.displayName}`;
        // const res = await auth.signInWithRedirect(provider);
        console.log(res);
    } catch (error) {
        console.log("%c ERROR", "color:red; font-size:2em");
        console.log(error);
    }
    self.disabled = false;
    loginWithGoogleLoading = false;
}