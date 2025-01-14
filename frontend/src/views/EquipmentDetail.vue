<template>
  <div class="equipment-detail-page">
    <header class="equipment-detail-header">
      <h1 class="title">Equipment Details</h1>
      <div class="header-buttons">
        <button class="back-button" @click="goToPage">Back</button>
        <button @click="logout" class="logout-button">Log Out</button>
      </div>
    </header>
    <div class="equipment-content">
      <div class="equipment-image-container">
        <img :src="equipmentData.photoMateriel" alt="Equipment Image" class="equipment-image" />
      </div>
      <div class="equipment-info-container">
        <h1 class="equipment-title">{{ equipmentData.nomMateriel }}</h1>
        <div class="equipment-info">
          <p><strong>Version:</strong> {{ equipmentData.versionMateriel }}</p>
          <p><strong>Reference:</strong> {{ equipmentData.referenceMateriel }}</p>
          <p><strong>Phone Number:</strong> {{ equipmentData.numeroTelephoneMateriel || 'Non applicable' }}</p>
        </div>
        <div>
          <p v-if="equipmentData.reservedBy && equipmentData.reservedBy !== currentUserId">This equipment is currently reserved by another user.</p>
          <p v-if="equipmentData.reservedBy === currentUserId">You are currently reserving this equipment.</p>
          <button class="action-button" v-if="equipmentData.etatMateriel === 'DISPONIBLE'" @click="reserveEquipment">Reserve</button>
          <button class="action-button" v-else-if="equipmentData.reservedBy === currentUserId" @click="reserveEquipment">Return Equipment</button>
          <button class="action-button" v-if="equipmentData.reservedBy && equipmentData.reservedBy !== currentUserId && loginRole === 'ADMINISTRATEUR'" @click="makeEquipmentAvailable">Make Available</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import router from "@/router";

export default {
  data() {
    return {
      currentUserId: null,
      equipmentData: {
        nomMateriel: "",
        photoMateriel: "",
        versionMateriel: "",
        referenceMateriel: "",
        numeroTelephoneMateriel: "",
        etatMateriel: "DISPONIBLE",
        reservedBy: null,
      },
    };
  },
  async mounted() {
    if (auth.currentUser == null) {
      window.location.href = "http://localhost:3000/";
    }

    const response = await axios.get(`http://localhost:3000/get-role?email=${auth.currentUser.email}`, {
      withCredentials: true,
    });

    this.loginRole = response.data.data;

    if (this.loginRole !== "ADMINISTRATEUR" && this.loginRole !== "EMPRUNTEUR") {
      window.location.href = "http://localhost:8080/equipment-page";
    }

    const getdata = await axios.get(`http://localhost:3000/equipment-detail/data/${this.$route.params.id}`);
    this.equipmentData = getdata.data.data;
    this.currentUserId = auth.currentUser.uid;

  },

  methods: {
    async logout() {
      alert("Logged out!");
      await signOut(auth);
      window.location.href = "http://localhost:8080";
    },
    goToPage() {
      router.push("/");
    },
    async reserveEquipment() {
      const action = this.equipmentData.reservedBy === this.currentUserId ? "return" : "reserve";
      const confirmed = confirm(`Do you want to ${action} this equipment?`);

      if (!confirmed) return;

      try {
        const endpoint =
          this.equipmentData.reservedBy === this.currentUserId
            ? `http://localhost:3000/equipment-return/${this.$route.params.id}`
            : `http://localhost:3000/equipment-reserve/${this.$route.params.id}`;

        const response = await axios.post(endpoint, {
          userId: this.currentUserId,
        });

        this.equipmentData = response.data.updatedEquipment; // Met à jour les données locales
        const successMessage = action === "return" 
          ? "The equipment has been successfully returned." 
          : "The equipment has been successfully reserved.";

        alert(successMessage);
      } catch (error) {
        console.error(`Erreur lors de l'action ${action}:`, error);
        alert(`An error occurred: ${error.response?.data?.message || error.message}`);
      }
    },
    async makeEquipmentAvailable() {
      const confirmed = confirm('Are you sure you want to make this equipment available? This will remove any existing reservation.');

      if (!confirmed) return;

      try {
        const response = await axios.post(`http://localhost:3000/equipment-force-available/${this.$route.params.id}`);

        this.equipmentData = response.data.updatedEquipment;
        alert('The equipment has been made available successfully.');
      } catch (error) {
        console.error('Error making equipment available:', error);
        alert(`An error occurred: ${error.response?.data?.message || error.message}`);
      }
    },
  },
};
</script>

<style scoped>
.equipment-detail-page {
  width: 900px;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow: -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}

.equipment-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.header-buttons {
  display: flex;
  gap: 1rem;
}

.equipment-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.equipment-image-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.equipment-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 10px;

}

.equipment-info-container {
  flex: 1;
}

.equipment-title {
  font-size: 1.8rem;
  color: #494850;
  margin-bottom: 1rem;
}

.equipment-info p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.date-selection {
  margin-top: 1.5rem;
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
  margin-top: 1.5rem;
  background-color: #b18fcf;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.borrow-button:hover {
  background-color: #978897;
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

.action-button {
  background-color: #7d5c97;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.action-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-button:hover:not(:disabled) {
  background-color: #a693c4;
}

</style>
