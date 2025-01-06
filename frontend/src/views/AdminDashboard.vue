<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1 class="title">Welcome, Administrator</h1>
      <button @click="logout" class="logout-button">Log Out</button>
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
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import {auth} from "@/firebase";
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      loginRole: '',
    };
  },
  methods: {
    async logout() {
      await signOut(auth);
      window.location.href = `http://localhost:3000/user-login`;
    },
    navigateTo(route) {
      router.push(route);
    },
  },
  async mounted() {
    if (auth.currentUser == null) {
      window.location.href = 'http://localhost:3000/';
    }
    const response = await axios.get(`http://localhost:3000/get-role?email=${auth.currentUser.email}`, {
      withCredentials: true,
    });

    // Récupérer le rôle de l'utilisateur depuis la réponse
    this.loginRole = response.data.data; 
    if (this.loginRole !== "ADMINISTRATEUR") {
        window.location.href = 'http://localhost:8080/equipment-page';
    }
  }
};
</script>

<style scoped>
.dashboard {
  width: 900px;
  height: 100%;
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
.title {
  font-size: 1.8rem;
  color: #494850;
  margin-bottom: 1rem;
}

.logout-button {
  border: none;
  color: #fff;
  background-image: linear-gradient(30deg, #7D5C97, #A693C4);
  border-radius: 5px;
  font-family: inherit;
  font-size: 17px;
  padding: 0.6em 1.5em;
  cursor: pointer;
  transition: background-size 0.3s ease, box-shadow 0.3s ease;
}

.logout-button:hover {
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

</style>