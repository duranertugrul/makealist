import * as firebase from 'firebase';

  var config = {
    apiKey: "AIzaSyDPvW-olq24uRL5CbI4eyeEfTXaTmKxmpU",
    authDomain: "goalcoach-22ac7.firebaseapp.com",
    databaseURL: "https://goalcoach-22ac7.firebaseio.com",
    projectId: "goalcoach-22ac7",
    storageBucket: "goalcoach-22ac7.appspot.com",
    messagingSenderId: "828818940689"
  };

export const firebaseApp = firebase.initializeApp(config);
export const goalRef = firebase.database().ref('goals');
export const completeGoalRef = firebase.database().ref('completeGoals');
export const dbReference = firebase.database();

export const getTodoDB = (sectionId) => {
    return firebase.database().ref('goals');
  }
