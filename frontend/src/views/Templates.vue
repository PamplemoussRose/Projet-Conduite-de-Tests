<style>
body {
  background-color: #e2e2ff;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.login-page {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(225deg, #f2e8ff, #cbc3db);
  box-shadow:  -26px 26px 52px #c0b8cf, 26px -26px 52px #fffaff;
}
</style>

<style scoped>

button {
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
  
  button:hover {
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
</style>
  