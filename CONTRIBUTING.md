# 🤝 Guide de Contribution

Merci de contribuer à ce projet 🚀  
Ce document explique les règles et bonnes pratiques pour collaborer efficacement et éviter les conflits de code.


## 🔄 Gestion des branches
- La branche **`main`** contient uniquement du code **stable et validé**.
- La branche **`develop`** est utilisée pour intégrer les nouvelles fonctionnalités.
- Chaque fonctionnalité ou correction doit être développée sur une **branche dédiée** :

feature/nom-fonctionnalite

fix/nom-correctif

````
Exemple : `feature/recherche-trajets` ou `fix/bug-affichage-form`.

````

## 📝 Workflow Git
1. **Avant de commencer**, mettre à jour la branche `develop` :
 ```bash
 git checkout develop
 git pull origin develop
 git checkout -b feature/ma-feature
 ```

2. **Développer sur la branche créée**

   * Faire des commits réguliers et explicites :

     ```bash
     git commit -m "feat: ajout de la recherche de trajets"
     git commit -m "fix: correction du formulaire de réservation"
     ```

3. **Créer une Pull Request (PR) vers `develop`**

   * La PR doit décrire clairement la fonctionnalité ou le correctif.
   * La PR doit être relue par **au moins un autre membre** avant fusion.
   * Annoncez vos mises à jour sur le canal de communication (Discord/Teams/WhatsApp).

4. **Fusion dans `main`**

   * Ne se fait qu’une fois que `develop` est **testé et validé**.

---

## ✅ Bonnes pratiques

* Toujours **pull avant de push** pour éviter les conflits.
* Ne **jamais travailler directement sur `main` ou `develop`**.
* Suivre la convention de nommage des commits :

  * `feat:` → nouvelle fonctionnalité
  * `fix:` → correction de bug
  * `docs:` → documentation
  * `style:` → mise en forme (indentation, CSS, etc.)
  * `refactor:` → refonte du code sans ajout de fonctionnalité
  * `test:` → ajout ou modification de tests
* Communiquer régulièrement vos avancées avec l’équipe.

---

## 📬 Questions ?

En cas de doute, ouvrez une **Issue** ou demandez directement à l’équipe sur le canal de communication.

```
