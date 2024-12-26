<template>
  <div class="user-modify-page">
    <h2 class="page-title">UserModify</h2>
    <div class="user-modify">
      <div class="header">
        <button @click="cancel" class="cancel-button">Cancel</button>
        <button @click="logout" class="logout-button">Log Out</button>
      </div>

      <form @submit.prevent="submitModify">
        <div class="form-group">
          <label for="lastname">Lastname</label>
          <input type="text" id="lastname" v-model="lastname" placeholder="Lastname" required />
        </div>
        <div class="form-group">
          <label for="firstname">Firstname</label>
          <input type="text" id="firstname" v-model="firstname" placeholder="Firstname" required />
        </div>
        <div class="form-group">
          <label for="id">Id</label>
          <input type="text" id="id" :value="id" readonly />
        </div>
        <div class="form-group">
          <label for="role">Rôle</label>
          <select id="role" v-model="role">
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        <button type="submit" class="modify-button">Modify</button>
      </form>
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
      lastname: "",
      firstname: "",
      role: "User",
    };
  },
  methods: {
    cancel() {
      this.$router.push(`/user-details/${this.id}`);
    },
    async logout() {
      // Debug pour deconnection (ou pas)
      alert("Logged out!");
      await signOut(auth);
      window.location.href = `http://localhost:3000/user-login`;
    },
    submitModify() {
      // Logique pour envoyer les modifications via une requête PUT
      console.log("Form submitted:", this.lastname, this.firstname, this.id, this.role);
    },
  },
};
</script>

<style>
body {
  background-color: #e2e2ff;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.user-modify-page {
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

.user-modify {
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

form {
  text-align: left;
  margin: 1rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #494850;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.2rem;
  border: 1px solid #978897;
  border-radius: 5px;
  background-color: white;
}

.modify-button {
  background-color: #4CAF50;
}
</style>
