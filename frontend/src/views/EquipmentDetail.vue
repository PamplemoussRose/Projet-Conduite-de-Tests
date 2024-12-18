<template>
  <div class="equipment-detail-page">
    <button class="back-button" @click="goToPage">Back</button>
    <button @click="logout" class="logout-button">Logout</button>
    <h1>{{ equipmentData.nomMateriel }}</h1>
    <img :src="equipmentData.photoMateriel" alt="Equipment Image" class="equipment-image" />

    <div class="equipment-info">
      <p><strong>Version:</strong> {{ equipmentData.versionMateriel }}</p>
      <p><strong>Reference:</strong> {{ equipmentData.referenceMateriel }}</p>
      <p><strong>Phone number:</strong> {{ equipmentData.numeroTelephoneMateriel }}</p>
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
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

export default {
  data() {
    return {
      loginRole: '',
      beginDate: '',
      endDate: '',
      equipmentData: {
        nomMateriel: '',
        photoMateriel: '',
        versionMateriel: '',
        referenceMateriel: '',
        numeroTelephoneMateriel: '',
      }
    };
  },

  async mounted() {
    if (auth.currentUser == null) {
      window.location.href = 'http://localhost:3000/';
    }

    const response = await axios.get(`http://localhost:3000/get-role?email=${auth.currentUser.email}`, {
      withCredentials: true,
    });

    this.loginRole = response.data.data;
    if (this.loginRole !== "ADMINISTRATEUR" && this.loginRole !== "EMPRUNTEUR") {
      window.location.href = 'http://localhost:8080/equipment-page';
    }

    const getdata = await axios.get(`http://localhost:3000/equipment-detail/data/${this.$route.params.id}`);
    this.equipmentData = getdata.data.data;
  },

  methods: {
    async logout() {
      alert("Logged out!");
      await signOut(auth);
      window.location.href = `http://localhost:3000/user-login`;
    },
    goToPage() {
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
  