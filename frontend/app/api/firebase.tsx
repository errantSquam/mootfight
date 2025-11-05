// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_KEY as string)

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth()

var db = getFirestore(app)


const signIn = (email: string, password: string) => {
    var promise = signInWithEmailAndPassword(auth, email, password)

    promise.catch(function (error) {
          var errorCode = error.code;
          console.log(`GOT ERROR: ` + errorCode)
          //catch errors, check docs and put actual errors here later. these are for creation
          if (errorCode == 'auth/weak-password') return 
          if (errorCode == 'auth/email-already-in-use') return 
      });

    promise.then(async function (userCredential) {
          var userUid = userCredential.user.uid;
          var docRef = doc(db, "users", userUid)

          var docSnap = await getDoc(docRef)
          if (!docSnap.exists()) {
            
            setDoc(docRef, {
                email: email,
                username: email,

            });
        }
       });  

}

export {
    signIn,
    auth
}