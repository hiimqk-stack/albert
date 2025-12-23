// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAF66MKaDZOX7-xlXsW-YA0qV_Z617uDfE",
    authDomain: "isaa-559ef.firebaseapp.com",
    databaseURL: "https://isaa-559ef-default-rtdb.firebaseio.com",
    projectId: "isaa-559ef",
    storageBucket: "isaa-559ef.firebasestorage.app",
    messagingSenderId: "1017838932952",
    appId: "1:1017838932952:web:8796cfdc74b1ab3343d8ad"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Database reference
const database = firebase.database();
