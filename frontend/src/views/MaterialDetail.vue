<template>
    <div class="material-detail-page">
      <button class="back-button" @click="$router.go(-1)">Back</button>
      <h1>{{ material.name }}</h1>
      <img :src="material.image" alt="Material Image" class="material-image" />
  
      <div class="material-info">
        <p><strong>Version:</strong> {{ material.version }}</p>
        <p><strong>Reference:</strong> {{ material.reference }}</p>
        <p><strong>Phone number:</strong> {{ material.phoneNumber }}</p>
      </div>
  
      <div class="date-selection">
        <label for="begin-date">Begin:</label>
        <input type="date" id="begin-date" v-model="beginDate" />
        <label for="end-date">End:</label>
        <input type="date" id="end-date" v-model="endDate" />
      </div>
  
      <button class="borrow-button">Borrow</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        material: {
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
      const materialId = this.$route.params.id;
      // Données factices juste pour debug
      if (materialId == 1) {
        this.material = { id: 1, name: "Samsung A10", image: "https://via.placeholder.com/300", version: "A10", reference: "A10-123", phoneNumber: "123-456-7890" };
      } else if (materialId == 2) {
        this.material = { id: 2, name: "Apple iPad", image: "https://via.placeholder.com/300", version: "iPad Pro", reference: "IP-123", phoneNumber: "123-456-7890" };
      }
    },
  };
  </script>
  
  <style scoped>
  .material-detail-page {
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
  
  .material-title {
    text-align: center;
    font-size: 1.5rem;
    color: #494850;
    margin-bottom: 1rem;
  }
  
  .material-content {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .material-image {
    width: 120px;
    height: 120px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .material-info p {
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
  