<template>
  <div class="user-management-container">
    <header class="user-management-header">
      <h1 class="title">Users Management</h1>
      <div class="header-buttons">
      <button class="back-button" @click="goToPage">Back</button>
      <button class="logout-button" @click="logout">Log Out</button>
      </div>
    </header>

    <div class="tabs">
      <button :class="{ active: activeTab === 'manage' }" @click="activeTab = 'manage'"> Manage Users </button>
      <button :class="{ active: activeTab === 'add' }" @click="activeTab = 'add'"> Add User </button>
    </div>

    <div v-if="activeTab === 'manage'" class="manage-users-tab">
      <div class="table-controls">
        <span>Search by :</span>
        <select v-model="searchCriteria" class="search-criteria-dropdown">
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="email">Email</option>
        </select>
        <input type="text" v-model="searchQuery" placeholder="Search users..." class="search-bar"/>
      </div>
      <div class="table-content">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th v-if="loginRole === 'ADMINISTRATEUR'">Modify</th>
              <th v-if="loginRole === 'ADMINISTRATEUR'">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4">No users found</td>
            </tr>
            <tr
              v-for="(user, index) in filteredUsers" :key="index" @click="goToUserDetails(user.idUtilisateur)" class="clickable-row">
              <td>{{ user.prenomUtilisateur }}</td>
              <td>{{ user.nomUtilisateur }}</td>
              <td>{{ user.emailUtilisateur }}</td>
              <td v-if="loginRole === 'ADMINISTRATEUR'">
                <button class="action-button" @click.stop="modifyUser(user.idUtilisateur)">Modify</button>
              </td>
              <td v-if="loginRole === 'ADMINISTRATEUR'">
                <button class="action-button" @click.stop="deleteUser(user.idUtilisateur)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'add'" class="add-user-tab">
      <div class="user-form">
        <h3 class="section-title">User Details</h3>
        <div class="form-field">
          <input
            type="text"
            v-model="newUser.nomUtilisateur"
            placeholder="First Name"
          />
          <input
            type="text"
            v-model="newUser.prenomUtilisateur"
            placeholder="Last Name"
          />
        </div>
        <div class="form-field">
          <input type="email" v-model="newUser.email" placeholder="E-mail" />
        </div>
        <div class="form-field">
          <input type="text" v-model="newUser.matriculeUtilisateur" placeholder="Matricule (7 characters)" maxlength="7"/>
        </div>
        <div class="form-field">
          <label for="role">Role</label>
          <select v-model="newUser.roleUtilisateur" id="role">
            <option value="ADMINISTRATEUR">Admin</option>
            <option value="EMPRUNTEUR">User</option>
          </select>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button @click="addUser" class="action-button">Add User</button>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebase";
import axios from "axios";
import { signOut } from "firebase/auth";
import router from "@/router";

export default {
  data() {
    return {
      activeTab: "manage",
      newUser: {
        nomUtilisateur: "",
        prenomUtilisateur: "",
        email: "",
        roleUtilisateur: "",
      },
      errorMessage: "",
      users: [],
      searchQuery: "",
      loginRole: "",
      searchCriteria: "firstName",
    };
  },
  computed: {
    filteredUsers() {
      let filtered = this.users;
      const query = this.searchQuery.toLowerCase();

      if (this.searchQuery) {
        switch (this.searchCriteria) {
          case "email":
            filtered = filtered.filter((user) =>
              user.emailUtilisateur.toLowerCase().includes(query)
            );
            break;
          case "firstName":
            filtered = filtered.filter((user) =>
              user.prenomUtilisateur.toLowerCase().includes(query)
            );
            break;
          case "lastName":
            filtered = filtered.filter((user) =>
              user.nomUtilisateur.toLowerCase().includes(query)
            );
            break;
          default:
            break;
        }
      }
      return filtered;
    },
  },
  methods: {
    async logout() {
      alert("Logged out!");
      await signOut(auth);
      window.location.href = "http://localhost:8080";
    },
    goToPage() {
      router.push("/admin-dashboard");
    },
    async addUser() {
      try {
        // Validation du matricule
        if (!this.newUser.matriculeUtilisateur || this.newUser.matriculeUtilisateur.length !== 7) {
          this.errorMessage = "Matricule must be exactly 7 characters.";
          return;
        }

        const response = await axios.post("http://localhost:3000/user-management", this.newUser);

        this.newUser = {
          nomUtilisateur: "",
          prenomUtilisateur: "",
          email: "",
          roleUtilisateur: "",
          matriculeUtilisateur: "",
        };

        alert(response.data.message);
        this.getUserData();
        this.activeTab = "manage";
      } catch (error) {
        console.error("Error adding user:", error);
        this.errorMessage = error.response?.data?.message || "An error occurred.";
      }
    },
    async deleteUser(userId) {
      const confirmed = confirm("Are you sure you want to delete this user?");
      if (!confirmed) return;

      try {
        const response = await axios.delete(`http://localhost:3000/user-management/${userId}`);
        console.log("User deleted:", response.data);
        this.getUserData();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
    modifyUser(userId) {
      this.$router.push(`/user-modify/${userId}`);
    },
    getUserData() {
      axios
        .get("http://localhost:3000/user-management/data")
        .then((response) => {
          this.users = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    goToUserDetails(userId) {
      this.$router.push(`/user-details/${userId}`);
    },
  },
  async mounted() {
    if (!auth.currentUser) {
      window.location.href = "http://localhost:3000/";
    }

    const response = await axios.get(`http://localhost:3000/get-role?email=${auth.currentUser.email}`);
    this.loginRole = response.data.data;

    if (this.loginRole !== "ADMINISTRATEUR") {
      window.location.href = "http://localhost:8080/equipment-page";
    }

    this.getUserData();
  },
};
</script>

<style scoped>
.user-management-container {
  width: 900px;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow: -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}

.user-management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.logout-button,
.back-button {
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

.logout-button:hover,
.back-button:hover {
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

.header-buttons {
  display: flex;
  gap: 1rem;
}

.title {
  font-size: 1.8rem;
  color: #494850;
  margin-bottom: 1rem;
}

.tabs {
  height: 3rem;
  width: 20rem; 
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  background: #5c3a81;
  box-shadow: inset 20px 20px 60px #4e316e, inset -20px -20px 60px #6a4394;
  padding: 1rem 2rem; 
  border-radius: 60px;
  gap: 1rem;
}

.tabs button {
  background-color: #b18fcf;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tabs button.active {
  transform: scale(1.2);
  font-size: 1.1rem;
}

.tabs button:not(.active) {
  transform: scale(0.9);
}


.user-form {
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 10px;
}

.add-user-tab {
  margin-top: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  color: #494850;
  margin-bottom: 1rem;
  text-align: center;
}

.form-field {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}


.action-button {
  border: none;
  color: #fff;
  background-image: linear-gradient(30deg, #7d5c97, #a693c4);
  border-radius: 20px;
  background-size: 100% auto;
  font-family: inherit;
  font-size: 17px;
  padding: 0.6em 1.5em;
  cursor: pointer;
  transition: background-size 0.3s ease, box-shadow 0.3s ease;
}

.action-button:hover {
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

.error {
  color: red;
  font-size: 0.9rem;
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
.table-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
  white-space: nowrap;
}

.search-dropdown {
  margin-right: 1rem;
}

.search-criteria-dropdown {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 140px;
  color: #494850;
  background-color: #f9f9ff;
  transition: box-shadow 0.3s ease;
}

.search-criteria-dropdown:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(125, 92, 151, 0.5);
}
.search-bar {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 400px;
  max-width: 400px;
  background-color: #f9f9ff;
  font-size: 1rem;
  color: #494850;
  transition: box-shadow 0.3s ease;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(125, 92, 151, 0.5);
}

.table-content {
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  overflow-y: auto;
  max-height: 400px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
  word-wrap: break-word;
}

thead th {
  position: sticky;
  top: 0;
  background-color: #e8e8ff;
  z-index: 1;
}

th {
  background-color: #e8e8ff;
}

tr:hover {
  background-color: #f9f9ff;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}
</style>
