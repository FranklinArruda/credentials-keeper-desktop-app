# Electron Desktop App - Credencials Keeper <img src="renderer/assets/icon/appIcon.png" width="40" height="40">


[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

### Credentials Keeper
While on College Break, I took the initiative to create my own Credentials Keeper manager. It is a cross-platform desktop application built using the Electron framework for Windows and Linux operating systems.

The idea originated from a personal perspective. It is never 100% secure saving personal information such as passwords as well as phone numbers up in the cloud or any other third-party online application that provides password management. In one hand, that can be really useful and faster, but on the other hand, it makes us very unsafe from their resources.

Since it is standalone application, I decided to create CSV generator and import so whenever the user decides to reboot their machines, they will have the option of saving the data into CSV file, thus, importing the same file from the system into the application again. Also, a cool 'search engine' that provides users easier way to filter their data. 

The app is designed to provide a rich desktop experience with a focus on user-friendly interactions and some cool features like passwords and phone numbers management with internal database using sqlite3 that requires a password to log into the system created upon registration once app is installed.

The data is persistent so that means save once and every time you run the application it will be populated dynamically on page load. It is rich in features like an action button to delete a specific data row, refresh page button, import and export CSV files.




#### Home Page
<img src="https://github.com/user-attachments/assets/819bf938-a840-4733-ae69-280c6b8939b4" alt="Screenshot_1" width="700"/>

#### Demo Video
https://github.com/FranklinArruda/credentials-keeper/assets/102427836/f22c9be2-21a9-4e77-8cc9-56e3f4791649

#### Prototype Link
```javascript
https://www.figma.com/proto/diRLnXmsKL2dcBOvBn5VTh/DESKTOP_CREDENTIALS_SAVER_APP?page-id=0%3A1&type=design&node-id=3-2&viewport=371%2C-588%2C0.53&t=3vu2AipCJXFDKm8R-1&scaling=min-zoom
```

## Table of Contents
- [Features](#features)
  - [1. User Interface (UI)](#1-user-interface-ui)
    - [1.1 Home Page](#11-home-page)
    - [1.2 Registration Section](#12-registration-section)
    - [1.3 Login Section](#13-login-section)
    - [1.4 Recover Password Section](#14-recover-password-section)
    - [1.5 System Section](#15-system-section)
  - [2. Database and Logic](#2-database-and-logic)
  - [3. Menu and About Window](#3-menu-and-about-window)
  - [4. Generate CSV](#4-generate-csv)
  - [5. Copy to Clipboard](#5-copy-to-clipboard)
- [Inter Process Communication](#inter-process-communication)
  - [User Registration](#user-registration)
  - [Login Request](#login-request)
  - [Password Request](#password-request)
  - [Credentials System](#credentials-system)
  - [Phone System](#phone-system)
- [Getting Started](#getting-started)
- [Developer Mode](#developer-mode)
- [Technologies Used](#technologies-used)
- [Download Versions](#download-versions)
- [Contribution](#contribution)
- [License](#license)
- [Contact](#contact)

## Features
### 1. User Interface (UI)


#### 1.1 Home Page
- Engaging starting animation with a floating icon and parallelogram.
- Registration and login panel for user authentication.
- Header template with about window which contains version information, author details, and an exit option.

#### 1.2 Registration Section
- User-friendly form for inputting full name, username, password, and a hint secret word.
- Real-time validation with color-coded indicators for user input correctness.
- Floating pop-up message upon successful registration.

#### 1.3 Login Section
- Login panel for entering the password.
- Back navigation button for user convenience.
- "Forgot password" button for password recovery.

#### 1.4 Recover Password Section
- Panel for entering the hint secret word for password recovery.
- Options to redirect to login or return to the home section.
- Pop-up messages for successful password recovery and time-based password visibility.

#### 1.5 System Section
- Feature-rich dashboard with accessible tabs for credentials and phone number systems.
- Input forms for each system with floating placeholders and dynamic bottom lines.
- Table with delete buttons, search bar, end session, and generate and import CSV files from its system.

### 2. Database and Logic

#### 2.1 Database Schema : The application uses an SQLite database with three main tables:

   ```javascript
   - User: Stores user registration details.
   - CredentialsManager: Manages user credentials data.
   - PhoneNumberManager: Manages user phone number data.
```

#### 2.2 Dynamic Database Connection

Dynamic database connection on main window creation.


#### 2.3 User Registration and Login Logic

- Dynamic database connection on main window creation.
- User registration and login logic with communication through IPC.
- Password retrieval based on hint secret word.
- Credentials and phone system functionalities, including storage, retrieval, deletion, and CSV generation.

















#### 2.4 Real-Time Data Updates and User Session Management
Credentials Keeper implements real-time data updates for a seamless user experience. Two key functionalities contribute to this dynamic behavior:

1. **Real-Time Data Retrieval and Addition**
   - Upon the system page's initial load and whenever the "Add" button is clicked, the application sends requests to the server to insert or retrieve data from the database. The server response triggers the population of the data table in real-time. This ensures that the latest information is always displayed to the user, maintaining synchronization between the frontend and backend.

     ```javascript
      // Example: Sending request to insert data into DB
      window.credentialsSystem.sendCredentialsToDatabase('sendCredentialsData', JSON.stringify(userCredentialsData));

      // Example: Sending request to retrieve data on page load
      window.credentialsSystem.requestCredentialsData('requestCredentialsData', LOGGED_IN_USER_ID);
     ```


2. **Real-Time Data Deletion and Page Refresh**

   - When the "Delete" button is clicked, the application captures the corresponding row's data, sends a request to the server for deletion, and refreshes the data table dynamically. This process mimics the initial page load behavior, providing real-time updates upon user actions.

     ```javascript
      // Example: Sending request to delete data from DB
      window.deleteCredentials.deleteCredentialsRequest('deleteCredentialsRequest', jsonString);

      // Example: Refreshing the table after successful deletion
      refreshCredentialsTable(LOGGED_IN_USER_ID);
     ```










### 3. Menu and About Window

- Simple menu structure with an "About" option that opens a separate window providing version information, author details, and contact information.

### 4. Generate CSV

- Utilizes the `csv-parser` and `csv-writer`library for generating CSVs.
- Capable of creating CSV documents for both the Credentials System and Phone System.

### 5. Copy to Clipboard

- Credentials Keeper provides a convenient "Copy to Clipboard" feature to quickly copy the content of a data row. When you click on any cell within the Credentials table, the corresponding data is copied to your clipboard.
How It Works

- The copyToClipboard function is triggered when you click on the data cells of the Credentials table. It utilizes the Clipboard API to copy the text content to your clipboard. A message is then displayed briefly to confirm successful copying.

#### Snippet of the code responsible for this functionality

```javascript
function copyToClipboard() {
    document.getElementById("outputTableCredentials").addEventListener("click", function (e) {
        if (e.target.tagName === "TD") {
            const textToCopy = e.target.textContent;

            // Use the Clipboard API to copy text to the clipboard
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Show the clipboard message
                    const clipboardMessage = document.getElementById("clipboardMessageCredentials");
                    clipboardMessage.style.display = "flex";

                    // Hide the message after a short delay
                    setTimeout(() => {
                        clipboardMessage.style.display = "none";
                    }, 1500);
                })
                .catch((err) => {
                    console.error('Unable to copy to clipboard:', err);
                });
        }
    });
}
```

## Inter Process Communication

#### User Registration
```javascript
// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("userRegistration", rendererToMain);
```

#### Login Request
```javascript
// Expose loginRequest to the window object
contextBridge

.exposeInMainWorld('loginRequest', loginRequest);
```

#### Password Request
```javascript
// Expose loginRequest to the window object
contextBridge.exposeInMainWorld('passwordRequest', passwordRequest);
```

#### Credentials System
```javascript
// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("credentialsSystem", credentialsSystem);
```

#### Phone System
```javascript
// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("phoneSystem", phoneSystem);
```
## Getting Started

To get started with the Credencials Keeper app, follow these steps:

#### 1. Clone the repository: 
```javascript
    git clone https://github.com/FranklinArruda/credentials-keeper-desktop-app.git
```

#### 2. Navigate to the project directory:
```javascript
    cd credentials-keeper-desktop-app 
```

#### 3. Install dependencies:
```javascript
    npm install
```

#### 4. Install electron:
```javascript
    npm install electron --save-dev
```

#### 5. Install csv-parser: 
```javascript 
    npm install csv-parser --save
```


#### 6. Install csv-writer:
```javascript 
    npm install csv-writer --save
``` 

#### 7. install sqlite3:
```javascript 
    npm install -E sqlite3@5.1.6
```

#### 8. install builder:(optional, unless you do not want to package)
```javascript 
    npm install -g electron-builder
```

#### 9. Run the app:
```javascript  
    npm start
```










## Requirement Dependencies Version

Before running the app, make sure you have the following installed on your system:

### Software Versions:
- **Python**: Version 3.13 (64-bit)
- **Node.js**: Version v22.12.0
- **Electron**: Version v25.9.8
- **SQLite3**: Version sqlite3@5.1.6

To check if these versions are installed, you can use the following commands:

- Python:
    ```bash
    python --version
    ```
- Node.js:
    ```bash
    node --version
    ```
- Electron:
    ```bash
    npx electron --version
    ```
- SQLite3:
    ```bash
    npm list sqlite3
    ```

#### Note
Note: You also need to install sqlite3, the command to install is: `npm install sqlite3`. However, you will be getting an error when packagin the app, and although the 
app will be working as expected, but it won't run the `electron-builder` for it to package etc. 

#### The below error will pop out:

![Screenshot_3](https://github.com/FranklinArruda/credentials-keeper-desktop-app/assets/102427836/d946cf00-bc41-49e5-bccc-4f4b46655124)

#### YOU MUST INSTALL `npm install -E sqlite3@5.1.6` for it to work.

#### Compatible versions: [see in releases](https://github.com/FranklinArruda/credentials-keeper-desktop-app/releases)


### Path ISSUE:

### Path Issue and Solution

While developing the app, I initially set the SQLite database path to a relative path (`./database.db`), which worked during development. However, after building the app with **electron-builder**, the relative path broke, as it changed after packaging, making the database inaccessible.

After researching, I realized that **`app.getPath('userData')`** provides a consistent, platform-specific path for storing app data, which works in both development and production. This solution ensures that the database is always accessible, regardless of the build state.

Here's the updated code:

```javascript
// ----- OLDER VERSION (Development Only) -----
// const dbPath = path.join(__dirname, '../database.db');

// ----- NEWER VERSION (Works After Building) -----
const { app } = require('electron');
const dbPath = path.join(app.getPath('userData'), 'database.db');
console.log(dbPath);
```




## Developer Mode

If your `NODE_ENV` is set to `development` then you will have the dev tools enabled and available in the menu bar. It will also open them by default.

When set to `production`, the dev tools will not be available.

## Technologies Used
- Electron
- Node.js
- HTML
- JavaScript (ES6+)
- SCSS + SCSS
- SQLite3
- Figma

## Feature Updates
- Search engine bar to iterate with the table data.
- PDF upload feature that will read it and save into the database and retrieve to the system on page load. This feature will be used only to the same PDF file generated from its system.

## Methodology Used
- I came up with my own project management setup using a spreadsheet, where rows represent different project aspects, and I track progress with blocks moving from left to right. It worked well, but now I'm thinking of switching to tools like KANBAN from agile methodology for better efficiency and collaboration. 🚀

<div style="display: flex;">
    <img src="/renderer/assets/images/methodology.png" width="500"/>
</div>


## Software Development Lifecycle (SDLC) 
Credentials Keeper adheres to software life cycle principles, including requirements analysis, design, implementation, testing, deployment, and maintenance. These principles was a valuable resource throuhout the process to create a reliable and maintainable application.

# Download Versions

#### windows 8 or later
### <img src="https://github.com/FranklinArruda/credentials-keeper-desktop-app/assets/102427836/afc326a5-ef43-42ee-808d-1c7afd65504f" alt="Windows Logo" width="40" height="40">
https://github.com/FranklinArruda/credentials-keeper/releases/tag/credentials-app-v1.0.0-windows


#### linux (debian)
### <img src="https://github.com/FranklinArruda/credentials-keeper-desktop-app/assets/102427836/3d634311-6e98-4e0e-b343-d053dfccf8e6" alt="Windows Logo" width="50" height="50">
https://github.com/FranklinArruda/credentials-keeper/releases/tag/credentials-app-v1.0.0-linux


## Contribution
I welcome contributions! If you have ideas for improvements or new features, please check our [contribution guidelines](CONTRIBUTING.md).

##  License 

This project is licensed under the [MIT License](LICENSE).

##  Contact

For any questions or suggestions, feel free to reach out to franklin.arrudaa@gmail.com
