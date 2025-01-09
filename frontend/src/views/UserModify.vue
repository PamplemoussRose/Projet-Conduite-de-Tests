<template>
  <div class="user-modify-container">
    <header class="user-modify-header">
      <h1 class="title">Modify User</h1>
      <div class="header-buttons">
        <button class="back-button" @click="goToPage">Back</button>
        <button class="logout-button" @click="logout">Log Out</button>
      </div>
    </header>

    <div class="user-modify">
      <div class="form">
        <div class="form-field">
          <p>Last Name</p>
          <input type="text" v-model="user.nomUtilisateur" id="lastname" />
        </div>
        <div class="form-field">
          <p>First Name</p>
          <input type="text" v-model="user.prenomUtilisateur" id="firstname" />
        </div>
        <div class="form-field">
          <p>Email</p>
          <input type="email" v-model="user.emailUtilisateur" id="email" />
        </div>
        <div class="form-field">
          <p>Role</p>
          <select v-model="user.roleUtilisateur" id="role">
            <option value="ADMINISTRATEUR">Admin</option>
            <option value="EMPRUNTEUR">User</option>
          </select>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <div class="save-changes-container">
        <button class="modify-button" @click="saveChanges">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import router from "@/router";

export default {
  data() {
    return {
      user: {
        nomUtilisateur: "",
        prenomUtilisateur: "",
        emailUtilisateur: "",
        roleUtilisateur: "User",
      },
      errorMessage: "",
    };
  },
  methods: {
    async loadUser() {
      try {
        const response = await axios.get(`http://localhost:3000/user-details/${this.$route.params.id}`);
        this.user = response.data;
      } catch (error) {
        console.error("Error fetching user details:", error);
        this.errorMessage = "Error loading user details.";
      }
    },
    async saveChanges() {
      try {
          if (!this.user.nomUtilisateur || this.user.nomUtilisateur.trim().length === 0) {
              this.errorMessage = "First name is required.";
              return;
          }

          if (!this.user.prenomUtilisateur || this.user.prenomUtilisateur.trim().length === 0) {
              this.errorMessage = "Last name is required.";
              return;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          
          if (!this.user.emailUtilisateur || !emailRegex.test(this.user.emailUtilisateur)) {
              this.errorMessage = "Invalid email address.";
              return;
          }

          const userPayload = {
              nomUtilisateur: this.user.nomUtilisateur.trim(),
              prenomUtilisateur: this.user.prenomUtilisateur.trim(),
              emailUtilisateur: this.user.emailUtilisateur.trim(),
              roleUtilisateur: this.user.roleUtilisateur,
          };

          await axios.put(`http://localhost:3000/user-modify/${this.$route.params.id}`, userPayload);
          alert("User details updated successfully!");
          this.$router.push("/user-management");
      } catch (error) {
          console.error("Error updating user:", error);
          this.errorMessage = error.response?.data?.message || "Error saving changes. Please try again.";
      }
    },
    goToPage() {
      router.push("/user-management");
    },
    async logout() {
      alert("Logged out!");
      await signOut(auth);
      router.push("/");
    },
  },
  async mounted() {
    await this.loadUser();
  },
};
</script>

<style scoped>
.user-modify-container {
  width: 900px;
  height: 100%;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow: -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}

.user-modify-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.header-buttons {
  display: flex;
  gap: 1rem;
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

.title {
  font-size: 1.8rem;
  color: #494850;
}

.user-modify {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form {
  max-width: 400px;
  margin: 0 auto;
}

.form-field {
  margin-bottom: 1rem;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.save-changes-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.modify-button {
  border: none;
  color: #fff;
  background-image: linear-gradient(30deg, #7d5c97, #a693c4);
  border-radius: 20px;
  font-family: inherit;
  font-size: 17px;
  padding: 0.6em 1.5em;
  cursor: pointer;
  transition: background-size 0.3s ease, box-shadow 0.3s ease;
}

.modify-button:hover {
  background-position: right center;
  background-size: 200% auto;
  animation: pulse 1.5s infinite;
}

.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}

</style>
