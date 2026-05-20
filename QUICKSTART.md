# Tech Intervention System - Guide de démarrage rapide

## 🚀 Démarrage en 5 minutes

### Avec Docker (Recommandé)

```bash
# 1. Se placer dans le répertoire du projet
cd NewDaniel

# 2. Démarrer tous les services
docker-compose up -d

# 3. Attendre ~30 secondes pour que la BD soit prête
sleep 30

# 4. Ouvrir dans votre navigateur
# - Frontend: http://localhost:3000
# - API Docs: http://localhost:3001/api/docs
# - Base de données: postgresql://admin:password123@localhost:5432/tech_interventions
```

### Sans Docker (Développement local)

#### Terminal 1 - Base de données PostgreSQL

```bash
# Assurer que PostgreSQL est installé et en cours d'exécution
# Windows: Services > PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Créer la base de données
createdb -U admin -W tech_interventions
# Mot de passe: password123
```

#### Terminal 2 - Backend API

```bash
cd backend

# Copier le fichier .env
cp .env.example .env

# Installer les dépendances
npm install

# Démarrer le serveur
npm run start:dev

# ✅ API en cours d'exécution sur http://localhost:3001
```

#### Terminal 3 - Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le développement
npm run dev

# ✅ Frontend disponible sur http://localhost:3000
```

---

## 🔐 Identifiants de test

Après le démarrage, utilisez ces identifiants pour vous connecter:

### Compte Admin
```
Email: admin@example.com
Password: password123
```

### Compte Technician
```
Email: tech@example.com
Password: password123
```

### Compte Manager
```
Email: manager@example.com
Password: password123
```

**Note**: Ces comptes de test sont créés automatiquement (à implémenter dans les migrations de base de données).

---

## 📚 Accès rapide

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Interface utilisateur |
| API REST | http://localhost:3001 | Endpoints API |
| Swagger Docs | http://localhost:3001/api/docs | Documentation interactive |
| Base de données | postgresql://admin:password123@localhost:5432 | PostgreSQL |

---

## 🛠️ Commandes courantes

### Backend

```bash
cd backend

# Développement
npm run start:dev

# Linting
npm run lint

# Tests
npm run test

# Build production
npm run build

# Démarrer production
npm run start:prod
```

### Frontend

```bash
cd frontend

# Développement
npm run dev

# Build production
npm run build

# Démarrer production
npm run start

# Linting
npm run lint
```

### Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build --no-cache

# Supprimer les volumes (reset BD)
docker-compose down -v
```

---

## 📋 Checklist de démarrage

- [ ] **Base de données**: PostgreSQL est en cours d'exécution
- [ ] **Backend**: API accessible sur http://localhost:3001
- [ ] **Frontend**: Interface accessible sur http://localhost:3000
- [ ] **Authentification**: Capable de se connecter avec les identifiants
- [ ] **Dashboard**: Page d'accueil s'affiche correctement
- [ ] **Documentation**: Swagger docs disponible

---

## 🐛 Dépannage

### La BD ne démarre pas avec Docker

```bash
# Supprimer les volumes et redémarrer
docker-compose down -v
docker-compose up -d
```

### Port déjà utilisé

```bash
# Changer les ports dans docker-compose.yml ou .env
# Exemple: API_PORT=3002
```

### Erreur de connexion à la BD

```bash
# Vérifier que PostgreSQL est en cours d'exécution
docker ps | grep postgres

# Vérifier les logs
docker-compose logs postgres
```

### Frontend ne se charge pas

```bash
# Vérifier que les variables d'environnement sont correctes
# NEXT_PUBLIC_API_URL doit pointer vers le backend
cat frontend/.env.local

# Redémarrer le serveur de développement
Ctrl+C
npm run dev
```

---

## 📊 Première utilisation

### 1. Création d'une intervention

```
1. Accéder au dashboard
2. Cliquer sur "Nouvelle intervention"
3. Remplir le formulaire:
   - Titre: "Écran cassé"
   - Description: "Monitor 24\" ne fonctionne plus"
   - Catégorie: Hardware
   - Priorité: High
   - Département: IT
4. Cliquer "Créer"
```

### 2. Gestion du stock

```
1. Aller à "Inventaire"
2. Cliquer "Ajouter un article"
3. Remplir les informations:
   - Nom: "Écran 24\" Dell"
   - Catégorie: Peripheral
   - Quantité: 10
4. Enregistrer
```

### 3. Assignation d'intervention

```
1. Sélectionner une intervention
2. Cliquer "Assigner"
3. Choisir un technicien
4. Enregistrer
```

### 4. Résolution d'intervention

```
1. Intervention en cours
2. Cliquer "Résoudre"
3. Saisir la solution
4. Enregistrer équipement utilisé
5. Confirmer
```

### 5. Export de données

```
1. Aller à "Rapports"
2. Cliquer "Générer rapport"
3. Choisir la période
4. Cliquer sur "Exporter"
5. Format disponible: CSV, Excel, PDF
```

---

## 🔗 Ressources utiles

- **Documentation complète**: Voir [README.md](./README.md)
- **Architecture détaillée**: Voir [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API Swagger**: http://localhost:3001/api/docs
- **Code source**: Consulter les dossiers `backend/` et `frontend/`

---

## 💡 Conseils

1. **Développement plus rapide**:
   - Utilisez `npm run start:dev` pour le hot-reload du backend
   - Le frontend a aussi le hot-reload activé par défaut

2. **Debugging**:
   - Backend: Activer les logs avec `LOG_LEVEL=debug` dans .env
   - Frontend: Utiliser DevTools du navigateur
   - BD: Connexion directe avec pgAdmin ou DBeaver

3. **Performance**:
   - Utiliser Docker pour des performances meilleures
   - Réduire les logs en production

---

**Vous êtes prêt à commencer! 🎉**

Pour de l'aide: Consultez la documentation API ou créez une issue sur GitHub.
