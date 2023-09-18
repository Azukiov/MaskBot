# MaskBot by [Azukiov](https://github.com/Azukiov)

Ce bot vous permettra de modérer votre serveur Discord de manière simple et efficace. Il est entièrement personnalisable et vous permettra de gérer votre serveur de manière optimale. Il intègre également un système de logs et de modération avancé. Il est également possible de créer des giveaways avec des paramètres personnalisables. 


[![HitCount](https://hits.dwyl.com/Azukiov/MaskBot.svg)](https://hits.dwyl.com/Azukiov/MaskBot)
[![Discord](https://img.shields.io/discord/863498186715037746?color=7289da&logo=discord&logoColor=white)](https://discord.gg/YfdEgx5yzF)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Azukiov/MaskBot)](https://github.com/Azukiov/MaskBot/issues)

## Sommaire

- [Installation](#installation)
- [Configuration](#configuration)
- [Commandes](#commandes)
- [Crédits](#crédits)

## Installation

1. Pour installer le bot, il vous suffit de télécharger le code source du bot et de l'installer sur votre machine. Vous aurez besoin de [Node.js](https://nodejs.org/en/) pour faire fonctionner le bot. Une fois Node.js installé, vous devrez installer les modules nécessaires au fonctionnement du bot. Pour cela, ouvrez un terminal dans le dossier du bot et tapez la commande suivante:

```bash
npm install
```

2. Une fois les modules installés, vous devrez configurer le bot. Pour cela, suivez les instructions de la partie [Configuration](#configuration).

3. Une fois le bot configuré, vous pourrez le lancer en tapant la commande suivante dans un terminal ouvert dans le dossier du bot:

```bash
node index.js
```

## Configuration

1. Editez le fichier `.env.example` et renommez-le en `.env`. Vous devrez ensuite remplir les champs suivants:

```env
# Discord Settings

DISCORD_TOKEN= # Token du bot
DISCORD_CLIENT_ID= # ID du bot
AUTHOR_ID= # ID de l'auteur du bot

# Database Settings (MariaDB)

DATABASE_HOST= # Adresse de la base de données (localhost par défaut) 
DATABASE_NAME= # Nom de la base de données
DATABASE_USER= # Nom d'utilisateur de la base de données
DATABASE_PASSWORD= # Mot de passe de la base de données

# Server Settings (ID en chiffres)

GUILD_ID= # ID du serveur
ALERT_CHANNEL_ID= # ID du salon de logs

# Embed Settings (Couleurs en hexadécimal)

COLOR_ERROR= # Couleur des messages d'erreur
COLOR= # Couleur des messages par défaut

# Links (URL)

INVITE_LINK= # Lien d'invitation du bot
```

## Commandes

- `<data>` - Argument obligatoire
- `[data]` - Argument facultatif
- `integer` - Nombre entier
- `string` - Chaîne de caractères
- `boolean` - Vrai ou faux (true/false)
- `user` - Utilisateur Discord
- `channel` - Salon Discord
- `role` - Rôle Discord

### Captcha

- `/captcha activate` - Active le captcha
- `/captcha deactivate` - Désactive le captcha
- `/captcha channel <channel>` - Définit le salon de vérification
- `/captcha role <role>` - Définit le rôle de vérification
- `/captcha auto-kick <boolean> [integer]` - Définit si le bot doit expulser les utilisateurs qui ne passent pas le captcha. Si le paramètre `integer` est spécifié, le bot expulsera les utilisateurs après le nombre de secondes spécifié (par défaut: 180 secondes).
- `/captcha show-config` - Affiche la configuration du captcha

### Informations

- `/stats bot` - Affiche les statistiques du bot

### Modération

- `/clear <integer>` - Supprime un nombre de messages spécifié


## Crédits

- [Azukiov](https://github.com/Azukiov) - Développeur du bot

## License

Ce projet est sous licence [MIT](LICENSE).