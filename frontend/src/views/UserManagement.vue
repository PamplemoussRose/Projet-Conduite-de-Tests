<template>
  <div class="user-management-container">
    <header class="user-management-header">
      <h1 class="title">Users Management</h1>
      <button class="back-button" @click="goToPage">Back</button>
      <button @click="logout" class="logout-button">Logout</button>
    </header>

    <div class="user-management">
      <!-- Formulaire pour ajouter un utilisateur -->
      <div class="user-form">
        <h3 class="section-title">Add User</h3>
        <div class="form-field">
          <input type="text" v-model="newUser.firstName" placeholder="FirstName" />
          <input type="text" v-model="newUser.lastName" placeholder="LastName" />
        </div>
        <div class="form-field">
          <input type="email" v-model="newUser.email" placeholder="E-mail" />
        </div>
        <div class="form-field">
          <label for="role">Role</label>
          <select v-model="newUser.role" id="role">
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button @click="addUser" class="add-button">Add User</button>
      </div>

      <!-- Tableau d'utilisateurs -->
      <div class="user-table">
        <table>
          <thead>
          <tr>
            <th>LastName</th>
            <th>Id</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td @click="goToUserDetails(user.idUtilisateur)" style="cursor: pointer;">
              {{ user.nomUtilisateur }}
            </td>
            <td>{{ user.idUtilisateur }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import { auth } from "../firebase";
import axios from "axios";
import { signOut } from "firebase/auth";

export default {
  data() {
    return {
      newUser: {
        firstName: "",
        lastName: "",
        email: "",
        role: "",
      },
      errorMessage: "",
      users: [],
    };
  },
  methods: {
    async logout() {
      alert("Logged out!");
      await signOut(auth);
      window.location.href = `http://localhost:3000/user-login`;
    },
    goToPage() {
      window.location.href = "http://localhost:3000/admin-dashboard";
    },
    async addUser() {
      try {
        const response = await axios.post("http://localhost:3000/user-management", {
          firstName: this.newUser.firstName,
          lastName: this.newUser.lastName,
          email: this.newUser.email,
          role: this.newUser.role,
        });

        // Réinitialiser le formulaire
        this.newUser = {
          firstName: "",
          lastName: "",
          email: "",
          role: "",
        };

        alert(response.data.message); // Afficher le message du backend
        this.getUserData(); // Mettre à jour la liste des utilisateurs
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        this.errorMessage = error.response?.data?.message || "Une erreur s'est produite.";
      }
    },
    getUserData() {
      axios
          .get("http://localhost:3000/user-management/data")
          .then((response) => {
            this.users = response.data.data;
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des données :", error);
          });
    },
    goToUserDetails(userId) {
      window.location.href = `http://localhost:3000/user-details/${userId}`;
    },
  },
  async mounted() {
    if (auth.currentUser == null) {
      window.location.href = "http://localhost:3000/";
    }

    const response = await axios.get(
        `http://localhost:3000/get-role?email=${auth.currentUser.email}`,
        {
          withCredentials: true,
        }
    );

    this.loginRole = response.data.data;
    if (this.loginRole !== "ADMINISTRATEUR") {
      window.location.href = "http://localhost:8080/equipment-page";
    }

    this.getUserData();
  },
};
</script>


<style scoped>
/* Vos styles restent inchangés */
.user-management-container {
  max-width: 800px;
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

.title {
  font-size: 1.8rem;
  color: #494850;
  margin-bottom: 1rem;
}

.user-management {
  display: flex;
  justify-content: space-between;
}

.user-form {
  flex: 1;
  max-width: 300px;
  margin-right: 2rem;
}

.section-title {
  font-size: 1.2rem;
  color: #494850;
  margin-bottom: 1rem;
  text-align: center;
}

.form-field {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.add-button {
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

.add-button:hover {
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

.user-table {
  flex: 2;
  max-width: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #e8e8ff;
}

tr:hover {
  background-color: #f9f9ff;
}
</style>
