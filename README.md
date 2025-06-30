# Interlock LDAP Manager

[Interlock Website](https://interlock.brconsulting.info/)

Logo Font:
Matamata [@ dafont.com](https://www.dafont.com/matamata.font)

### Would you like to support me?
<a href='https://ko-fi.com/E1E2YQ4TG' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

# Interlock Documentation

For information and official Interlock Documentation go to:
[BR Consulting S.R.L. Documentation - Interlock](https://docs.brconsulting.info/sphinx/en/docs/Development/Interlock/00-ilck-overview.html)

## Installation from Source

  1. Install the following dependencies, for more info see
  [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager).
  ```bash
  apt-get install git nodejs nginx
  ```

  1. Clone the repository: git clone https://github.com/dblanque/interlock-frontend /var/lib/interlock/interlock-frontend/
  2. Change Directory onto the cloned repository
  ```bash
  cd /var/lib/interlock/interlock_frontend/
  npm install
  ```
  1. Once the required dependencies are installed you'll need to modify your local settings to match your back-end IP/Port:
  ```bash
  # On the Dev Server Version
  nano ./public/config/local.json

  # On the Compiled Version
  nano ./dist/config/local.json
  ```

## Project setup
```bash
WORK_PATH="/var/lib/interlock"
FRONTEND_PATH="/var/lib/interlock/interlock_frontend"

apt-get update -y

# Install curl and fetch required script.
apt-get install git curl -y

curl -sL https://deb.nodesource.com/setup_18.x -o "$WORK_PATH/nodesource_setup.sh"

# Add nodesource repo
bash "$WORK_PATH/nodesource_setup.sh"

# Install NodeJS
apt-get update -y
apt-get install nodejs -y

git clone https://github.com/dblanque/interlock_frontend $FRONTEND_PATH

cd $FRONTEND_PATH
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# FAQ - Frequently Asked Questions

* Why does the front-end use Vue 2 / Vuetify 2, isn't it EOL?
> Yes, Vue 2 is EOL but due to the scope of the project and the fact that
only one person is working on it actively, it was decided a functional product
is more important than boasting the newest framework and technologies.
It is also a robust and proven framework in spite of being EOL, and
validation is/should be done by the back-end anyways.

* Will it ever be upgraded/updated to Vue >= 3?
> If the project gains traction and support to justify the time investment,
it's within plans to either upgrade the current Front-end to Vue 3 with the
corresponding Vuetify version, or create a newer Front-end altogether in Vue 3
with the *Quasar Framework*.

# PROJECT LICENSE

*Interlock Copyright (C) 2022-2024 | Dylan Blanqué, BR Consulting S.R.L.*

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://fsf.org/>.

This program comes with ABSOLUTELY NO WARRANTY.
