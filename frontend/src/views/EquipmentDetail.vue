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
          <p><strong>Phone Number:</strong> {{ equipmentData.numeroTelephoneMateriel }}</p>
        </div>

        <div class="date-selection">
          <label for="borrow-date">Select Date:</label>
          <input type="date" id="borrow-date" v-model="selectedDate" />
        </div>

        <button class="borrow-button" @click="post">Borrow</button>
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
      loginRole: "",
      selectedDate: "",
      equipmentData: {
        nomMateriel: "",
        photoMateriel: "",
        versionMateriel: "",
        referenceMateriel: "",
        numeroTelephoneMateriel: "",
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
  },

  methods: {
    async logout() {
      alert("Logged out!");
      await signOut(auth);
      window.location.href = `http://localhost:3000/user-login`;
    },
    goToPage() {
      router.push("/equipment-page");
    },
    post() {
      axios
        .post("http://localhost:3000/equipment-page", {
          selectedDate: this.selectedDate,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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

</style>
