<template>
  <div class="equipment-management-container">
    <header class="equipment-management-header">
      <h1 class="title">{{ loginRole === 'ADMINISTRATEUR' ? 'Equipment Management' : 'Equipment List' }}</h1>
      <div class="header-buttons">
        <button v-if="loginRole === 'ADMINISTRATEUR'" class="back-button" @click="goToPage">Back</button>
        <button class="logout-button" @click="logout">Log Out</button>
      </div>
    </header>

    <!-- Navigation (ADMIN) -->
    <div v-if="loginRole === 'ADMINISTRATEUR'" class="tabs">
      <button :class="{ active: activeTab === 'manage' }" @click="activeTab = 'manage'">Manage Equipment</button>
      <button :class="{ active: activeTab === 'add' }" @click="activeTab = 'add'">Add Equipment</button>
    </div>

    <!-- Section d'equipements -->
    <div v-if="activeTab === 'manage' || loginRole !== 'ADMINISTRATEUR'" class="manage-equipment-tab">
      <div class="table-controls">
        <input type="text" v-model="searchQuery" placeholder="Search equipment..." class="search-bar" />
      </div>
      <div class="table-content">
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
            <tr v-if="filteredEquipment.length === 0">
              <td colspan="4">No equipment found</td>
            </tr>
            <tr v-for="(equipment, index) in filteredEquipment" :key="index" @click="goToEquipmentDetail(equipment.IdMateriel)" class="clickable-row">
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

    <!-- Section d'ajout d'equipements -->
    <div v-if="activeTab === 'add' && loginRole === 'ADMINISTRATEUR'" class="add-equipment-tab">
      <div class="equipment-form">
        <h3 class="section-title">Equipment Details</h3>
        <div class="form-field">
          <input type="text" v-model="newEquipment.nomMateriel" placeholder="Equipment Name" />
          <input type="text" v-model="newEquipment.versionMateriel" placeholder="Version" />
        </div>
        <div class="form-field">
          <input type="text" v-model="newEquipment.referenceMateriel" placeholder="Reference (5 characters)" />
          <input type="text" v-model="newEquipment.numeroTelephoneMateriel" placeholder="Phone Number" />
        </div>
        <div class="form-field">
          <label for="photoMateriel">Photo</label>
          <input type="file" id="photoMateriel" @change="handleFileUpload" accept="image/*" />
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button @click="addEquipment" class="add-button">Add Equipment</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import router from "@/router";

export default {
  data() {
    return {
      activeTab: "manage",
      searchQuery: "",
      loginRole: "",
      equipment: [],
      newEquipment: {
        nomMateriel: "",
        versionMateriel: "",
        referenceMateriel: "",
        numeroTelephoneMateriel: "",
        etatMateriel: "DISPONIBLE",
      },
      photoFile: null,
      errorMessage: "",
    };
  },
  computed: {
    filteredEquipment() {
      if (!this.searchQuery) return this.equipment;
      const query = this.searchQuery.toLowerCase();
      return this.equipment.filter((item) => item.nomMateriel.toLowerCase().includes(query));
    },
  },
  methods: {
    async logout() {
      alert("Logged out!");
      await signOut(auth);
      window.location.href = "http://localhost:3000/user-login";
    },
    goToPage() {
      router.push("/admin-dashboard");
    },
    goToEquipmentDetail(equipmentId) {
      window.location.href = `http://localhost:3000/equipment-detail/${equipmentId}`;
    },
    async addEquipment() {
      try {
        if (!this.newEquipment.nomMateriel || !this.newEquipment.versionMateriel || !this.newEquipment.referenceMateriel || !this.newEquipment.numeroTelephoneMateriel) {
          this.errorMessage = "All fields are required!";
          return;
        }
        if (this.newEquipment.referenceMateriel.length !== 5) {
          this.errorMessage = "Reference must be 5 characters.";
          return;
        }
        if (!/^\d{10}$/.test(this.newEquipment.numeroTelephoneMateriel)) {
          this.errorMessage = "Phone number must be 10 digits.";
          return;
        }

        const formData = new FormData();
        formData.append("nomMateriel", this.newEquipment.nomMateriel);
        formData.append("versionMateriel", this.newEquipment.versionMateriel);
        formData.append("referenceMateriel", this.newEquipment.referenceMateriel);
        formData.append("numeroTelephoneMateriel", this.newEquipment.numeroTelephoneMateriel);
        formData.append("etatMateriel", this.newEquipment.etatMateriel);
        if (this.photoFile) {
          formData.append("photoMateriel", this.photoFile);
        }

        const response = await axios.post("http://localhost:3000/equipment-add", formData);
        alert(response.data.message);
        this.resetForm();
        this.getEquipmentData();
        this.activeTab = "manage";
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Error adding equipment.";
      }
    },
    resetForm() {
      this.newEquipment = {
        nomMateriel: "",
        versionMateriel: "",
        referenceMateriel: "",
        numeroTelephoneMateriel: "",
        etatMateriel: "DISPONIBLE",
      };
      this.photoFile = null;
      this.errorMessage = "";
    },
    async Actiondelete(deleteId) {
      const confirmed = confirm("Are you sure you want to delete this equipment?");
      if (!confirmed) return;
      try {
        await axios.delete(`http://localhost:3000/equipment-page/${deleteId}`);
        this.getEquipmentData();
      } catch (error) {
        console.error("Error deleting equipment:", error);
      }
    },
    Actionmodify(modifyId) {
      window.location.href = `http://localhost:3000/equipment-modify/${modifyId}`;
    },
    handleFileUpload(event) {
      this.photoFile = event.target.files[0];
    },
    getEquipmentData() {
      axios
        .get("http://localhost:3000/equipment-page/data")
        .then((response) => {
          this.equipment = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching equipment:", error);
        });
    },
  },
  async mounted() {
    if (!auth.currentUser) {
      window.location.href = "http://localhost:3000/";
      return;
    }
    const response = await axios.get(`http://localhost:3000/get-role?email=${auth.currentUser.email}`);
    this.loginRole = response.data.data;
    if (this.loginRole !== "ADMINISTRATEUR") {
      this.activeTab = "manage";
    }
    this.getEquipmentData();
  },
};
</script>


<style scoped>
.equipment-management-container {
  width: 900px;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow: -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}

.equipment-management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-buttons {
  display: flex;
  gap: 1rem;
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
  margin-bottom: 1rem;
}

.tabs {
  height: 3rem;
  width: 20rem;
  margin: 0 auto 1rem auto;
  display: flex;
  justify-content: center;
  background: #5c3a81;
  box-shadow: inset 20px 20px 60px #4e316e, inset -20px -20px 60px #6a4394;
  padding: 1rem 2rem;
  border-radius: 60px;
  gap: 1rem;
}

.tabs button {
  background-color: #b18fcf;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.65rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tabs button.active {
  transform: scale(1.2);
  font-size: 0.84rem;
}

.tabs button:not(.active) {
  transform: scale(0.9);
}

.manage-equipment-tab .table-controls {
  margin-bottom: 1rem;
}

.search-bar {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  background-color: #f9f9ff;
  font-size: 1rem;
  color: #494850;
  transition: box-shadow 0.3s ease;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(125, 92, 151, 0.5);
}

.table-content {
  border: 1px solid #ccc;
  background-color: #fff;
  overflow-y: auto;
  max-height: 400px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
  word-wrap: break-word;
}

th {
  background-color: #e8e8ff;
}

tr:hover {
  background-color: #f9f9ff;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.equipment-image {
  width: 80px;
  height: 80px;
}

.add-equipment-tab .equipment-form {
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 10px;
}


.section-title {
  font-size: 1.5rem;
  color: #494850;
  margin-bottom: 1rem;
  text-align: center;
}

.form-field {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.add-button {
  border: none;
  color: #fff;
  background-image: linear-gradient(30deg, #7d5c97, #a693c4);
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

.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
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

</style>
