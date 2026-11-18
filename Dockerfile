# Étape 1 : Utiliser une image Nginx officielle et légère
FROM nginx:alpine

# Étape 2 : Copier ton fichier HTML (et tes éventuels assets) 
# dans le dossier par défaut où Nginx lit les pages web
COPY index.html /usr/share/nginx/html/index.html

# (Optionnel) Si tu as d'autres fichiers comme un dossier CSS ou JS séparé :
# COPY . /usr/share/nginx/html/

# Étape 3 : Indiquer que le conteneur écoute sur le port 80
EXPOSE 80

# Étape 4 : Lancer Nginx au démarrage du conteneur
CMD ["nginx", "-g", "daemon off;"]
