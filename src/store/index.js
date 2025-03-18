import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';

export default createStore({
  plugins: [createPersistedState()],
  state: {
    user: null,
    authToken: null,
    isAuthenticated: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token;
    },
    SET_AUTH_STATUS(state, status) {
      state.isAuthenticated = status;
    }
  },
  actions: {
    async register({ commit }, { email, password, userData }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        
        const userDataWithId = { 
          ...userData, 
          uid: user.uid,
          createdAt: new Date().toISOString()
        };

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userDataWithId));
        localStorage.setItem('token', token);
        
        commit('SET_USER', userDataWithId);
        commit('SET_AUTH_TOKEN', token);
        commit('SET_AUTH_STATUS', true);
        
        return userDataWithId;
      } catch (error) {
        throw error;
      }
    },
    
    async login({ commit }, { email, password }) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        
        // Get user data from database
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        if (!userData) {
          throw new Error('User data not found');
        }

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        commit('SET_USER', userData);
        commit('SET_AUTH_TOKEN', token);
        commit('SET_AUTH_STATUS', true);
        
        return userData;
      } catch (error) {
        throw error;
      }
    },
    
    async logout({ commit }) {
      try {
        await signOut(auth);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        commit('SET_USER', null);
        commit('SET_AUTH_TOKEN', null);
        commit('SET_AUTH_STATUS', false);
        return true;
      } catch (error) {
        throw error;
      }
    }
  }
});

// import { createStore } from 'vuex';
// import createPersistedState from 'vuex-persistedstate';
// import { auth } from '../firebase';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut
// } from 'firebase/auth';
// import { database } from '../firebase';
// import { ref as dbRef, get, set } from 'firebase/database'; // ✅ استيراد set

// export default createStore({
//   plugins: [createPersistedState()],
//   state: {
//     user: null,
//     authToken: null,
//     isAuthenticated: false
//   },
//   mutations: {
//     SET_USER(state, user) {
//       state.user = user;
//     },
//     SET_AUTH_TOKEN(state, token) {
//       state.authToken = token;
//     },
//     SET_AUTH_STATUS(state, status) {
//       state.isAuthenticated = status;
//     }
//   },
//   actions: {
//     async register({ commit }, { email, password, userData }) {
//       try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         const token = await user.getIdToken();

//         // const userDataWithId = {
//         //   ...userData,
//         //   uid: user.uid,
//         //   createdAt: new Date().toISOString()
//         // };
//         const userDataWithId = {
//           ...userData,
//           uid: user.uid,
//           createdAt: new Date().toISOString(),
//           attemptedQuizzes: ['init'],
//           // ✅ اضفها هنا بشكل مؤكد
//           overallScore: 0,
//           quizzesToTake: 5
//         };
//         console.log('Data to be saved in DB:', userDataWithId);

//         // ✅ حفظ بيانات المستخدم في Realtime Database
//         await set(dbRef(database, `users/${user.uid}`), userDataWithId);

//         // Store in localStorage
//         localStorage.setItem('user', JSON.stringify(userDataWithId));
//         localStorage.setItem('token', token);

//         commit('SET_USER', userDataWithId);
//         commit('SET_AUTH_TOKEN', token);
//         commit('SET_AUTH_STATUS', true);

//         return userDataWithId;
//       } catch (error) {
//         throw error;
//       }
//     },

   
//     async login({ commit }, { email, password }) {
//       try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         const token = await user.getIdToken();
    
//         // Get user data from database
//         const userRef = dbRef(database, `users/${user.uid}`);
//         const snapshot = await get(userRef);
//         const userData = snapshot.val();
    
//         if (!userData) {
//           throw new Error('User data not found');
//         }
    
//         // ✅ Remove the fake 'init' value if it exists
//         if (Array.isArray(userData.attemptedQuizzes) && userData.attemptedQuizzes[0] === 'init') {
//           const fakeItemRef = dbRef(database, `users/${user.uid}/attemptedQuizzes/0`);
//           await remove(fakeItemRef);
//           userData.attemptedQuizzes = []; // لتحديث الـ localStorage والـ state بدون init
//         }
    
//         // Store in localStorage
//         localStorage.setItem('user', JSON.stringify(userData));
//         localStorage.setItem('token', token);
    
//         commit('SET_USER', userData);
//         commit('SET_AUTH_TOKEN', token);
//         commit('SET_AUTH_STATUS', true);
    
//         return userData;
//       } catch (error) {
//         throw error;
//       }
//     },
    
//     async logout({ commit }) {
//       try {
//         await signOut(auth);
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//         commit('SET_USER', null);
//         commit('SET_AUTH_TOKEN', null);
//         commit('SET_AUTH_STATUS', false);
//         return true;
//       } catch (error) {
//         throw error;
//       }
//     }
//   }
// });
