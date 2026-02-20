# Plateforme eCommerce MERN Full-Stack 🚀

![Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Infrastructure-Docker-blue?style=for-the-badge&logo=docker)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)

## 📖 Introduction et Objectifs

Ce projet consiste en le développement d'une plateforme de commerce électronique robuste et moderne, conçue comme projet de fin d'études. L'objectif principal est de démontrer la maîtrise d'une architecture logicielle complète, de la gestion de base de données jusqu'à l'interface utilisateur.

**Points forts de la solution :**
- **Gestion d'état global** : Utilisation de la Context API de React pour synchroniser le panier entre les composants.
- **Validation atomique des stocks** : Logique backend garantissant que les commandes ne dépassent jamais les disponibilités réelles (protection contre l'overselling).
- **Architecture conteneurisée** : Déploiement facilité et reproductible via Docker et Docker Compose.
- **Expérience Utilisateur (UX)** : Interface réactive avec filtres instantanés et indicateurs visuels de stock.

---

## 🏗️ Architecture et Technologies

Le projet s'appuie sur la pile logicielle **MERN**, enrichie par des outils de développement modernes :

### 🎨 Frontend
- **Next.js 14+ (App Router)** : Pour les performances et le rendu hybride.
- **TypeScript** : Pour un typage statique rigoureux et une maintenabilité accrue.
- **Tailwind CSS** : Pour une interface premium et responsive.
- **React Context API** : Gestion de l'authentification et du panier.

### ⚙️ Backend
- **Node.js & Express** : Serveur d'API RESTful.
- **Mongoose** : Modélisation des données pour MongoDB.
- **Architecture Service-Repository** : Séparation claire des responsabilités entre la logique métier et l'accès aux données.

### 💾 Infrastructure & BDD
- **MongoDB** : Base de données NoSQL orientée documents.
- **Docker & Docker Compose** : Isolation des services (Web, API, DB).

---

## 🛠️ Guide d'Installation (Docker)

Suivez ces étapes pour déployer l'environnement de développement complet sur votre machine.

### 1. Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré.

### 2. Clonage et Démarrage
```bash
# Cloner le dépôt
git clone <url-du-depot>
cd mern

# Réinitialiser les volumes (Recommandé pour appliquer les schémas de stock)
docker compose down -v

# Lancer l'infrastructure
docker compose up -d --build
```

### 3. Seeding des Données (Optionnel)
Pour injecter les produits et utilisateurs de test dans la base de données après le démarrage :
```bash
# Accéder au conteneur MongoDB
docker exec -it mongodb bash

# Importer les produits (Remplacez mongo_user et example1234 par vos identifiants)
mongoimport --username mongo_user --password example1234 --authenticationDatabase admin --db test_dbJ --collection products --file /import/datasource/products.json --jsonArray
```

---

## 📄 Documentation API (Swagger)

L'API utilise **Swagger** comme contrat technique. Cela permet :
- Un alignement parfait entre le développement Frontend et Backend.
- Des tests isolés des endpoints sans passer par l'UI.
- Une documentation vivante et interactive.

**Accès :** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 📐 Modélisation UML

### Cas d'Utilisation (Use Cases)
La plateforme distingue deux rôles principaux avec un héritage d'acteurs :
- **Client** : Recherche des produits, gestion du panier et consultation de l'historique des commandes.
- **Administrateur** (Hérite du Client) : Gestion du catalogue (CRUD), suivi global des commandes et Dashboard Business Intelligence (BI).

### Diagramme de Classes
Les entités principales sont :
- **User** : Gère l'authentification, les rôles (`Admin` vs `Client`) et le panier.
- **Product** : Stocke les informations produits et le niveau de `stock`.
- **Order** : Enregistre les transactions avec la logique de validation atomique.

> **Logique Métier du Stock :**
> - `Stock <= 5` : Déclenche l'alerte "Urgent Attention" sur le dashboard.
> - `Stock = 0` : Désactivation automatique du bouton "Ajouter au Panier" et rendu en niveaux de gris.

---

## ✨ Fonctionnalités Clés

- **Validation Atomique** : Le stock est décrémenté uniquement si la ressource est disponible au moment du checkout.
- **Dashboard BI** : Visualisation en temps réel du chiffre d'affaires, du nombre d'utilisateurs et des alertes de stock critique.
- **Filtres Dynamiques** : Recherche par nom, filtrage par catégorie et curseur de prix max (`useMemo` pour une réactivité instantanée).
- **Protection Admin** : Routes administratives protégées par middleware et contexte d'authentification.

---

## 📁 Structure du Projet

```text
mern/
├── express_backend/     # API REST (Node.js/Express)
├── next_frontend/      # Interface Utilisateur (Next.js/TS)
├── mongodb/            # Scripts de configuration et backup DB
│   └── dataset/        # Fichiers JSON pour le Seeding
├── docker-compose.yml  # Orchestration des services
└── README.md           # Documentation principale
```

---
*Projet réalisé avec rigueur dans le cadre d'un cycle d'ingénierie / fin d'études.*
