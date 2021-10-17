document.addEventListener("DOMContentLoaded", event => {

    const app = firebase.app();

    document.querySelector("#inpUpdatePost").addEventListener("input", _.debounce(onUpdatePost, 800));

    firestoreNormal();
    firestoreRealtime();
    firestoreAll();
    firestoreAllRemove();

    const storageImageRef = firebase.storage().ref("/public/images/temp.png");
    storageImageRef.getDownloadURL()
        .then(url => {
            document.querySelector("#storageResult").innerHTML = `<div class="text-primary">Already on Storage</div><img src="${url}" class="img-fluid"/>`;
        }, error => {
            console.log({ error });
        })
});



function getDoc(collection = "posts", doc = "mypost") {
    const db = firebase.firestore();
    const res = db.collection(collection).doc(doc);
    return res;
}

async function uploadFile(inputFile) {
    const f = inputFile.files.item(0);
    if (!f) return;
    const { type, name } = f;
    console.log({ name, type });
    inputFile.value = "";
    const storageResult = document.querySelector("#storageResult");
    storageResult.innerHTML = "Loading....";
    const storageRef = firebase.storage().ref("/public/images");
    const tempRef = storageRef.child("temp.png");
    try {
        snap = await tempRef.put(f);
        const urlImage = await tempRef.getDownloadURL();
        storageResult.innerHTML = `<img src="${urlImage}" class="img-fluid"/>`
    } catch (error) {
        console.log({ error });
        storageResult.innerHTML = `<div class='alert alert-danger'>${error.message || "Error"}</div>`;
    }


}

function onDeleteDoc(id) {
    const ok = confirm("Are you sure???");
    if (!ok) return;
    getDoc("posts", id).delete();
}
async function onUpdatePost(ev) {
    console.log("%conUpdatePost", "color:red;font-size:2em;");

    const value = ev.target.value;
    const myPost = getDoc();
    try {
        const doc = await myPost.update({ title: value });
        console.log("Doc updated");
    } catch (error) {
        console.log(error);
    }
}
let addPostLoading = false;
async function onAddPost(self) {
    if (addPostLoading) return;
    [].forEach.call(self.elements, it => it.disabled = true);
    addPostLoading = true;

    const value = self.elements[0].value;
    const db = firebase.firestore();
    const collection = db.collection("posts");
    try {
        const doc = await collection.add({ title: value });
        console.log("Doc added");
    } catch (error) {
        console.log(error);
    }
    [].forEach.call(self.elements, it => it.disabled = false);
    addPostLoading = false;
}

function firestoreAll() {
    const all = document.querySelector("#firestoreAll");
    const db = firebase.firestore();
    const docs = db.collection("posts");
    docs
        .orderBy("title", "desc")
        .onSnapshot(querySnapshot => {
            all.innerHTML = "";
            querySnapshot.docs.forEach(it => {

                const json = JSON.stringify(it.data());
                all.innerHTML += `<div class="alert alert-warning small"><span class="font-weight-bold">ID:</span> ${it.id} - ${json}</div>`
            })
        });

    // docs.get()
    //     .then(querySnapshot => {
    //         all.innerHTML = "";
    //         querySnapshot.docs.forEach(it => {

    //             const json = JSON.stringify(it.data(), null, 2);
    //             all.innerHTML += `<pre class="text-warning small">id: ${it.id} - ${json}</pre>`
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
}

function firestoreAllRemove() {
    const all = document.querySelector("#firestoreRemove");
    const db = firebase.firestore();
    const docs = db.collection("posts");
    docs.where(firebase.firestore.FieldPath.documentId(), "!=", "mypost").onSnapshot(querySnapshot => {
        all.innerHTML = "<ul class='list-group'>";
        querySnapshot.docs.forEach(it => {
            const data = it.data();
            all.innerHTML += `<li class="list-group-item d-flex align-items-center"><div class="flex-fill" ><div>id: ${it.id}</div><small class="text-muted">title: ${data.title}</small></div><div><button  onclick="onDeleteDoc('${it.id}')" class="btn btn-danger">X</button></div></li>`
        })
        all.innerHTML += "</ul";
    });

    // docs.get()
    //     .then(querySnapshot => {
    //         all.innerHTML = "";
    //         querySnapshot.docs.forEach(it => {

    //             const json = JSON.stringify(it.data(), null, 2);
    //             all.innerHTML += `<pre class="text-warning small">id: ${it.id} - ${json}</pre>`
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
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