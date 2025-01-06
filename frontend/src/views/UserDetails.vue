<template>
  <div class="user-detail-page">
    <header class="user-detail-header">
      <h1 class="page-title">User Detail</h1>
      <div class="header-buttons">
        <button @click="goBack" class="back-button">Back</button>
        <button @click="logout" class="logout-button">Log Out</button>
      </div>
    </header>

    <div class="user-detail-content">
      <div class="user-info">
        <p><strong>Lastname:</strong> {{ user.nomUtilisateur }}</p>
        <p><strong>Firstname:</strong> {{ user.prenomUtilisateur }}</p>
        <p><strong>Email:</strong> {{ user.emailUtilisateur }}</p>
        <p><strong>Id:</strong> {{ userId }}</p>
        <p><strong>Role:</strong> {{ user.roleUtilisateur }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default {
  props: ["id"],
  data() {
    return {
      userId: this.id,
      user: {},
    };
  },
  mounted() {
    fetch(`http://localhost:3000/user-details/${this.userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching user details");
        }
        return response.json();
      })
      .then((data) => {
        this.user = {
          nomUtilisateur: data.nomUtilisateur,
          prenomUtilisateur: data.prenomUtilisateur,
          roleUtilisateur: data.roleUtilisateur,
          emailUtilisateur: data.emailUtilisateur,
        };
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  },
  methods: {
    goBack() {
      this.$router.push("/user-management");
    },
    async logout() {
      alert("Logged out!");
      await signOut(auth);
      window.location.href = "http://localhost:3000/user-login";
    },
  },
};
</script>

<style scoped>
.user-detail-page {
  width: 900px;
  height: 100%;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow: -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}

.user-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  color: #494850;
}

.header-buttons {
  display: flex;
  gap: 1rem;
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

.user-detail-content {
  text-align: center;
  
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

.logout-button {
  background-color: #b18fcf;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #978897;
}

.back-button {
  background-color: #b18fcf;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #978897;
}
</style>
