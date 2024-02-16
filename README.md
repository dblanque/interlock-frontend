# Interlock LDAP Manager

[Interlock Website](https://interlock.brconsulting.info/)

Logo Font:
Matamata [@ dafont.com](https://www.dafont.com/matamata.font)

## UPDATE: 2024-01-11

The Interlock Front-end has been migrated to Vite instead of Webpack/Vue-CLI,
hence there will be performance improvements when running the dev-server and on the
final compiled version. YARN PKG is no longer used, use NPM instead.

# Interlock Documentation

For information and official Interlock Documentation go to:
[BR Consulting S.R.L. Documentation - Interlock](https://docs.brconsulting.info/sphinx/en/docs/Development/Interlock/00-ilck-overview.html)

## Installation from Source

  1. Install the following dependencies, for more info see
  [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager).
  ```bash
  apt-get install git nodejs nginx
  ```

  2. Clone the repository: git clone https://github.com/dblanque/interlock-ldap-manager /opt/interlock-ldap-manager
  3. Change Directory onto the cloned repository
  ```bash
  cd /opt/interlock-ldap-manager
  npm install
  ```
  4. Once the required dependencies are installed you'll need to modify your local settings to match your back-end IP/Port:
  ```bash
  # On the Dev Server Version
  nano ./public/config/local.json

  # On the Compiled Version
  nano ./dist/config/local.json
  ```

## LDAP Manager Checkpoints | ROAD-MAP & Features

### LDAP Directory Tree
 - [x] Recursive Read
 - [x] Move Objects
 - [x] Rename Objects
 - [x] Delete Objects

### Organizational Unit Management
 - [x] Create
 - [x] Read
 - [x] Update
      - [x] Move OU to another CN in the Dirtree
 - [x] Delete

### User & Permissions Management
 - [x] Create
 - [x] Read
 - [x] Update
      - [x] Standard LDAP Attribute Updates
      - [x] Permission Parsing and Updates
      - [x] Enable/Disable User Functionality
      - [x] Unlock User
      - [x] User Group Membership management
      - [x] End-user Password Changing
 - [x] Delete

### Group Management
 - [x] Create
 - [x] Read
 - [x] Update
      - [x] Standard LDAP Attribute Updates
      - [x] Group Member Management
      - [x] Group Type and Scope 
 - [x] Delete

### DNS Management

 - [x] Create DNS Entries
 - [x] Modify DNS Entries
 - [x] Delete DNS Entries
 - [x] Supported Types should at least be:
    * [x] A
    * [x] AAAA
    * [x] CNAME
    * [x] TXT
    * [x] MX
    * [ ] DS
    * [x] NS
    * [x] SOA
    * [x] PTR

### GPO Management

Group Policy Object Management is one of the main reasons as to why I started this project.
I still haven't found a way to make this work from a Django Backend through an LDAP Connector.
If you're interested in contributing, feel free to do so!

### Server Management
*This might never be implemented.*
This tab will require to have an ssh key or be the locally installed server
 - [ ] Start Service
 - [ ] Stop Service
 - [ ] Restart Service
 - [ ] Restart Server
 - [ ] Update Server
 - [ ] Add Secondary Domain Controller?
 - [ ] Remove Domain Controller?

## Project setup
```bash
workpath="/var/lib/interlock"
frontendPath="/var/lib/interlock/interlock_frontend"

apt-get update -y

# Install curl and fetch required script.
apt-get install git curl -y

curl -sL https://deb.nodesource.com/setup_18.x -o "$workpath/nodesource_setup.sh"

# Add nodesource repo
bash "$workpath/nodesource_setup.sh"

# Install NodeJS
apt-get update -y
apt-get install nodejs -y

git clone https://github.com/dblanque/interlock_frontend $frontendPath

cd $frontendPath
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
