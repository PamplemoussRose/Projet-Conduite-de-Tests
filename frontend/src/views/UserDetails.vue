<template>
  <div class="form-container" v-if="user">
    <div class="form-group">
      <label for="lastname">Lastname</label>
      <input type="text" id="lastname" v-model="user.lastName" placeholder="Lastname" />
    </div>

    <div class="form-group">
      <label for="firstname">Firstname</label>
      <input type="text" id="firstname" v-model="user.firstName" placeholder="Firstname" />
    </div>

    <div class="form-group">
      <label for="id">Id</label>
      <input type="text" id="id" v-model="user.id" placeholder="Id" disabled />
    </div>

    <div class="form-group">
      <label for="role">Admin</label>
      <select id="role" v-model="user.role">
        <option>User</option>
        <option>Admin</option>
      </select>
    </div>

    <div class="button-group">
      <button @click="modifyUser" class="modify-button">Modify</button>
      <button @click="deleteUser" class="delete-button">Delete</button>
    </div>
  </div>

  <div v-else>
    <p>User not found. Redirecting...</p>
  </div>

</template>

<script>
import {auth} from "@/firebase";
import {signOut} from "firebase/auth";

export default {
  props: ['id'],
  data() {
    return {
      users: [
        { id: '001', firstName: 'Jaafar', lastName: 'Ghiffi', role: 'User' },
        { id: '002', firstName: 'Thomas', lastName: 'Vanwalleghem', role: 'User' },
        { id: '003', firstName: 'Chaaibi', lastName: 'Chaimae', role: 'User' },
        { id: '004', firstName: 'Clara', lastName: 'Rouxel', role: 'User' },
        { id: '004', firstName: 'Laumonier', lastName: 'Robbin', role: 'User' },
        { id: '004', firstName: 'N \'Kouba', lastName: 'Humbert', role: 'User' },
      ],
      user: `001`,
    };
  },

  methods: {
    goToPage() {
      // Redirige vers une autre page avec l'URL "/other-page"
      window.location.href = `http://localhost:3000/user-management`;
    },
    modifyUser() {
      alert(`User ${this.user.firstName} ${this.user.lastName} modified!`);
    },
    deleteUser() {
      if (confirm(`Are you sure you want to delete ${this.user.firstName} ${this.user.lastName}?`)) {
        alert(`User ${this.user.firstName} ${this.user.lastName} deleted!`);
        this.$router.push('/manage-users');
      }
    },
    async logout() {
      // Debug pour deconnection (ou pas)
      alert("Logged out!");
      await signOut(auth);
      window.location.href = `http://localhost:3000/user-login`;
    },
  },
  mounted() {
     if(auth.currentUser == null){
       window.location.href = 'http://localhost:3000/';
     }
  }
};
</script>

<style scoped>
.user-details-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button,
.logout-button {
  padding: 10px 20px;
  font-size: 14px;
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover,
.logout-button:hover {
  background-color: #3700b3;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input:disabled {
  background-color: #e9e9e9;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modify-button,
.delete-button {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modify-button {
  background-color: #4caf50;
  color: white;
}

.modify-button:hover {
  background-color: #388e3c;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>

