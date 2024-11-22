<template>
    <div class="user-management-container">
    <header class="user-management-header">
        <h1 class="title">Users Management</h1>
      <button class="back-button" @click="goToPage">Back</button>

    </header>

      <div class="user-management">

        <!-- Formulaire pour ajouter d'un utilisateur -->
        <div class="user-form">
            <h3 class="section-title">Add User</h3>
          <div class="form-field">
            <input type="text" v-model="newUser.firstName" placeholder="FirstName" />
            <input type="text" v-model="newUser.lastName" placeholder="LastName" />
          </div>
          <div class="form-field">
            <input type="text" v-model="newUser.id" placeholder="Id" />
            <input type="email" v-model="newUser.email" placeholder="E-mail" />
          </div>
          <div class="form-field">
            <label for="role">Role</label>
            <select v-model="newUser.role" id="role">
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <button class="add-button" @click="addUser">Add User</button>
        </div>

    
        <!-- Tableau d'utilisateurs -->
        <div class="user-table">
          <table>
            <thead>
              <tr>
                <th>LastName</th>
                <th>Id</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index">
                <td>{{ user.lastName }}</td>
                <td>{{ user.id }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newUser: {
          firstName: '',
          lastName: '',
          id: '',
          email: '',
          role: 'User'
        },
        errorMessage: '',
        users: [
          { firstName: "Jaafar", lastName: "Ghiffi", id: "001", email: "jaafar@example.com", role: "Admin" },
          { firstName: "Thomas", lastName: "Vanwalleghem", id: "002", email: "thomas@example.com", role: "User" },
          { firstName: "Clara", lastName: "Rouxel", id: "003", email: "clara@example.com", role: "User" },
          { firstName: "Chaimae", lastName: "Chaaibi", id: "004", email: "chaimae@example.com", role: "Admin" },
          { firstName: "Robin", lastName: "Laumonier", id: "005", email: "robin@example.com", role: "User" },
          { firstName: "N’Woumbornam", lastName: "N’Kouba", id: "006", email: "nwoumbornam@example.com", role: "User" }
        ]
      };
    },
    methods: {
      goToPage() {
        // Redirige vers une autre page avec l'URL "/other-page"
        this.$router.push('/admin-dashboard');
      }
    }
  };
  </script>
  
  <style scoped>
  .user-management-container {
    max-width: 800px;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow:  -26px 26px 52px #c0b8cf,
  26px -26px 52px #fffaff;
  }

  .user-management-header {
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
  
  .title {
    font-size: 1.8rem;
    color: #494850;
    margin-bottom: 1rem;
  }
  
  .user-management {
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
  