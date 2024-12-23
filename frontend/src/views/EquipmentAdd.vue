<template>
      <div class="equipment-add">
        <header class="equipment-add-header">
          <h1 class="title">Equipment Add</h1>
          <button class="back-button" @click="goToPage">Back
        </button>
        <button @click="logout" class="logout-button">Logout</button>

      </header>

        <div className="equipment-add-form">
          <h3 className="section-title">Add Equipment</h3>
          <div className="form-field">
            <input type="text" v-model="newEquipment.nomMateriel" placeholder="Nom Materiel" />
            <input type="text" v-model="newEquipment.versionMateriel" placeholder="Version Materiel" />
          </div>
          <div className="form-field">
            <input type="text" v-model="newEquipment.referenceMateriel" placeholder="Reference Materiel (5 caractères)" />
            <input type="text" v-model="newEquipment.numeroTelephoneMateriel" placeholder="Numéro Téléphone Materiel" />
          </div>
          <div className="form-field">
            <input type="text" v-model="newEquipment.photoMateriel" placeholder="Photo Materiel (URL)" />
          </div>
          <div className="form-field">
            <label htmlFor="etatMateriel">État Materiel</label>
            <select v-model="newEquipment.etatMateriel" id="etatMateriel">
              <option value="DISPONIBLE">Disponible</option>
              <option value="EMPRUNTER">Emprunté</option>
            </select>
          </div>
          <p v-if="errorMessage" className="error">{{ errorMessage }}</p>
          <button type="submit" @click="addEquipment" class="add-button">Add Equipment</button>
        </div>
      </div>

</template>

<script>
import { auth } from "../firebase";
import {signOut} from "firebase/auth";
import axios from "axios";

export default {
  data() {
    return {
      newEquipment : {
        nomMateriel: '',
        photoMateriel: '',
        versionMateriel: '',
        referenceMateriel: '',
        numeroTelephoneMateriel: '',
        etatMateriel: 'DISPONIBLE',
      },
      errorMessage: '',
    };
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
      window.location.href = 'http://localhost:3000/equipment-page';
    },
    async addEquipment() {
      if (this.newEquipment.nomMateriel === '' || this.newEquipment.photoMateriel === '' || this.newEquipment.versionMateriel === '' || this.newEquipment.referenceMateriel === '' || this.newEquipment.numeroTelephoneMateriel === '') {
        this.errorMessage = "Tous les champs sont obligatoires !";
      }else if (this.newEquipment.nomMateriel.length < 1 || this.newEquipment.versionMateriel.length < 3 || this.newEquipment.referenceMateriel.length !== 5 || !/^\d{10}$/.test(this.newEquipment.numeroTelephoneMateriel)){
        this.errorMessage = "Tous les champs doivent respecter les formats requis  !";
      }
      else {
        try {
          const response = await fetch('http://localhost:3000/equipment-add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.newEquipment),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de l\'ajout de l\'équipement');
          }

          const result = await response.json();
          console.log('Équipement ajouté avec succès :', result.message);
          window.location.href = 'http://localhost:8080/equipment-page';
        } catch (error) {
          console.error('Erreur :', error.message);
          this.errorMessage = error.message;
        }
      }
    },
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
    if (this.loginRole !== "ADMINISTRATEUR") {
      window.location.href = 'http://localhost:8080/equipment-page';
    }
  }
}
</script>





<style scoped>

.equipment-add {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow:  -26px 26px 52px #c0b8cf,
  26px -26px 52px #fffaff;
}

.equipment-add-header {
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

.title {
  font-size: 1.8rem;
  color: #494850;
  margin-bottom: 1rem;
}

.equipment-add {
  display: flex;
  justify-content: space-between;
}

.equipment-add-form {
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
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input, select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.add-button {
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

.add-button:hover {
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



.user-table {
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