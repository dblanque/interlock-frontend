# Interlock LDAP Manager

Logo Font:
Matamata [@ dafont.com](https://www.dafont.com/matamata.font)
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

## LDAP Manager Checkpoints | ROAD-MAP & Features

### LDAP Directory Tree
 - [x] Recursive Read
 - [ ] Move Objects
 - [ ] Rename Objects
 - [ ] Delete Objects

### Organizational Unit Management
 - [ ] Create
 - [x] Read
 - [ ] Update
      - [ ] Move OU to another CN in the Dirtree
 - [ ] Delete

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

TBD

### Server Management
This tab will require to have an ssh key or be the locally installed server
 - [ ] Start Service
 - [ ] Stop Service
 - [ ] Restart Service
 - [ ] Restart Server
 - [ ] Update Server
 - [ ] Add Secondary Domain Controller?
 - [ ] Remove Domain Controller?

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

# PROJECT LICENSE

*Interlock Copyright (C) 2022 | Dylan Blanqué, BR Consulting S.R.L.*

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

This program comes with ABSOLUTELY NO WARRANTY.
