<template>
  <div class="equipment-page">
    <header class="equipment-page-header">
      <h1 class="title">Equipment</h1>
      <button class="back-button" v-if="loginRole === 'ADMINISTRATEUR'" @click="handleButtonClick">Back</button>
      <button class="logout-button" v-if="loginRole === 'EMPRUNTEUR'" @click="logout">Logout</button>
      <button class="login-button" v-if="loginRole === 'OFFLINE'" @click="login">Login</button>

    </header>

    <button class="add-equipment-button" v-if="loginRole === 'ADMINISTRATEUR'" @click="goToAddEquipment">Add Equipment</button>

    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Search" class="search-bar" />
    </div>

    <div class="equipment-table">
      <table>
        <thead>
        <tr>
          <th>Image</th>
          <th>Equipment Name</th>
          <th v-if="loginRole === 'ADMINISTRATEUR'">Modify</th>
          <th v-if="loginRole === 'ADMINISTRATEUR'">Delete</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(equipment, index) in equipment" :key="index" @click="loginRole !== 'OFFLINE' && goToEquipmentDetail(equipment.IdMateriel)" class="clickable-row">
          <td>
            <img :src="equipment.photoMateriel" alt="Equipment Image" class="equipment-image" />
          </td>
          <td>{{ equipment.nomMateriel }}</td>
          <td v-if="loginRole === 'ADMINISTRATEUR'">
            <button class="add-button" @click.stop="Actionmodify(equipment.IdMateriel)">Modify</button>
          </td>
          <td v-if="loginRole === 'ADMINISTRATEUR'">
            <button class="add-button" @click.stop="Actiondelete(equipment.IdMateriel)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
  import axios from "axios";
  import {auth} from "@/firebase";
  import {signOut} from "firebase/auth";

  export default {
    data() {
      return {
        searchQuery: "",
        loginRole: "",
        equipment: [],
      };
    },
    computed: {
      buttonText() {
        if (this.status === "offline") return "Log In";
        if (this.status === "user") return "Log Out";
        return "Back";
      },
    },
    methods: {
      async logout() {
        // Debug pour deconnection (ou pas)
        alert("Logged out!");
        await signOut(auth);
        window.location.href = `http://localhost:3000/user-login`;
      },
      login(){
        window.location.href = `http://localhost:3000/user-login`;
      },
      Actionmodify(modifyId) {
        window.location.href = (`http://localhost:3000/equipment-modify/${modifyId}`)
      },
      async Actiondelete(deleteId) {
        try {
          const response = await axios.delete(`http://localhost:3000/equipment-page/${deleteId}`);
          console.log('Deleted successfully:', response.data);
        } catch (error) {
          console.error('Error deleting equipment:', error);
        }
        window.location.href = "http://localhost:3000/equipment-page";
      },
      handleButtonClick() {
        try {
          window.location.href = 'http://localhost:3000/admin-dashboard';
        } catch (error) {
          console.error('Erreur lors de la redirection :', error);
        }
      },
      goToEquipmentDetail(equipmentId) {
        window.location.href = `http://localhost:3000/equipment-detail/${equipmentId}`;
      },
      goToAddEquipment(){
        window.location.href = `http://localhost:3000/equipment-add`;
      },
      getEquipmentData() {
        axios.get('http://localhost:3000/equipment-page/data')
            .then(response => {
              this.equipment = response.data.data; // Utilise les données directement sans transformation
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des données :', error);
            });
      }
    },
    async mounted() {
      if (auth.currentUser == null) {
        this.loginRole = "OFFLINE";
      }else{
        const response = await axios.get(`http://localhost:3000/get-role?email=${auth.currentUser.email}`, {
          withCredentials: true, // Important si vous utilisez credentials dans CORS
        });

        // Récupérer le rôle de l'utilisateur depuis la réponse
        this.loginRole = response.data.data; // Le rôle est dans `data` selon ton backend
      }

      this.getEquipmentData();
    }
  };
  </script>
  
  <style scoped>

  .equipment-page {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow:  -26px 26px 52px #c0b8cf,
  26px -26px 52px #fffaff;
  }
  
  .equipment-page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .back-button {
    background-color: #B18FCF;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .back-button:hover {
    background-color: #978897;
  }


  .logout-button , .login-button , .add-equipment-button {
    background-color: #B18FCF;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .logout-button:hover , .login-button:hover , add-equipment-button{
    background-color: #978897;
  }

  .add-button {
    border: none;
    color: #fff;
    background-image: linear-gradient(30deg, #7D5C97, #A693C4);
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
    -webkit-animation: pulse 1.5s infinite;
    animation: pulse 1.5s infinite;
  }


  .search-container {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }
  
  .search-bar {
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
    max-width: 400px;
  }
  
  .equipment-table {
    overflow-y: auto;
    max-height: 400px;
    border: 1px solid #ccc;
    background-color: #FFFFFF;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #e8e8ff;
  }
  
  .equipment-image {
    width: 80px;
    height: 80px;
  }
  
  .clickable-row {
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .clickable-row:hover {
    background-color: #f9f9ff;
  }
  
  .debug-controls {
    margin-top: 2rem;
    text-align: center;
  }
  
  .debug-controls label {
    margin: 0 10px;
    font-size: 0.9rem;
    color: #494850;
  }
  </style>


