<template>
  <div class="equipment-modify-container">
    <header class="equipment-modify-header">
      <h1 class="title">Modify Equipment</h1>
      <div class="header-buttons">
      <button class="back-button" @click="goToPage">Back</button>
      <button class="logout-button" @click="logout">Log Out</button>
      </div>
    </header>

    <div class="equipment-modify">
      <!-- Formulaire de modification -->
      <div class="equipment-form">
        <div class="form-field">
          <p>Equipment Name</p>
          <input type="text" v-model="equipment.nomMateriel" id="nomMateriel" />
        </div>
        <div class="form-field">
          <p>Version</p>
          <input type="text" v-model="equipment.versionMateriel" id="versionMateriel" />
        </div>
        <div class="form-field">
          <p>Reference</p>
          <input type="text" v-model="equipment.referenceMateriel" id="referenceMateriel" />
        </div>
        <div class="form-field">
          <p>Phone Number</p>
          <input type="text" v-model="equipment.numeroTelephoneMateriel" id="numeroTelephoneMateriel" />
        </div>

        <!-- Erreur-->
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <div class="equipment-image-container">
        <!-- Gestion d'image -->
        <img :src="equipment.photoMateriel" alt="Equipment Image" class="equipment-image" />
        <div class="upload-field">
          <label for="photoMaterielFile">Upload New Image</label>
          <input type="file" id="photoMaterielFile" @change="handleImageUpload" accept="image/*" />
        </div>
      </div>
    </div>

    <div class="save-changes-container">
      <button class="modify-button" @click="modifyButton">Save Changes</button>
    </div>
  </div>
</template>



<script>
import router from '@/router';
import axios from 'axios';

export default {
  data() {
    return {
      equipment: {
        nomMateriel: '',
        versionMateriel: '',
        referenceMateriel: '',
        etatMateriel: 'DISPONIBLE', 
        photoMateriel: '',
        numeroTelephoneMateriel: '',
      },
      errorMessage: '',
    };
  },
  async mounted() {
    // Récupérer les informations de l'équipement basé sur l'ID
    const getdata = await axios.get(`http://localhost:3000/equipment-detail/data/${this.$route.params.id}`);
    this.equipment = getdata.data.data;
  },
  methods: {
    goToPage() {
      router.push('/equipment-page');
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.photoMaterielFile = file;
        this.previewImage(file);
      }
    },
    previewImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.equipment.photoMateriel = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async modifyButton() {
      const formData = new FormData();
      formData.append('nomMateriel', this.equipment.nomMateriel);
      formData.append('versionMateriel', this.equipment.versionMateriel);
      formData.append('referenceMateriel', this.equipment.referenceMateriel);
      formData.append('etatMateriel', this.equipment.etatMateriel);
      formData.append('numeroTelephoneMateriel', this.equipment.numeroTelephoneMateriel);
      if (this.photoMaterielFile) {
        formData.append('photoMateriel', this.photoMaterielFile);
      } else {
        formData.append('photoMateriel', this.equipment.photoMateriel);
      }

      try {
        const response = await axios.put(`http://localhost:3000/equipment-modify/${this.$route.params.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Equipment modified successfully:', response.data);
        this.goToPage();
      } catch (error) {
        console.error('Error modifying equipment:', error);
        this.errorMessage = error.message;
      }
    },
    logout() {
      alert("Logged out!");
    },
  },
};
</script>

<style scoped>

.equipment-modify-container {
  width: 900px;
  height: 100%;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow: -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}

.equipment-modify-header {
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

.header-buttons {
  display: flex;
  gap: 1rem;
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

.equipment-modify {
  display: flex;
  justify-content: space-between;
}

.equipment-form {
  flex: 1;
  max-width: 300px;
  margin-right: 2rem;
}

.form-field {
  margin-bottom: 1rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.equipment-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  flex: 1;
}

.equipment-image {
  max-width: 100%; 
  max-height: 300px;
  object-fit: contain;

  margin-bottom: 1rem;
}

.upload-field {
  text-align: center;
  margin-top: 1rem;
}

.upload-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.save-changes-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.modify-button {
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

.modify-button:hover {
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
