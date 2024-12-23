<template>
  <div class="user-detail-page">
    <h2 class="page-title">UserDetail</h2>
    <div class="user-detail">
      <div class="header">
        <button @click="goBack" class="back-button">Back</button>
        <button @click="logout" class="logout-button">Log Out</button>
      </div>

      <div class="user-info">
        <p><strong>Lastname:</strong> {{ lastname }}</p>
        <p><strong>Firstname:</strong> {{ firstname }}</p>
        <p><strong>Id:</strong> {{ userId }}</p>
        <p><strong>Rôle:</strong> {{ role }}</p>
      </div>

      <div class="actions">
        <button @click="modifyUser" class="modify-button">Modify</button>
        <button @click="deleteUser" class="delete-button">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastname: "Doe",
      firstname: "John",
      userId: "12345",
      role: "User",
    };
  },
  methods: {
    goBack() {
      // Logique pour revenir à la page précédente
      console.log("Back button clicked");
    },
    logout() {
      // Logique pour se déconnecter
      console.log("Log Out button clicked");
    },
    modifyUser() {
      // Logique pour modifier les informations de l'utilisateur
      console.log("Modify button clicked");
    },
    deleteUser() {
      // Logique pour supprimer l'utilisateur
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
