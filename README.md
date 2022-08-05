# Interlock LDAP Manager

## Installation

  1. Install the following dependencies
  ```bash
  apt-get install git nodejs nginx

  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

  sudo apt update && sudo apt install yarn
  ```

  2. Clone the repository: git clone https://github.com/dblanque/interlock-ldap-manager /opt/interlock-ldap-manager
  3. Change Directory onto the cloned repository
  ```bash
  cd /opt/interlock-ldap-manager
  yarn install
  ```
  4. Once the required dependencies are installed you'll need to modify your local settings to match your domain:
  ```bash
  nano ./src/providers/interlock_backend/local_settings.js
  ```

## LDAP Manager Checkpoints | ROAD-MAP

### User & Permissions Management
 - Create
 - Modify (Add to group, Attributes, etc.)
 - Password Reset Screen for End-Users
 - Delete

### DNS Management

 - Create DNS Entries
 - Modify DNS Entries
 - Delete DNS Entries
 - Supported Types should at least be:
    * A
    * AAAA
    * CNAME
    * TXT
    * MX
    * DS
    * NS
    * SOA
    * SPF
    * PTR

### GPO Management

TBD

### Server Management
 - Start Service
 - Stop Service
 - Restart Service
 - Restart Server
 - Update Server
 - Add Secondary Domain Controller?
 - Remove Domain Controller?

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
