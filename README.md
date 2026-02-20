Plateforme eCommerce MERN Full-Stack 🚀
📖 Introduction et Objectifs
Ce projet consiste en le développement d'une plateforme de commerce électronique robuste et moderne, conçue comme projet de fin d'études. L'objectif principal est de démontrer la maîtrise d'une architecture logicielle complète, de la gestion de base de données jusqu'à l'interface utilisateur.

Points forts de la solution :

Gestion d'état global : Utilisation de la Context API de React pour synchroniser le panier entre les composants de manière fluide.

Validation atomique des stocks : Logique backend garantissant que les commandes ne dépassent jamais les disponibilités réelles (protection contre l'overselling).

Architecture conteneurisée : Déploiement facilité, isolé et reproductible via Docker et Docker Compose.

🏗️ Architecture et Technologies
Architecture Backend : Le modèle MVC
Le modèle MVC (Modèle-Vue-Contrôleur) désigne notre choix d'architecture logique pour la partie backend. Cette structure permet une séparation claire des responsabilités :

Modèle : Gère la logique métier et les données stockées dans MongoDB via Mongoose.

Vue : Se concentre sur la représentation des données (JSON) consommées par le frontend Next.js.

Contrôleur : Assure la gestion des interactions. Il reçoit les requêtes HTTP, demande au modèle d'effectuer les actions nécessaires et renvoie les résultats.

Architecture d'API adoptée : REST
Nous avons opté pour une API RESTful pour sa simplicité et son adaptabilité via le protocole HTTP.

Cette interface permet aux utilisateurs d'appeler notre API et de recevoir des résultats standardisés au format JSON. En raison de la sensibilité des données, cette API intègre des mécanismes de sécurisation adéquats.

🛠️ Guide d'Installation (Docker)
Prérequis : Docker Desktop installé et démarré.

Lancement de l'infrastructure :

Bash
git clone <url-du-depot>
cd mern
# Réinitialiser les volumes pour appliquer le schéma de données 'stock'
docker compose down -v
# Lancer les services
docker compose up -d --build
Seeding des Données :

Bash
docker exec -it mongodb mongoimport --username mongo_user --password example1234 --authenticationDatabase admin --db test_dbJ --collection products --file /import/datasource/products.json --jsonArray --upsert
📄 Tests et Documentation
Postman : Validation de l'API
Pour garantir la fiabilité des échanges de données avant l'intégration frontend, nous avons utilisé Postman. Cet outil a permis de tester rigoureusement les endpoints REST et la structure des réponses JSON.

Swagger
L'API est documentée via Swagger, offrant un contrat technique interactif permettant de visualiser et tester les routes en temps réel.
Accès local : http://localhost:5000/api-docs

✨ Fonctionnalités Clés
Validation Atomique : Le stock est décrémenté uniquement si la ressource est disponible au moment du checkout.

Dashboard Business Intelligence : Interface admin avec calcul du chiffre d'affaires en temps réel et monitoring global de l'activité.

Filtres Dynamiques : Recherche par nom, filtrage par catégorie et curseur de prix intelligent pour une réactivité instantanée.

Gestion de Stock : Mise à jour automatique des quantités et validation stricte lors de la création de commande.

📁 Structure du Projet
Plaintext
mern/
├── express_backend/     # Serveur API REST (Architecture MVC)
├── next_frontend/      # Application Client & Dashboard (Next.js/TS)
├── mongodb/            # Configuration Docker et scripts d'initialisation
│   └── dataset/        # Fichiers JSON pour le Seeding
├── docker-compose.yml  # Orchestration globale des services
└── README.md           # Documentation principale
