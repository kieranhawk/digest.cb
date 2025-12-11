// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH_JmUT3QtUAJ04x8QIU12gYSMgyAfuqM",
  authDomain: "digestcb.firebaseapp.com",
  databaseURL: "https://digestcb-default-rtdb.firebaseio.com",
  projectId: "digestcb",
  storageBucket: "digestcb.firebasestorage.app",
  messagingSenderId: "232756821908",
  appId: "1:232756821908:web:bc37944d8e30e85bc49981"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Глобальные функции для работы с лайками
window.firebaseDB = {
  // Получить количество лайков
  getLikes: function(cardId, callback) {
    database.ref('likes/' + cardId).on('value', (snapshot) => {
      callback(snapshot.val() || 0);
    });
  },
  
  // Добавить лайк
  addLike: function(cardId) {
    const likesRef = database.ref('likes/' + cardId);
    likesRef.transaction((current) => {
      return (current || 0) + 1;
    });
  },
  
  // Убрать лайк
  removeLike: function(cardId) {
    const likesRef = database.ref('likes/' + cardId);
    likesRef.transaction((current) => {
      return Math.max(0, (current || 0) - 1);
    });
  },
  
  // Проверить, лайкнул ли пользователь
  hasUserVoted: function(cardId, callback) {
    const userId = this.getUserId();
    database.ref('userVotes/' + userId + '/' + cardId).once('value', (snapshot) => {
      callback(snapshot.val() === true);
    });
  },
  
  // Отметить, что пользователь лайкнул
  setUserVote: function(cardId, voted) {
    const userId = this.getUserId();
    database.ref('userVotes/' + userId + '/' + cardId).set(voted);
  },
  
  // Получить уникальный ID пользователя
  getUserId: function() {
    let userId = localStorage.getItem('firebase_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('firebase_user_id', userId);
    }
    return userId;
  }
};

console.log('✅ Firebase initialized');
