<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Welcome, Administrator</h1>
      <button @click="logout" class="logout-button">Logout</button>
    </header>

    <nav class="dashboard-nav">
      <ul>
        <li>
          <button @click="navigateTo('/user-management')" class="nav-button">User Management</button>
        </li>
        <li>
          <button @click="navigateTo('/equipment-page')" class="nav-button">Equipment Management</button>
        </li>
      </ul>
    </nav>

    <section class="dashboard-content">
      <h2>Recent Activity</h2>
      <ul class="activity-list">
        <li v-for="(activity, index) in recentActivities" :key="index">
          {{ activity }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import {auth} from "@/firebase";
import axios from "axios";

export default {
  data() {
    return {
      loginRole: '',
      recentActivities: ["Logged in", "Added new equipment", "Updated user permissions"], // Example activities
    };
  },
  methods: {
    async logout() {
      await signOut(auth);
      window.location.href = `http://localhost:3000/user-login`;
    },
    navigateTo(route) {
      window.location.href = `http://localhost:3000${route}`;
    },
  },
  async mounted() {
    if (auth.currentUser == null) {
      window.location.href = 'http://localhost:3000/';
    }
    const response = await axios.get(`http://localhost:3000/get-role?email=${auth.currentUser.email}`, {
      withCredentials: true, // Important si vous utilisez credentials dans CORS
    });

    // Récupérer le rôle de l'utilisateur depuis la réponse
    this.loginRole = response.data.data; // Le rôle est dans `data` selon ton backend
  }
};
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow: -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-button {
  background-color: #B18FCF;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #978897;
}
.logout-button {
  background-color: #B18FCF;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #978897;
}
.logout-button {
  background-color: #B18FCF;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #978897;
}

.dashboard-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
}

.dashboard-nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
}

.dashboard-nav li {
  width: 100%;
}

.nav-button {
  color: #fff;
  background-image: linear-gradient(135deg, #A48BB7 0%, #B18FCF 50%, #7A5C98 100%);
  border: none;
  border-radius: 20px;
  padding: 0.6em 1.5em;
  font-size: 17px;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: scale 0.2s ease, background-size 0.3s ease, box-shadow 0.3s ease;
  background-size: 100% auto;
  text-align: center;
  width: 80%;
}

.nav-button:hover {
  animation: pulse512 1.5s infinite;
}

.nav-button:active {
  scale: 0.95;
}

@keyframes pulse512 {
  0% {
    box-shadow: 0 0 0 0 rgba(177, 143, 207, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(177, 143, 207, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(177, 143, 207, 0);
  }
}

.dashboard-content {
  margin-top: 1rem;
}

.activity-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.activity-list li {
  background-color: #f1f1fc;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
  color: #2C2C34;
}
</style>