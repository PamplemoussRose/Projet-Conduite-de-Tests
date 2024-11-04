<template>
    <div class="material-page">
      <header class="material-page-header">
        <h1 class="title">Materials</h1>
        <button class="back-button" @click="handleButtonClick">{{ buttonText }}</button>
      </header>
  
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Search" class="search-bar" />
      </div>
  
      <div class="material-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Material Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(material, index) in filteredMaterials" :key="index" @click="goToMaterialDetail(material.id)" class="clickable-row">
              <td><img :src="material.image" alt="Material Image" class="material-image" /></td>
              <td>{{ material.name }}</td>
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
  export default {
    data() {
      return {
        searchQuery: "",
        status: "admin", 
        materials: [
          { id: 1, name: "Samsung A10", image: "https://via.placeholder.com/100" },
          { id: 2, name: "Apple iPad", image: "https://via.placeholder.com/100" },
          { id: 1, name: "Samsung A11", image: "https://via.placeholder.com/100" },
          { id: 2, name: "Apple iPad 2 ", image: "https://via.placeholder.com/100" },
          { id: 1, name: "Samsung A12", image: "https://via.placeholder.com/100" },
          { id: 2, name: "Apple iPad 3", image: "https://via.placeholder.com/100" },
          { id: 1, name: "Samsung A13", image: "https://via.placeholder.com/100" },
          { id: 2, name: "Apple iPad 4", image: "https://via.placeholder.com/100" },
          { id: 1, name: "Samsung A14", image: "https://via.placeholder.com/100" },
          { id: 2, name: "Apple iPad 5", image: "https://via.placeholder.com/100" },
        ],
      };
    },
    computed: {
      filteredMaterials() {
        return this.materials.filter((material) =>
          material.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      buttonText() {
        if (this.status === "offline") return "Log In";
        if (this.status === "user") return "Log Out";
        return "Back";
      },
    },
    methods: {
      handleButtonClick() {
        if (this.status === "offline") {
          this.$router.push({ name: "Login" });
        } else if (this.status === "user") {
          alert("Logged out!");
          this.status = "offline";
        } else if (this.status === "admin") {
          this.$router.push({ name: "AdminDashboard" });
        }
      },
      goToMaterialDetail(id) {
        this.$router.push({ name: "MaterialDetail", params: { id } });
      }
    },
  };
  </script>
  
  <style scoped>

  .material-page {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow:  -26px 26px 52px #c0b8cf,
  26px -26px 52px #fffaff;
  }
  
  .material-page-header {
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
  
  .material-table {
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
  
  .material-image {
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
  