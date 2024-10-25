ARCHITECTURE TYPE

/project-root

│

├── /backend

│   ├── /config

│   │   └── db.config.js         # Configuration de MariaDB

│   ├── /controllers

│   │   └── user.controller.js   # Contrôleurs pour la logique métier

│   ├── /models

│   │   └── user.model.js        # Modèles de données pour MariaDB

│   ├── /routes

│   │   └── user.routes.js       # Définition des routes de l'API

│   ├── /services

│   │   └── user.service.js      # Services pour encapsuler la logique métier

│   ├── /middlewares

│   │   └── auth.middleware.js   # Middleware pour l'authentification, etc.

│   ├── /utils

│   │   └── logger.js            # Utilitaires divers (e.g. logs)

│   ├── server.js                # Point d'entrée du serveur Node.js

│   ├── package.json             # Dépendances Node.js

│   └── .env                     # Variables d'environnement

│

├── /frontend

│   ├── /public

│   │   └── index.html           # Fichier HTML de base pour Vue.js

│   ├── /src

│   │   ├── /assets              # Fichiers statiques (images, styles, etc.)

│   │   ├── /components          # Composants Vue.js

│   │   ├── /views               # Vues associées aux routes principales

│   │   ├── /router

│   │   │   └── index.js         # Configuration du router Vue.js

│   │   ├── /store

│   │   │   └── index.js         # Gestion d'état global avec Vuex (si utilisé)

│   │   ├── App.vue              # Composant principal Vue.js

│   │   └── main.js              # Point d'entrée Vue.js

│   ├── package.json             # Dépendances du frontend

│   └── vue.config.js            # Configuration du projet Vue.js

│

└── /database

│   └── schema.sql               # Schéma de la base de données MariaDB