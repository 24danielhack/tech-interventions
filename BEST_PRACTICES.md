# 🎯 Guide des meilleures pratiques

## Architecture et développement

### Code quality
```typescript
// ✅ BON - Typage fort
interface User {
  id: string;
  email: string;
  role: UserRole;
}

const getUser = async (id: string): Promise<User> => {
  // ...
}

// ❌ MAUVAIS - any est dangereux
const getUser = async (id: string): Promise<any> => {
  // ...
}
```

### Gestion des erreurs
```typescript
// ✅ BON - Erreurs spécifiques
try {
  const user = await userService.findById(id);
  if (!user) {
    throw new NotFoundException(`User ${id} not found`);
  }
} catch (error) {
  logger.error('Failed to fetch user', error);
  throw error;
}

// ❌ MAUVAIS - Erreurs génériques
try {
  // ...
} catch (error) {
  console.log('Error');
}
```

### Async/await
```typescript
// ✅ BON
const items = await Promise.all([
  fetchItems(),
  fetchStats(),
  fetchAlerts()
]);

// ❌ MAUVAIS
const items = await fetchItems();
const stats = await fetchStats();
const alerts = await fetchAlerts();
```

---

## Frontend (React/Next.js)

### Hooks personnalisés
```typescript
// ✅ BON - Logique réutilisable
export const useInterventions = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    loadData();
  }, []);
  
  return { data, loadData };
};

// ❌ MAUVAIS - Logique mixte dans le composant
function InterventionsList() {
  const [data, setData] = useState([]);
  // ...
}
```

### Optimisation des rendus
```typescript
// ✅ BON - Memoization pour éviter re-rendus
const InterventionItem = React.memo(({ intervention }) => (
  <div>{intervention.title}</div>
));

// ❌ MAUVAIS - Re-rendu à chaque fois
function InterventionList({ interventions }) {
  return interventions.map(i => <InterventionItem key={i.id} intervention={i} />);
}
```

---

## Base de données

### Queries optimisées
```sql
-- ✅ BON - Index et pagination
SELECT * FROM interventions 
WHERE department_id = $1 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;

-- ❌ MAUVAIS - Récupère toutes les données
SELECT * FROM interventions;
```

### Relations TypeORM
```typescript
// ✅ BON - Lazy loading des relations
const intervention = await repo.findOne({
  where: { id },
  relations: ['technician', 'department']
});

// ❌ MAUVAIS - Chargement unnecessary
const interventions = await repo.find({ relations: ['technician', 'department', 'inventory'] });
```

---

## Sécurité

### Validation
```typescript
// ✅ BON - Validation stricte
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
async create(@Body() dto: CreateInterventionDto) {
  return this.service.create(dto);
}

// ❌ MAUVAIS - Pas de validation
@Post()
async create(@Body() data: any) {
  return this.service.create(data);
}
```

### Authentification
```typescript
// ✅ BON - Token refresh automatique
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      // Refresh token
    }
  }
);

// ❌ MAUVAIS - Pas de refresh
// Utilisateur déconnecté immédiatement
```

---

## Performance

### Frontend
```typescript
// ✅ BON - Lazy loading des composants
const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  loading: () => <Skeleton />
});

// ❌ MAUVAIS - Chargement synchrone
import Dashboard from '@/components/Dashboard';
```

### Backend
```typescript
// ✅ BON - Pagination
const [data, total] = await repo.findAndCount({
  take: 20,
  skip: 0
});

// ❌ MAUVAIS - Pas de pagination
const data = await repo.find();
```

---

## Naming conventions

### TypeScript/JavaScript
```typescript
// ✅ BON - Noms clairs et significatifs
interface CreateInterventionDto {
  title: string;
  description: string;
  priority: PriorityLevel;
}

function calculateResolutionTime(start: Date, end: Date): number {
  return end.getTime() - start.getTime();
}

// ❌ MAUVAIS
interface CID {
  t: string;
  d: string;
  p: string;
}

function calc(s, e) {
  return e - s;
}
```

### Fichiers et dossiers
```
✅ BON:
- interventions.service.ts
- create-intervention.dto.ts
- intervention.entity.ts

❌ MAUVAIS:
- interventions.ts
- dto.ts
- model.ts
```

---

## Git et versioning

### Commits
```bash
✅ BON:
git commit -m "feat: add intervention escalation logic"
git commit -m "fix: resolve JWT refresh token timeout"
git commit -m "docs: update API documentation"

❌ MAUVAIS:
git commit -m "update"
git commit -m "fixes"
git commit -m "wip"
```

### Branches
```bash
✅ BON:
feature/add-intervention-escalation
bugfix/jwt-token-expiration
chore/update-dependencies

❌ MAUVAIS:
feature-new
fix
update-things
```

---

## Tests (à implémenter)

### Unit tests
```typescript
// ✅ BON
describe('InterventionsService', () => {
  it('should create intervention with ticket number', async () => {
    const result = await service.create(mockData);
    expect(result.ticketNumber).toBeDefined();
  });
});

// ❌ MAUVAIS
describe('Tests', () => {
  it('works', async () => {
    expect(1).toBe(1);
  });
});
```

---

## Documentation

### Code comments
```typescript
// ✅ BON - Explique le "pourquoi"
// Deduct from stock immediately to prevent overbooking
// in case of concurrent requests
item.quantityAvailable -= quantity;

// ❌ MAUVAIS - Redondant
// Decrease quantity
item.quantityAvailable -= quantity;
```

### Env variables
```
✅ BON:
DB_HOST=localhost
API_PORT=3001
JWT_SECRET=<actual-secret>
LOG_LEVEL=debug

❌ MAUVAIS:
host=localhost
port=3001
secret=123456
```

---

## Monitoring et logging

### Logs structurés
```typescript
// ✅ BON
logger.info('Intervention created', {
  interventionId: result.id,
  ticketNumber: result.ticketNumber,
  department: result.department,
  timestamp: new Date().toISOString()
});

// ❌ MAUVAIS
console.log('Intervention created');
```

---

## Déploiement

### Production checklist
- [ ] Variables d'environnement sécurisées
- [ ] HTTPS activé
- [ ] Database backups configurés
- [ ] Logs centralisés
- [ ] Monitoring en place
- [ ] Rate limiting activé
- [ ] CORS configuré correctement
- [ ] Secrets non commitées

---

## Migration vers production

```bash
# 1. Build l'image
docker build -t tech-interventions-api:1.0 -f backend/Dockerfile .
docker build -t tech-interventions-frontend:1.0 -f frontend/Dockerfile .

# 2. Push vers registry
docker push your-registry/tech-interventions-api:1.0
docker push your-registry/tech-interventions-frontend:1.0

# 3. Déployer sur serveur
docker-compose -f docker-compose.prod.yml up -d

# 4. Vérifier la santé
curl http://localhost:3001/api/docs
```

---

## Ressources recommandées

### Documentation
- NestJS: https://docs.nestjs.com
- Next.js: https://nextjs.org/docs
- PostgreSQL: https://www.postgresql.org/docs
- TypeORM: https://typeorm.io

### Outils
- Postman: Pour tester les APIs
- DBeaver: Pour gérer la BD
- GitKraken: Pour gérer Git
- VS Code Extensions: ESLint, Prettier, REST Client

### Tutoriels
- NestJS Best Practices
- React Performance Optimization
- PostgreSQL Query Optimization
- Docker for Developers

---

## Troubleshooting courant

### "Port already in use"
```bash
# Trouver le processus
lsof -i :3001

# Tuer le processus
kill -9 <PID>
```

### "Database connection failed"
```bash
# Vérifier PostgreSQL
psql -U admin -d tech_interventions

# Réinitialiser
docker-compose down -v
docker-compose up -d
```

### "JWT token expired"
```typescript
// Le client doit utiliser le refresh token automatiquement
// Vérifié dans api-client.ts interceptor
```

---

## Conclusion

Une bonne architecture, c'est:
- 🎯 **Lisible** - Code facile à comprendre
- 🔒 **Sécurisé** - Protégé contre les vulnérabilités
- ⚡ **Performant** - Rapide et efficace
- 📦 **Maintenable** - Facile à modifier et étendre
- 📝 **Documenté** - Bien expliqué et commenté
- 🧪 **Testé** - Fonctionnel et fiable

**Suivez ces pratiques et vous aurez une base de code professionnelle!** 💪
