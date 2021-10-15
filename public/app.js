document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app);
});

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