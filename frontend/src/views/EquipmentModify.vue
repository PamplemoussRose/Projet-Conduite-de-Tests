<template>
  <div class="equipment-modify-container">
    <header class="equipment-modify-header">
      <h1 class="title">Equipment Modify</h1>
      <button class="back-button" @click="goToPage">Back</button>
      <button @click="logout" class="logout-button">Logout</button>
    </header>

    <div class="equipment-modify">

      <!-- Formulaire pour afficher et modifier les informations de l'équipement -->
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
          <p>State</p>
          <select v-model="equipment.etatMateriel" id="etatMateriel">
            <option value="DISPONIBLE">Available</option>
            <option value="EMPRUNTER">Borrowed</option>
          </select>
        </div>
        <div class="form-field">
          <p>Phone Number</p>
          <input type="text" v-model="equipment.numeroTelephoneMateriel" id="numeroTelephoneMateriel" />
        </div>
        <div class="form-field">
          <p>Photo URL</p>
          <input type="text" v-model="equipment.photoMateriel" id="photoMateriel" />
        </div>

        <!-- Affichage de l'erreur si nécessaire -->
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <!-- Bouton pour envoyer les modifications -->
        <button class="modify-button" @click="modifyButton">Save Changes</button>
      </div>

      <div class="equipment-image-container">
        <!-- Affichage de l'image de l'équipement -->
        <img :src="equipment.photoMateriel" alt="Equipment Image" class="equipment-image" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      equipment: {
        nomMateriel: '',
        versionMateriel: '',
        referenceMateriel: '',
        etatMateriel: 'DISPONIBLE',  // Valeur par défaut
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
      window.location.href = 'http://localhost:8080/equipment-page';
    },
    async modifyButton() {
      try {
        const response = await fetch(`http://localhost:3000/equipment-modify/${this.$route.params.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.equipment), // Envoie de l'objet equipment
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de l\'ajout de l\'équipement');
        }

        const result = await response.json();
        console.log('Équipement ajouté avec succès :', result.message);
      } catch (error) {
        console.error('Erreur :', error.message);
        this.errorMessage = error.message; // Met à jour le message d'erreur affiché
      }
      window.location.href = 'http://localhost:8080/equipment-page';
    },

    logout() {
      alert("Logged out!");
      // Log out logic here
    },
  },
};
</script>

<style scoped>

.equipment-modify-container {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow:  -26px 26px 52px #c0b8cf,
  26px -26px 52px #fffaff;
}

.infoEquipment{
//white-space: nowrap;
  white-space: normal;
  font-weight: bold;
}
.equipment-modify-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

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

.modify-button{
  background-color: darkgreen;
  padding: 1rem 1.5rem;
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

.section-title {
  font-size: 1.2rem;
  color: #494850;
  margin-bottom: 1rem;
  text-align: center;
}

.form-field {
  width: 100%;
  display: block;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input, select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.modify-button {
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

.modify-button:hover {
  background-position: right center;
  background-size: 200% auto;
  -webkit-animation: pulse 1.5s infinite;
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
  margin-bottom: 1rem;
}



.equipment-table {
  flex: 2;
  max-width: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
}
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #e8e8ff;
}

tr:hover {
  background-color: #f9f9ff;
}
</style>
