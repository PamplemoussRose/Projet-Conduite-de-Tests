<template>
  <div class="user-detail-page">
    <h2 class="page-title">UserDetail</h2>
    <div class="user-detail">
      <div class="header">
        <button @click="goBack" class="back-button">Back</button>
        <button @click="logout" class="logout-button">Log Out</button>
      </div>

      <div class="user-info">
        <p><strong>Lastname:</strong> {{ user.nomUtilisateur }}</p>
        <p><strong>Firstname:</strong> {{ user.prenomUtilisateur }}</p>
        <p><strong>Id:</strong> {{ userId }}</p>
        <p><strong>Rôle:</strong> {{ user.roleUtilisateur }}</p>
      </div>

      <div class="actions">
        <button @click="modifyUser" class="modify-button">Modify</button>
        <button @click="deleteUser" class="delete-button">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import {signOut} from "firebase/auth";
import {auth} from "@/firebase";

export default {
  props: ['id'],
  data() {
    return {
      userId: this.id,
      user: {}, // Stocker les données utilisateur
    };
  },
  mounted() {
    // Appelle l'API pour récupérer les données utilisateur
    fetch(`http://localhost:3000/user-details/${this.userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données utilisateur');
          }
          return response.json();
        })
        .then(data => {
          this.user = data;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
        });
  },
  methods: {
    goBack() {
      this.$router.push('/user-management'); // Retour à la page précédente
    },
    async logout() {
      // Debug pour deconnection (ou pas)
      alert("Logged out!");
      await signOut(auth);
      window.location.href = `http://localhost:3000/user-login`;
    },
    modifyUser() {
      this.$router.push(`/user-modify/${this.id}`);
    },
    deleteUser() {
      console.log("Delete button clicked");
    },
  },
};
</script>

<style>
body {
  background-color: #e2e2ff;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.user-detail-page {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow: -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}

.page-title {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #494850;
}

.user-detail {
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

button {
  border: none;
  color: #fff;
  background-image: linear-gradient(30deg, #7D5C97, #A693C4);
  border-radius: 20px;
  font-family: inherit;
  font-size: 17px;
  padding: 0.6em 1.5em;
  cursor: pointer;
  transition: background-size 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
  background-position: right center;
  background-size: 200% auto;
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

.user-info {
  text-align: left;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: #494850;
}

.actions {
  display: flex;
  justify-content: space-around;
}

.modify-button {
  background-color: #4CAF50;
}

.delete-button {
  background-color: #F44336;
}
</style>
