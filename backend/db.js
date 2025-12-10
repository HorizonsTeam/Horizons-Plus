import postgres from 'postgres'

// L'URL de connexion est récupérée de la variable d'environnement.
// Elle DOIT contenir le mot de passe et pointer vers le Pooler de Supabase.
const connectionString = process.env.DATABASE_URL 

// Vérification de base pour s'assurer que l'URL est bien définie
if (!connectionString) {
  throw new Error("La variable d'environnement DATABASE_URL n'est pas définie. Assurez-vous d'avoir configuré le fichier .env.")
}

// Initialisation du client postgres.
// Supabase recommande d'utiliser le Pooler de Session pour les applications web/backend.
const sql = postgres(connectionString, {
  // Options de configuration recommandées (facultatif mais utile)
  max: 20, // Taille maximale du pool de connexions
  idle_timeout: 30, // Fermer les connexions inactives après 30s
  connect_timeout: 10, // Délai d'attente de connexion de 10s
})

export default sql