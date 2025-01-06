<template>
  <div class="login-page">
    <div class="login">
      <h2>Login</h2>
      <form @submit.prevent="submitLogin">
        <div>
          <label for="email">Email</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" v-model="password" id="password" required />
        </div>

        <button type="submit">Log In</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      <div class="forgot-password">
        <span class="tooltip">Forgotten password?</span>
        <span class="tooltip-text">Contact administrators at user@email.com</span>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      success: '',
      loginRole: ''
    };
  },
  methods: {
        async submitLogin() {
      try {
        // Authentification de l'utilisateur
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user; // Objet utilisateur connecté

        if (user) {
          try {
            // Envoi de la requête pour récupérer le rôle
            const response = await axios.get(`http://localhost:3000/get-role?email=${this.email}`, {
              withCredentials: true, // Important si vous utilisez credentials dans CORS
            });

            // Récupérer le rôle de l'utilisateur depuis la réponse
            const role = response.data.data; // Le rôle est dans `data` selon ton backend

            // Rediriger selon le rôle
            if (role === 'ADMINISTRATEUR') {
              window.location.href = "http://localhost:3000/admin-dashboard";
            } else if (role) {
              window.location.href = "http://localhost:3000/equipment-page";
            } else {
              this.error = "Failed to retrieve user role. Please contact support.";
            }
          } catch (error) {
            console.error("Error fetching role:", error.message);
            this.error = "Network error. Please try again later.";
          }
        }
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          this.error = "No user found with this email.";
        } else if (error.code === 'auth/wrong-password') {
          this.error = "Incorrect password.";
        } else if (error.code === 'auth/too-many-requests') {
          this.error = "Too many login attempts. Please try again later.";
        } else {
          console.error("Unknown error during login:", error.message);
          this.error = "An unexpected error occurred. Please try again.";
        }
      }
    },
  }
};
</script>

<style>
body {
  background-color: #e2e2ff;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.login-page {
  width: 900px;
  height: 100%;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow:  -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}
</style>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 95%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #978897;
  border-radius: 5px;
  background-color: white;
}

button {
  border: none;
  color: #fff;
  background-image: linear-gradient(30deg, #7D5C97, #A693C4); 
  border-radius: 20px;
  background-size: 100% auto;
  font-family: inherit;
  font-size: 17px;
  padding: 0.6em 1.5em;
  cursor: pointer;
  transition: background-size 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
  background-position: right center;
  background-size: 200% auto;
  -webkit-animation: pulse 1.5s infinite;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(125, 92, 151, 0.5); 
  }
  70% {
    box-shadow: 0 0 0 10px rgba(125, 92, 151, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(125, 92, 151, 0);
  }
}


.error {
  color: #494850;
  margin-top: 1rem;
}

.success {
  border: 1px solid #ccc;
  margin-top: 1rem;
}

.forgot-password {
  margin-top: 1rem;
  text-align: left;
  font-size: 0.9rem;
  position: relative;
}

.tooltip {
  color: #494850;
  cursor: pointer;
  text-decoration: underline;
}

.tooltip-text {
  visibility: hidden;
  background-color: #494850;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.8rem;
}

.tooltip:hover + .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.debug-controls {
  margin-bottom: 1rem;
  text-align: center;
}

.debug-label {
  font-size: 0.9rem;
  color: #494850;
  margin-bottom: 0.5rem;
}

.debug-controls label {
  margin: 0 10px;
  font-size: 0.9rem;
  color: #494850;
}
</style>
