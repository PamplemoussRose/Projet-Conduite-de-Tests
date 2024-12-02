<template>
  <div class="user-modify-container">
    <header class="user-modify-header">
      <h1 class="title">Equipment Modify</h1>
      <button class="back-button" @click="goToPage">Back</button>
    </header>

    <div class="user-modify">

      <!-- Formulaire pour afficher le matériel -->
      <!--Il faut qu'il y ai version reference phone number et date de borrwowed-->
      <div class="user-form">
        <div class="form-field">
          <p>Version</p>
          <p class="infoEquipment">{{ equipment.name }}</p>
          <input type="text" v-model="name" id="name"/>
        </div>
        <div class="form-field">
          <p>Reference</p>
          <p class="infoEquipment">{{ equipment.reference }}</p>
          <input type="text" v-model="reference" id="reference"/>
        </div>
        <div class="form-field">
          <p>Phone number</p>
          <p class="infoEquipment">{{ equipment.phoneNumber }}</p>
          <input type="text" v-model="phoneNumber" id="phoneNumber" />
        </div>
        <div class="form-field">
          <p>Borrowed date</p>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button class="add-button" @click="modifyButton">{{ buttonLabel }}</button>
      </div>

      <div class="user-table">
        <img :src="equipment.image" alt="Equipment Image" class="equipment-image" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      equipment: {
        id: null,
        name: "My Equipment",
        image: "https://via.placeholder.com/300",
        version: "1.0",
        reference: "XYZ123",
        phoneNumber: "123-456-7890",
      },
      beginDate: "",
      endDate: "",
      isDisabled: true,
      equipments: [
        /*there is a foreign key for the user who borrowed*/
        { id: 1, name: "Samsung A10", image: "https://via.placeholder.com/300", idBorrower: 2},
        { id: 2, name: "Apple iPad", image: "https://via.placeholder.com/100", idBorrower: 2},
        { id: 1, name: "Samsung A11", image: "https://via.placeholder.com/100", idBorrower: 1},
        { id: 2, name: "Apple iPad 2 ", image: "https://via.placeholder.com/100", idBorrower: 1},
        { id: 1, name: "Samsung A12", image: "https://via.placeholder.com/100", idBorrower: 1},
        { id: 2, name: "Apple iPad 3", image: "https://via.placeholder.com/100", idBorrower: 1},
        { id: 1, name: "Samsung A13", image: "https://via.placeholder.com/100", idBorrower: 1},
        { id: 2, name: "Apple iPad 4", image: "https://via.placeholder.com/100", idBorrower: 1},
        { id: 1, name: "Samsung A14", image: "https://via.placeholder.com/100", idBorrower: 1},
        { id: 2, name: "Apple iPad 5", image: "https://via.placeholder.com/100", idBorrower: 1},
      ],
      errorMessage: '',

    };
  },
  /*get user according to his id in the url*/
  mounted() {
    const equipmentId = parseInt(this.$route.params.id); // Récupère l'ID de l'URL
    this.equipment = this.equipments.find(e => e.id === equipmentId); // Trouve l'équipement
    if (!this.equipment) {
      this.errorMessage = "Equipment not found.";
    }
  },
  computed: {
    buttonLabel() {
      return this.isDisabled ? "Modify" : "Validate";
    },
  },

  methods: {
    goToPage() {
      // Redirige vers une autre page avec l'URL "/other-page"
      window.location.href = `http://localhost:3000/equipment-page`;
    },
    modifyButton(){
      if (this.isDisabled === true){
        this.isDisabled = false;
      }
      else {
        /*Ici cela doit récupérer les informations entrées
        * les modifier dans la base de données
        * et donc les modifier dans l'affichage aussi */
        alert("Bouton validation");
        this.isDisabled = true;
      }

    }
  }
};
</script>

<style scoped>
.user-modify-container {
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
.user-modify-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

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

.modif-button{
  background-color: darkgreen;
  padding: 1rem 1.5rem;
}
.title {
  font-size: 1.8rem;
  color: #494850;
  margin-bottom: 1rem;
}

.user-modify {
  display: flex;
  justify-content: space-between;
}

.user-form {
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
