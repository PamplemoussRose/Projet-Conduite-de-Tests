<template>
    <div class="equipment-detail-page">
      <button class="back-button" @click="goToPage">Back</button>
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
  export default {
    data() {
      return {
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
    mounted() {
      const equipmentId = this.$route.params.id;
      fetch(`http://localhost:3000/equipment-detail/${equipmentId}`)
          .then(response => response.json())
          .then(data => {
            console.log(data); // Vérifier la réponse
            this.equipment.id = data.id; // Mettre à jour l'ID dans les données de l'équipement
          })
          .catch(error => console.error('Erreur :', error));
    },

    methods: {
      goToPage() {
        // Redirige vers une autre page avec l'URL "/other-page"
        window.location.href = `http://localhost:3000/equipment-page`;
      },
      post() {
          fetch('http://localhost:3000/equipment-page', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'value' })
          })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch(error => console.error('Erreur :', error));

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
  