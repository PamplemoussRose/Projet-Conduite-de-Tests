<template>
    <div class="equipment-page">
      <header class="equipment-page-header">
        <h1 class="title">Equipment</h1>
        <button class="back-button" @click="handleButtonClick">{{ buttonText }}</button>
        <button @click="logout" class="logout-button">Logout</button>
      </header>
  
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Search" class="search-bar" />
      </div>
  
      <div class="equipment-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Equipment Name</th>
              <th>Modify</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(equipment, index) in filteredEquipment" :key="index" @click="goToEquipmentDetail(equipment.id)" class="clickable-row">
              <td><img :src="equipment.image" alt="Equipment Image" class="equipment-image" /></td>
              <td>{{ equipment.name }}</td>
              <td><button class="add-button" @click.stop="Actionmodify(equipment.id)">Modify</button></td>
              <td><button class="add-button" @click.stop="Actiondelete(equipment.id)">Delete</button></td>
            </tr>

          </tbody>
        </table>
      </div>
  
      <!-- Debug -->
      <h1 class="debug-label">Pour debug le front</h1>
      <div class="debug-controls">
        <label>
          <input type="radio" value="offline" v-model="status" /> Offline
        </label>
        <label>
          <input type="radio" value="user" v-model="status" /> User
        </label>
        <label>
          <input type="radio" value="admin" v-model="status" /> Admin
        </label>
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
        status: "admin",
        equipment: [],
      };
    },
    computed: {
      filteredEquipment() {
        return this.equipment.filter((equipment) =>
            equipment.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
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
      Actionmodify(modifyId) {
        window.location.href = (`http://localhost:3000/equipment-page/${modifyId}`)
      },
      Actiondelete(deleteId) {
        axios.delete(`http://localhost:3000/equipment-page/${deleteId}`)
            .then(response => {
              if (response.status === 200) {
                console.log('Suppression réussie');
              } else {
                console.error('Erreur lors de la suppression');
              }
            })
            .catch(error => console.error('Erreur réseau :', error));

        console.log(this.equipment);
      },
      handleButtonClick() {
        try {
          window.location.href = 'http://localhost:3000/user-login';
        } catch (error) {
          console.error('Erreur lors de la redirection :', error);
        }
      },
      goToEquipmentDetail(equipmentId) {
        window.location.href = `http://localhost:3000/equipment-detail/${equipmentId}`;
      },

      getEquipmentData() {
        axios.get('http://localhost:3000/equipment-page/data')
            .then(response => {
              this.equipment = response.data;
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des données :', error);
            });
      },
    },
    mounted() {
      if(auth.currentUser == null) {
        window.location.href = 'http://localhost:3000/';
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


