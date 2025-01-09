<template>
  <div class="equipment-add">
    <header class="equipment-add-header">
      <h1 class="title">Add Equipment</h1>
      <div>
        <button class="back-button" @click="goToPage">Back</button>
        <button @click="logout" class="logout-button">Logout</button>
      </div>
    </header>

    <div class="equipment-add-form">
      <h3 class="section-title">Equipment Details</h3>
      <div class="form-field">
        <input
          type="text"
          v-model="newEquipment.nomMateriel"
          placeholder="Nom Materiel"
        />
        <input
          type="text"
          v-model="newEquipment.versionMateriel"
          placeholder="Version Materiel"
        />
      </div>
      <div class="form-field">
        <input
          type="text"
          v-model="newEquipment.referenceMateriel"
          placeholder="Reference Materiel (5 caractères)"
        />
        <input
          type="text"
          v-model="newEquipment.numeroTelephoneMateriel"
          placeholder="Numéro Téléphone Materiel"
        />
      </div>
      <div class="form-field">
        <label for="photoMateriel">Photo Materiel</label>
        <input
          type="file"
          id="photoMateriel"
          @change="handleFileUpload"
          accept="image/*"
        />
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button type="submit" @click="addEquipment" class="add-button">
        Add Equipment
      </button>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default {
  data() {
    return {
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
  methods: {
    handleFileUpload(event) {
      this.photoFile = event.target.files[0];
    },
    async addEquipment() {
      if (!this.newEquipment.nomMateriel || !this.newEquipment.versionMateriel || !this.newEquipment.referenceMateriel || !this.newEquipment.numeroTelephoneMateriel) {
        this.errorMessage = "Tous les champs sont obligatoires !";
        return;
      }
      if (!/^\d{10}$/.test(this.newEquipment.numeroTelephoneMateriel)) {
        this.errorMessage = 'Le numéro de téléphone doit comporter 10 chiffres.';
        return;
      }
      if (this.newEquipment.referenceMateriel.length !== 5) {
        this.errorMessage = 'La référence doit comporter 5 caractères.';
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
      } else {
        formData.append("photoMateriel", "GStRd1gWYAANG4q.jpeg");
      }
      console.log(this.newEquipment); // Ensure all fields have values

      try {
        const response = await fetch("http://localhost:3000/equipment-add", {
          method: "POST",
          body: formData,
          
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400 && errorData.message === 'Le matricule est déjà attribué.') {
                this.errorMessage = 'Le matricule est déjà attribué à un autre équipement.';
            } else {
                throw new Error(errorData.message || "Erreur lors de l'ajout.");
            }
            return;
        }

        const result = await response.json();
        console.log("Équipement ajouté avec succès :", result.message);
        window.location.href = "http://localhost:8080/equipment-page";
      } catch (error) {
        console.error("Erreur :", error.message);
        this.errorMessage = error.message;
      }
    },
    async logout() {
      alert("Logged out!");
      await signOut(auth);
      window.location.href = "http://localhost:3000/user-login";
    },
    goToPage() {
      router.push("/equipment-page");
    },
  },
  async mounted() {
    if (auth.currentUser == null) {
      window.location.href = "http://localhost:3000/";
    }

    const response = await fetch(
      `http://localhost:3000/get-role?email=${auth.currentUser.email}`,
      {
        credentials: "include", // Important for CORS
      }
    );
    const data = await response.json();
    const role = data.data;

    if (role !== "ADMINISTRATEUR") {
      window.location.href = "http://localhost:8080/equipment-page";
    }
  },
};
</script>

<style scoped>
.equipment-add {
  width: 900px;
  height: 100%;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow: -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}

.equipment-add-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 2rem;
  color: #494850;
  margin: 0;
}

.logout-button,
.back-button {
  background-color: #b18fcf;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover,
.back-button:hover {
  background-color: #978897;
}

.equipment-add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.section-title {
  font-size: 1.5rem;
  color: #494850;
  margin-bottom: 1rem;
  text-align: center;
}

.form-field {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
}

input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
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
</style>
