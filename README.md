# 🖥️ Tech Intervention Management System

Système SaaS moderne et scalable pour la gestion des interventions informatiques, inventaire, et génération de rapports automatisés.

## 🎯 Caractéristiques principales

### 1. **Gestion des interventions**
- Enregistrement automatique des tickets avec numérotation unique
- Suivi complet du cycle de vie (signalement → résolution)
- Priorités et catégories configurables
- Diagnostics et solutions détaillés
- Pièces jointes (photos, captures d'écran)
- Escalade automatique en cas de besoin
- Commentaires internes sécurisés

### 2. **Gestion intelligente du stock**
- Inventaire complet des équipements informatiques
- Suivi en temps réel des quantités disponibles
- Historique d'utilisation par intervention
- Alertes automatiques de stock faible
- Suivi des équipements défectueux
- Export de l'inventaire

### 3. **Dashboard professionnel**
- Statistiques en temps réel
- Graphiques analytiques
- Métriques de performance
- Incidents par département
- Temps de résolution moyens
- Performances des techniciens
- Mode sombre par défaut

### 4. **Rapports automatisés**
- Génération journalière, hebdomadaire, mensuelle
- Statistiques détaillées
- Métriques de performance
- Recommandations techniques
- Export multi-formats

### 5. **Export IA-ready**
- CSV structuré pour Claude.ai
- Format Excel professionnel
- PDF avec mise en forme
- Word (.docx)
- Données optimisées pour l'analyse IA

### 6. **Gestion des rôles et permissions**
- **Admin**: Accès complet
- **Responsable IT**: Gestion opérationnelle
- **Technicien**: Enregistrement d'interventions
- **Observateur**: Consultation et rapports

### 7. **Sécurité et traçabilité**
- Authentification JWT
- Gestion des sessions
- Journalisation des actions
- Sauvegardes automatiques

---

## 🚀 Guide d'installation

### Prérequis

- **Node.js** 20+
- **npm** ou **yarn**
- **PostgreSQL** 16+
- **Docker** (optionnel, pour déploiement)

### Installation locale

#### 1. **Cloner le projet**

```bash
cd NewDaniel
```

#### 2. **Configuration Backend**

```bash
cd backend

# Copier et configurer les variables d'environnement
cp .env.example .env

# Installer les dépendances
npm install

# Démarrer le serveur
npm run start:dev
```

L'API sera disponible à `http://localhost:3001`
Documentation Swagger: `http://localhost:3001/api/docs`

#### 3. **Configuration Frontend**

```bash
cd ../frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible à `http://localhost:3000`

---

## 🐳 Installation avec Docker

### Démarrage rapide

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier l'état
docker-compose ps
```

### Services disponibles après démarrage

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Base de données**: localhost:5432

---

## 📊 Architecture

### Backend (NestJS)

```
backend/
├── src/
│   ├── auth/               # Authentification JWT
│   ├── modules/
│   │   ├── interventions/  # Gestion des interventions
│   │   ├── stock/          # Gestion du stock (logique intelligente)
│   │   ├── technicians/    # Gestion des techniciens
│   │   ├── departments/    # Gestion des départements
│   │   ├── reports/        # Génération de rapports
│   │   └── exports/        # Export IA-ready
│   ├── database/           # Configuration TypeORM
│   ├── guards/             # Guards (JWT, Rôles)
│   └── decorators/         # Décorateurs personnalisés
└── package.json
```

### Frontend (Next.js)

```
frontend/
├── app/
│   ├── (auth)/            # Pages d'authentification
│   ├── (dashboard)/       # Pages du dashboard
│   └── globals.css        # Styles globaux
├── components/            # Composants réutilisables
├── hooks/                 # Hooks personnalisés
├── store/                 # Store Zustand
└── lib/                   # Utilitaires
```

### Base de données (PostgreSQL)

```
Entités principales:
- Users              (Techniciens)
- Departments       (Départements)
- Interventions    (Interventions)
- InventoryItems   (Articles de stock)
- InventoryUsages  (Historique d'utilisation)
- Alerts           (Alertes système)
- Reports          (Rapports générés)
```

---

## 🔑 API Endpoints Principaux

### Authentification

```
POST   /auth/register        # Inscription
POST   /auth/login           # Connexion
POST   /auth/refresh         # Renouveler le token
POST   /auth/me              # Profil utilisateur
```

### Interventions

```
POST   /interventions        # Créer une intervention
GET    /interventions        # Lister avec filtres
GET    /interventions/:id    # Détails
PUT    /interventions/:id    # Modifier
POST   /interventions/:id/resolve    # Résoudre
POST   /interventions/:id/assign     # Assigner
POST   /interventions/:id/escalate   # Escalader
GET    /interventions/stats         # Statistiques
```

### Inventaire

```
POST   /inventory/items      # Créer un article
GET    /inventory/items      # Lister
GET    /inventory/items/:id  # Détails
PUT    /inventory/items/:id  # Modifier
POST   /inventory/items/:id/use      # Utiliser
POST   /inventory/items/:id/restock  # Réapprovisionner
GET    /inventory/stats/overview     # Statistiques
GET    /inventory/history           # Historique
```

### Rapports

```
POST   /reports/generate     # Générer un rapport
GET    /reports              # Lister les rapports
GET    /reports/:id          # Détails
POST   /reports/:id/publish  # Publier
```

### Exports

```
GET    /exports/interventions/csv     # Export interventions CSV
GET    /exports/interventions/excel   # Export interventions Excel
GET    /exports/interventions/pdf     # Export interventions PDF
GET    /exports/inventory/csv         # Export inventaire CSV
GET    /exports/comprehensive/csv     # Export complet IA-ready
```

---

## 🤖 Format Export IA-Ready (CSV)

Le CSV complet inclut:

### Sections
1. **METADATA** - Informations du rapport
2. **SUMMARY_STATISTICS** - Statistiques agrégées
3. **DETAILED_INTERVENTIONS** - Détails de chaque intervention
4. **INVENTORY_STATUS** - État du stock
5. **ANALYSIS_AND_RECOMMENDATIONS** - Analyse et recommandations

### Exemple d'utilisation avec Claude.ai

```python
# Charger le CSV
import pandas as pd
df = pd.read_csv('comprehensive_export.csv')

# Claude peut:
# - Analyser les tendances
# - Identifier les problèmes récurrents
# - Faire des recommandations
# - Générer des rapports professionnels
# - Prédire les besoins futurs
```

---

## 🛠️ Configuration

### Variables d'environnement Backend

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=password123
DB_NAME=tech_interventions

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRATION=7d

# Server
NODE_ENV=development
API_PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Variables d'environnement Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📈 Cas d'usage

### Scénario 1: Signalement d'incident

1. Technicien crée une intervention via le formulaire
2. Système génère un numéro de ticket unique
3. Notification au responsable IT
4. Attribution automatique ou manuelle
5. Suivi en temps réel

### Scénario 2: Gestion de stock

1. Technicien enregistre utilisation d'équipement
2. Stock automatiquement déduit
3. Historique conservé
4. Alerte si stock faible
5. Recommandation d'achat

### Scénario 3: Génération de rapport

1. Rapport généré automatiquement (journalier/hebdo/mensuel)
2. Métriques calculées
3. Recommandations générées
4. Export en plusieurs formats
5. Envoi à Claude.ai pour analyse

---

## 🚀 Déploiement en production

### Options de déploiement

#### 1. **VPS Linux + Docker**

```bash
# Cloner le repo
git clone <repo-url>
cd NewDaniel

# Construire et démarrer
docker-compose -f docker-compose.yml up -d

# Vérifier les logs
docker-compose logs -f
```

#### 2. **Heroku**

```bash
# Créer une app Heroku
heroku create tech-interventions

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Déployer
git push heroku main
```

#### 3. **AWS / Azure / Google Cloud**

Utiliser les configurations Docker existantes avec les services cloud respectifs.

---

## 🧪 Tests

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

---

## 📝 Licence

MIT

---

## 📞 Support

Pour toute question ou problème:
1. Consulter la documentation Swagger: `http://localhost:3001/api/docs`
2. Vérifier les logs: `docker-compose logs`
3. Contacter le support

---

## 🔄 Versioning

- **v1.0.0** - Lancement initial
  - Gestion complète des interventions
  - Inventaire intelligent
  - Rapports automatisés
  - Exports IA-ready

---

**Construit avec ❤️ pour les responsables informatiques**
