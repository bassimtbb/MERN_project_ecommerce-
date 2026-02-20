# Plateforme eCommerce MERN Full-Stack 🚀

## 👥 Équipe du Projet
Ce projet a été réalisé par :
* **Bassim Tabbeb**  
* **Walid HDILOU**
* **Mathis PENAGOS**
* **Joud ATALLAH**

## 📖 Introduction et Objectifs
Ce projet consiste en le développement d'une plateforme de commerce électronique robuste et moderne. L'objectif principal est de démontrer la maîtrise d'une architecture logicielle complète, de la gestion de base de données jusqu'à l'interface utilisateur.

---

## 👥 Utilisateurs et Cas d'Utilisation
Le système est conçu autour de deux profils d'utilisateurs distincts. L'architecture repose sur un principe d'héritage d'acteurs.

### 1. Client (Utilisateur Standard)
Le client est l'utilisateur final qui interagit avec la boutique pour effectuer des achats.
* **Recherche de produits** : Consultation du catalogue avec filtres dynamiques par nom, prix et catégorie.
* **Gestion du Panier** : Ajout et modification d'articles de manière persistante via la Context API.
* **Passation de commande** : Validation du panier avec vérification automatique de la disponibilité des stocks.
* **Historique personnel** : Consultation de l'état et du détail des commandes passées.

### 2. Administrateur (Privilèges étendus)
L'Administrateur hérite de toutes les fonctionnalités du Client et possède des droits de gestion exclusifs sur la plateforme.
* **Gestion du catalogue (CRUD)** : Capacité d'ajouter, modifier ou supprimer des produits de la base de données.
* **Dashboard Business Intelligence** : Accès à une interface de monitoring affichant le chiffre d'affaires total et le nombre d'utilisateurs.
* **Surveillance des stocks** : Système d'alerte pour les produits en rupture de stock ou à faible quantité.
* **Gestion des commandes** : Vue d'ensemble sur toutes les transactions effectuées sur la plateforme.

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 14+ (App Router), TypeScript, Tailwind CSS, React Context API.
- **Backend** : Node.js, Express, Mongoose (Architecture MVC).
- **Base de données** : MongoDB (NoSQL).
- **Infrastructure** : Docker & Docker Compose.

---

## 🏗️ Architecture et Technologies

### Architecture Backend : Le modèle MVC
Le modèle MVC (Modèle-Vue-Contrôleur) désigne notre choix d'architecture logique pour la partie backend. Cette structure permet une séparation claire des responsabilités :
- **Modèle** : Gère la logique métier et les données stockées dans MongoDB via Mongoose.
- **Vue** : Se concentre sur la représentation des données (JSON) consommées par le frontend Next.js.
- **Contrôleur** : Assure la gestion des interactions. Il reçoit les requêtes HTTP, demande au modèle d'effectuer les actions nécessaires et renvoie les résultats.
![Schéma MVC](./ReadmeFiles/mvc.png)
### Architecture d'API adoptée : REST
Nous avons opté pour une API RESTful pour sa simplicité et son adaptabilité via le protocole HTTP. 
Cette interface permet aux utilisateurs d'appeler notre API et de recevoir des résultats standardisés au format JSON. En raison de la sensibilité des données, cette API intègre des mécanismes de sécurisation adéquats.
![Schéma MVC](./ReadmeFiles/rest%20api.png)

---

## 🛠️ Guide d'Installation (Docker)

**Prérequis** : Docker Desktop installé et démarré.

### Lancement de l'infrastructure :
```bash
git clone https://github.com/bassimtbb/MERN_project_ecommerce-.git
cd mern
# Réinitialiser les volumes pour appliquer le schéma de données 'stock'
docker compose down -v
# Lancer les services
docker compose up -d --build
```

### Seeding des Données :
```bash
docker exec -it mongodb mongoimport --username mongo_user --password example1234 --authenticationDatabase admin --db test_dbJ --collection products --file /import/datasource/products.json --jsonArray --upsert
```

---

## 📄 Tests et Documentation

### Postman : Validation de l'API
Pour garantir la fiabilité des échanges de données avant l'intégration frontend, nous avons utilisé Postman. Cet outil a permis de tester rigoureusement les endpoints REST et la structure des réponses JSON.

### Swagger
L'API est documentée via Swagger, offrant un contrat technique interactif permettant de visualiser et tester les routes en temps réel.
**Accès local** : [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## ✨ Fonctionnalités Clés
- **Validation Atomique** : Le stock est décrémenté uniquement si la ressource est disponible au moment du checkout.
- **Dashboard Business Intelligence** : Interface admin avec calcul du chiffre d'affaires en temps réel et monitoring global de l'activité.
- **Filtres Dynamiques** : Recherche par nom, filtrage par catégorie et curseur de prix intelligent pour une réactivité instantanée.
- **Gestion de Stock** : Mise à jour automatique des quantités et validation stricte lors de la création de commande.

---

## 📁 Structure du Projet
```text
mern/
├── express_backend/     # Serveur API REST (Architecture MVC)
├── next_frontend/      # Application Client & Dashboard (Next.js/TS)
├── mongodb/            # Configuration Docker et scripts d'initialisation
│   └── dataset/        # Fichiers JSON pour le Seeding
├── docker-compose.yml  # Orchestration globale des services
└── README.md           # Documentation principale
```
