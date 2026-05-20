# Architecture Tech Intervention Management System

## 📐 Vue d'ensemble de l'architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Next.js 14 + React 18                                   │   │
│  │  - Modern UI/UX avec TailwindCSS                         │   │
│  │  - State management avec Zustand                         │   │
│  │  - Real-time updates                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                              ↓↑
                         (Axios HTTP)
                              ↓↑
┌──────────────────────────────────────────────────────────────────┐
│                        API LAYER (NestJS)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Express Server + NestJS Framework                       │   │
│  │  - REST API Endpoints                                    │   │
│  │  - JWT Authentication & Authorization                   │   │
│  │  - Request Validation & Sanitization                    │   │
│  │  - Error Handling & Logging                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Auth Module  │ │ Interventions│ │ Stock Module │            │
│  │              │ │   Module     │ │              │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Technicians  │ │ Departments  │ │ Reports      │            │
│  │   Module     │ │   Module     │ │   Module     │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                  ┌──────────────────┐                          │
│                  │  Exports Module  │ (IA-Ready)              │
│                  │   (CSV/Excel)    │                          │
│                  └──────────────────┘                          │
└──────────────────────────────────────────────────────────────────┘
                              ↓↑
                       (TypeORM Query)
                              ↓↑
┌──────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                     │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                │   │
│  │  │ Users    │ │ Intervns │ │ Inventory│                │   │
│  │  └──────────┘ └──────────┘ └──────────┘                │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                │   │
│  │  │ Depts    │ │ Reports  │ │ Alerts   │                │   │
│  │  └──────────┘ └──────────┘ └──────────┘                │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Structure du Backend

### Modules Principaux

#### 1. **Auth Module**
- **Responsabilité**: Authentification et autorisation
- **Composants**:
  - `AuthService`: Logique d'authentification
  - `JwtStrategy`: Stratégie Passport JWT
  - `AuthController`: Endpoints d'authentification
  - `RolesGuard`: Vérification des rôles
- **Endpoints**:
  - POST `/auth/register`
  - POST `/auth/login`
  - POST `/auth/refresh`

#### 2. **Interventions Module** (Core)
- **Responsabilité**: Gestion des interventions informatiques
- **Services**:
  - `InterventionsService`: Logique métier
- **Fonctionnalités**:
  - Création de tickets
  - Suivi du cycle de vie
  - Assignation aux techniciens
  - Escalade automatique
  - Statistiques en temps réel
- **Endpoints**:
  - POST `/interventions`
  - GET `/interventions`
  - PUT `/interventions/:id`
  - POST `/interventions/:id/resolve`
  - POST `/interventions/:id/assign`

#### 3. **Stock Module** (Intelligence)
- **Responsabilité**: Gestion intelligente de l'inventaire
- **Logique Intelligente**:
  - Déduction automatique du stock
  - Alertes de stock faible
  - Suivi des équipements défectueux
  - Historique complet d'utilisation
- **Services**:
  - `StockService`: Gestion et calculs
- **Endpoints**:
  - POST `/inventory/items`
  - POST `/inventory/items/:id/use`
  - POST `/inventory/items/:id/restock`
  - GET `/inventory/stats/overview`

#### 4. **Reports Module**
- **Responsabilité**: Génération automatisée de rapports
- **Types de rapports**:
  - Journaliers
  - Hebdomadaires
  - Mensuels
- **Contenu**:
  - Statistiques
  - Performance des techniciens
  - État du stock
  - Alertes et recommandations
- **Endpoints**:
  - POST `/reports/generate`
  - GET `/reports`
  - POST `/reports/:id/publish`

#### 5. **Exports Module** (IA-Ready)
- **Responsabilité**: Export de données optimisé pour l'IA
- **Formats Supportés**:
  - CSV structuré (IA-ready)
  - Excel (.xlsx)
  - PDF
  - Word (.docx)
- **Contenu Exporté**:
  - Interventions complètes
  - Inventaire
  - Rapports
  - Données d'analyse
- **Endpoints**:
  - GET `/exports/interventions/csv`
  - GET `/exports/interventions/excel`
  - GET `/exports/comprehensive/csv`

#### 6. **Technicians Module**
- **Responsabilité**: Gestion des techniciens
- **Endpoints**:
  - GET `/technicians`
  - GET `/technicians/:id/stats`

#### 7. **Departments Module**
- **Responsabilité**: Gestion des départements
- **Endpoints**:
  - GET `/departments`
  - GET `/departments/:id/stats`

---

## 🗄️ Schéma de Base de Données

### Entités et Relations

```sql
-- Users (Techniciens)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password VARCHAR,
  firstName VARCHAR,
  lastName VARCHAR,
  role ENUM('admin', 'manager', 'technician', 'observer'),
  phone VARCHAR,
  avatar VARCHAR,
  isActive BOOLEAN,
  lastLogin TIMESTAMP,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY,
  name VARCHAR UNIQUE,
  description TEXT,
  manager VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  location VARCHAR,
  isActive BOOLEAN,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Interventions
CREATE TABLE interventions (
  id UUID PRIMARY KEY,
  ticketNumber VARCHAR UNIQUE,
  title VARCHAR,
  description TEXT,
  category ENUM('hardware', 'network', 'software', ...),
  priority ENUM('low', 'medium', 'high', 'critical'),
  status ENUM('pending', 'in_progress', 'resolved', ...),
  reportedDate TIMESTAMP,
  reportedTime VARCHAR,
  assignedDate TIMESTAMP,
  resolvedDate TIMESTAMP,
  resolutionDuration VARCHAR,
  reportedBy VARCHAR,
  diagnosis TEXT,
  solution TEXT,
  internalComments TEXT,
  attachments JSON,
  technicianId UUID FOREIGN KEY,
  departmentId UUID FOREIGN KEY,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Inventory Items
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY,
  name VARCHAR,
  category ENUM('network', 'computer', 'peripheral', ...),
  serialNumber VARCHAR,
  quantityAvailable INTEGER,
  quantityTotal INTEGER,
  condition ENUM('new', 'good', 'fair', 'defective'),
  location VARCHAR,
  supplier VARCHAR,
  unitCost DECIMAL,
  lowStockThreshold INTEGER,
  description TEXT,
  isActive BOOLEAN,
  addedDate TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Inventory Usage (Historique)
CREATE TABLE inventory_usages (
  id UUID PRIMARY KEY,
  inventoryItemId UUID FOREIGN KEY,
  quantity INTEGER,
  interventionId UUID FOREIGN KEY,
  technicianId UUID FOREIGN KEY,
  reason VARCHAR,
  notes TEXT,
  usedAt TIMESTAMP
);

-- Alerts (Système d'alertes)
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  type ENUM('low_stock', 'defective_item', 'high_priority_incident', ...),
  severity ENUM('info', 'warning', 'critical'),
  title VARCHAR,
  message TEXT,
  relatedEntityId UUID,
  relatedEntityType VARCHAR,
  isResolved BOOLEAN,
  resolvedAt TIMESTAMP,
  isActive BOOLEAN,
  createdAt TIMESTAMP
);

-- Reports (Rapports générés)
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  type ENUM('daily', 'weekly', 'monthly'),
  period VARCHAR,
  title VARCHAR,
  data JSON,
  summary TEXT,
  generatedBy UUID,
  generatedAt TIMESTAMP,
  isPublished BOOLEAN,
  publishedAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## 🔐 Flux d'Authentification

```
1. Utilisateur envoie credentials
   ↓
2. Backend valide credentials
   ↓
3. Backend génère JWT Access Token (24h) + Refresh Token (7j)
   ↓
4. Frontend stocke tokens dans localStorage (protégé)
   ↓
5. Frontend envoie Access Token dans les headers (Bearer)
   ↓
6. Backend valide token + rôle pour chaque requête
   ↓
7. Si token expiré → utiliser Refresh Token pour nouvel Access Token
   ↓
8. Si Refresh Token invalide → Logout
```

---

## 🧠 Logique Intelligente du Stock

### Processus d'utilisation du stock

```
1. Technicien crée intervention
2. Lors de la résolution → enregistre équipement utilisé
3. Système:
   - Valide quantité disponible
   - Déduit du stock
   - Crée historique d'utilisation
   - Vérifie stock faible
   - Génère alerte si nécessaire
   - Recommande réapprovisionnement

4. Rapport mensuel inclut:
   - Équipements utilisés par intervention
   - Stock actuel
   - Articles critiques
   - Recommandations d'achat
```

---

## 📊 Export IA-Ready CSV

### Structure et Format

```csv
SECTION|Report Type|Generated|Date Range
METADATA|COMPREHENSIVE_EXPORT|2024-01-15T10:30:00Z|...

SECTION|SUMMARY_STATISTICS
Metric|Total Interventions|Value|100
Metric|Resolved Interventions|Value|87|Percentage|87%
Metric|Average Resolution Time|Value|2h 15m
Metric|Critical Interventions|Value|5

SECTION|DETAILED_INTERVENTIONS
Type|Ticket Number|Title|Description|Category|Priority|Status|...
INTERVENTION|TKT-20240115-00001|Écran cassé|...|HARDWARE|HIGH|resolved|...

Type|Equipment Name|Equipment Category|Quantity Used|...
EQUIPMENT_USED|Écran 24" Dell|PERIPHERAL|1|...

SECTION|INVENTORY_STATUS
Type|Name|Category|Quantity Available|Quantity Total|...
INVENTORY_ITEM|Souris Logitech|PERIPHERAL|15|20|...

SECTION|ANALYSIS_AND_RECOMMENDATIONS
Recommendation|Low Stock Alert|Count|3|Items|...
Recommendation|Performance Metric|Value|87% resolution rate|...
```

---

## 🚀 Performance et Scalabilité

### Optimisations

1. **Base de données**:
   - Index sur les colonnes fréquemment interrogées
   - Pagination des résultats
   - Lazy loading des relations

2. **API**:
   - Caching avec Redis (futur)
   - Compression Gzip
   - Rate limiting

3. **Frontend**:
   - Code splitting avec Next.js
   - Lazy loading des images
   - Caching du client

### Métriques de performance cibles

- Load time < 2s
- API response time < 500ms
- Database queries < 100ms
- Frontend FCP < 1.5s

---

## 🔒 Sécurité

### Mesures implémentées

1. **Authentification**:
   - JWT avec secret fort
   - Refresh tokens séparés
   - Session timeout

2. **Autorisation**:
   - Role-based access control (RBAC)
   - Permissions par endpoint
   - Validation des permissions

3. **Validation**:
   - Validation des inputs
   - Sanitization des données
   - Protection CSRF

4. **Données**:
   - Encryption des mots de passe (bcrypt)
   - CORS configuré
   - Headers sécurisés

5. **Infrastructure**:
   - HTTPS en production
   - Firewall configuré
   - VPN pour accès admin

---

## 📈 Croissance future

### Phase 2 (Q2 2024)
- [ ] Mobile app (React Native)
- [ ] WebSocket pour real-time
- [ ] Notifications push
- [ ] Dashboard mobile

### Phase 3 (Q3 2024)
- [ ] Machine Learning pour prédictions
- [ ] Calendrier de maintenance préventive
- [ ] Intégration email
- [ ] Multi-tenancy

### Phase 4 (Q4 2024)
- [ ] API de tiers pour intégrations
- [ ] Webhooks
- [ ] SSO (LDAP, OAuth2)
- [ ] Audit trail complet

---

**Architecture conçue pour la scalabilité et la maintenabilité**
