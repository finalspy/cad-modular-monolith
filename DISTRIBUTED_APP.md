# Roadmap de Refactoring et Modernisation d'une Application Node.js

## Préparation théorique de la migration

### Ordre des étapes

1. **Ajouter/compléter les tests (unitaires, intégration, e2e)**
2. **Mettre en place un pipeline CI (GitHub Actions pour les tests)**
3. **Analyser et réduire le couplage entre services, contrôleurs, modèles, repositories**
4. **Migrer en TypeScript**
5. **Réorganiser la structure du projet (domain, application, infrastructure, interfaces)**
6. **Implémenter Ports & Adapters (architecture hexagonale)**

---

### 1. Ajouter/compléter les tests

**But**
Garantir la non-régression, documenter les comportements actuels, pouvoir refactorer en sécurité.

**Remarques et points de vigilance**
- Privilégier des tests rapides et isolés.
- S’appuyer sur un coverage report (Istanbul/nyc, Jest/Vitest) pour vérifier la couverture.
- Il est acceptable d’ajouter d’abord des tests “boîte noire” pour figer le comportement, même si le code n’est pas optimal.

---

### 2. Mettre en place GitHub Actions pour lancer les tests

**But**
Automatiser la validation du code à chaque commit/pull request, éviter d’introduire des régressions.

**Remarques et points de vigilance**
- Vérifier que la pipeline fonctionne sur des forks.
- Penser aux secrets (base de données de test, etc.).
- Ajouter un “required check” sur GitHub pour refuser les merges en cas d’échec.

---

### 3. Analyser et réduire le couplage entre service, controller, model, repository

**But**
Préparer le terrain pour la migration vers une architecture propre (hexagonale), faciliter les tests et le refactoring.

**Remarques et points de vigilance**
- Ne pas casser l’existant : garder les tests verts.
- Favoriser des changements incrémentaux (un module à la fois).
- Documenter les dépendances principales dans un schéma ou un README.

---

### 4. Passer en TypeScript (optionnel)

**But**
Sécuriser la base de code, profiter du typage fort, mieux préparer la modularisation.

**Remarques et points de vigilance**
- Possibilité de faire une migration progressive (`allowJs` dans tsconfig).
- Utiliser `ts-migrate` ou un script pour accélérer la migration.
- Les erreurs de typage peuvent révéler des bugs cachés : adapter les tests au besoin.

---

### 5. Réorganiser la structure du projet (Domain, Application, Infrastructure, Interfaces)

**But**
Préparer le passage à l’architecture hexagonale, clarifier les responsabilités et les dépendances.

**Remarques et points de vigilance**
- Attention aux chemins relatifs cassés.
- Refactoriser en plusieurs PR si la base de code est volumineuse.
- Revalider la couverture de tests à chaque étape.

---

### 6. Appliquer Ports & Adapters (architecture hexagonale)

**But**
Séparer strictement la logique métier du technique, améliorer la testabilité, préparer la modularisation/microservices.

**Remarques et points de vigilance**
- Ne pas “remonter” de dépendance technique (ex : Express, Mongoose) dans le domaine.
- Vérifier que la documentation et les schémas d’architecture sont cohérents.
- Bonus : ajouter des tests de contract (Pact) pour les adapters externes.

---

## Mise en oeuvre pratique

### 1. Ajouter/compléter les tests

#### But
- Sécuriser la base de code avant toute modification structurelle, garantir l'absence de régression.

#### Étapes détaillées
- **Inventorier les tests existants** : lister et exécuter tous les tests (unitaires, intégration, e2e).
- **Ajouter les tests manquants** : pour chaque module/fichier (service, contrôleur, repository, modèle), écrire des tests si nécessaire.
  - Pour les routes : tests HTTP (supertest, etc.)
  - Pour les services : tests des cas métier, erreurs, exceptions
  - Pour les repositories : tests avec mocks ou base de données de test
- **S'assurer de la couverture** :
  - Générer un rapport de couverture (`npm run coverage`)
  - Fixer un seuil minimal (ex : 80%) pour refuser les PR non testées
- **Documenter le plan de tests** : 
  - Décrire les cas critiques, les limites, les tests “legacy”
  - Taguer/ignorer les tests connus comme “legacy” ou instables pour itérer rapidement.

---

### 2. Mettre en place GitHub Actions pour lancer les tests

#### But
- Détecter immédiatement toute régression après un commit ou PR, standardiser la qualité sur le repo.

#### Étapes détaillées
- Créer le dossier `.github/workflows` et un fichier `ci.yml` minimal :
  ```yaml
  name: Node.js CI

  on: [push, pull_request]

  jobs:
    build-and-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: 18
        - run: npm ci
        - run: npm run lint
        - run: npm test
        - run: npm run coverage -- --coverage
  ```

- Ajouter des jobs pour le linting (`npm run lint`) et le coverage si pertinent.
- Ajouter un badge “build” dans le README.
- Vérifier le passage des tests sur une branche dédiée.
- Configurer la protection de branche sur GitHub pour exiger la réussite du workflow.

---

### 3. Analyser et réduire le couplage entre services, contrôleurs, modèles, repositories

#### But

- Faciliter la migration, la testabilité, la maintenabilité, réduire les dépendances directes.

#### Étapes détaillées

- Repérer les dépendances cycliques et les imports croisés, cartographier les dépendances.
- Identifier les “god objects”, dépendances cycliques, importations croisées.
- Introduire des interfaces pour les dépendances critiques (repositories, services externes).
- Découpler les contrôleurs des implémentations concrètes (ex : passer par une interface de service).
- Remplacer les appels directs par des interfaces ou des services injectés.
- Pratiquer l’injection de dépendances (DI) plutôt que les singletons/imports directs.
- Documenter les interfaces (UserRepository, NotificationService, etc.).
- Mettre à jour les tests pour isoler les modules (mocks, stubs).

---

### 4. Passer en TypeScript (optionnel)

#### But

- Renforcer la robustesse et la maintenabilité du code avec le typage fort.

#### Étapes détaillées

- Ajouter un `tsconfig.json` strict (ex : strict: true, noImplicitAny: true).
- Renommer les fichiers `.js` en `.ts` (commencer par les modèles métiers puis les contrôleurs).
- Ajouter les types explicitement (fonctions, objets, paramètres, retours).
- Corriger les erreurs de compilation, ajuster les tests pour les types.
- Adapter la configuration de Jest/Vitest/Mocha si besoin (ts-jest, etc.).
- Faire passer tous les tests existants (CI).

---

### 5. Réorganiser la structure du projet (Domain, Application, Infrastructure, Interfaces)

#### But

- Rendre le projet évolutif, clair, prêt pour la séparation forte des responsabilités (DDD, Hexagonal).

#### Étapes détaillées

- Créer les dosiers : `domain/` (entités, value objects, ports), `application/` (use cases, services), `infrastructure/` (ORM, API externes, adaptateurs techniques), `interfaces/` (routes HTTP, CLI, GraphQL, etc.), ou `adapters/`
- Déplacer les entités métiers dans `domain/`, les use cases/services dans `application/`, les repos et intégrations techniques dans `infrastructure/`.
- Mettre à jou tous les imports relatifs.
- Ajouter un schéma ou README expliquant la nouvelle organisation.
- Refactoriser progressivement pour ne pas casser la base (PR par feature/module si besoin).

---

### 6. Implémenter Ports & Adapters (Architecture hexagonale)

#### But

- Isoler totalement la logique métier, maximiser la testabilité, préparer une future modularisation (microservices).

#### Étapes détaillées

- Créer les ports (interfaces métier) dans `domain/` (ex: UserRepository, MailSender).
- Implémenter les adapters dans `infrastructure/` (ex: MongoUserRepository, SendgridMailSender).
- Injecter les dépendances via configuration/injection (constructor, DI framework, factory, provider…).
- Adapter tous les points d’entrée (routes, CLI, workers…) pour n’appeler que l’application et le domaine via les ports.
- Adapter les tests :
    - Tester le domaine avec des mocks/adapters fictifs.
    - Tester l’intégration des vrais adapters séparément.
- Séparer strictement technique (Express, base, filesystem) et métier (isoler la logique Express (controllers, middlewares) dans `interfaces/`.)
