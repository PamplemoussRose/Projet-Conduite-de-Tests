<template>
    <div class="equipment-detail-page">
      <button class="back-button" @click="goToPage">Back</button>
      <button @click="logout" class="logout-button">Logout</button>
      <h1>{{ equipment.name }}</h1>
      <img :src="equipment.image" alt="Equipment Image" class="equipment-image" />
  
      <div class="equipment-info">
        <p><strong>Version:</strong> {{ equipment.version }}</p>
        <p><strong>Reference:</strong> {{ equipment.reference }}</p>
        <p><strong>Phone number:</strong> {{ equipment.phoneNumber }}</p>
      </div>
  
      <div class="date-selection">
        <label for="begin-date">Begin:</label>
        <input type="date" id="begin-date" v-model="beginDate" />
        <label for="end-date">End:</label>
        <input type="date" id="end-date" v-model="endDate" />
      </div>

      <button class="borrow-button" @click="post">Borrow</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {auth} from "@/firebase";
  import {signOut} from "firebase/auth";

  export default {
    data() {
      return {
        loginRole: '',
        equipment: {
          id: null,
          name: "",
          image: "https://via.placeholder.com/300",
          version: "1.0",
          reference: "XYZ123",
          phoneNumber: "123-456-7890",
        },
        beginDate: "",
        endDate: "",
      };
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

      const equipmentId = this.$route.params.id;
      axios.get(`http://localhost:3000/equipment-detail/${equipmentId}`)
          .then(response => {
            console.log(response.data); // Vérifier la réponse
            this.equipment.id = response.data.id; // Mettre à jour l'ID dans les données de l'équipement
          })
          .catch(error => console.error('Erreur :', error));
    },


    methods: {
      async logout() {
        // Debug pour deconnection (ou pas)
        alert("Logged out!");
        await signOut(auth);
        window.location.href = `http://localhost:3000/user-login`;
      },
      goToPage() {
        // Redirige vers une autre page avec l'URL "/other-page"
        window.location.href = `http://localhost:3000/equipment-page`;
      },
      post() {
        axios.post('http://localhost:3000/equipment-page', {
          key: 'value'
        })
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.error('Erreur :', error);
            });
      }
    }
  };
  </script>
  
  <style scoped>
  .equipment-detail-page {
    max-width: 800px;
    margin: auto;
    padding: 2rem;
    border-radius: 32px;
    background: linear-gradient(225deg, #f2e8ff, #cbc3db);
    box-shadow:  -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
  }
  
  .back-button {
    background-color: #b18fcf;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 1rem;
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


  .equipment-title {
    text-align: center;
    font-size: 1.5rem;
    color: #494850;
    margin-bottom: 1rem;
  }
  
  .equipment-content {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .equipment-image {
    width: 120px;
    height: 120px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .equipment-info p {
    margin: 0.25rem 0;
  }
  
  .date-selection {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .date-selection label {
    font-weight: bold;
    margin-right: 0.5rem;
  }
  
  input[type="date"] {
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .borrow-button {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-top: 1rem;
    background-color: #b18fcf;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .borrow-button:hover {
    background-color: #978897;
  }
  </style>
  