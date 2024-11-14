import * as apiOD from './apiOneDrive.js';
import * as apiTODO from './apiTodo.js';

document.addEventListener("DOMContentLoaded", async function () {
    const connectionOfficeId = "connectionOffice";
    const contentId = "content";
    const clientId = '001a9dc9-24d4-4dee-8603-0c47505b7e18'; 
    const tenantId = '906ab908-04f9-4a80-ba9c-875a36e77bc1'; 
    const redirectUri = chrome.identity.getRedirectURL(); 
    const scopes = 'openid profile User.Read Files.ReadWrite'; 
    let token;
    console.log(redirectUri);
    
    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    try {
        token = await apiOD.authenticateWithMicrosoft(authUrl, false);
    }
    catch {
        token = null;
    }       

    if (!token || token === null ) {  
        
        const warningMessage = document.createElement('p');
        warningMessage.textContent = "Merci de vous connecter sur ";

        // Créer le lien de connexion
        const connectLink = document.createElement('a');
        connectLink.textContent = "Eduvaud";
        connectLink.href = "#";  

        warningMessage.appendChild(connectLink);
        warningMessage.append(" puis de rafraîchir cette page. Après cela, veuillez cliquer sur ");
        const startExportButton = document.createElement('strong');
        startExportButton.textContent = "Démarrer l'export";
 
        warningMessage.appendChild(startExportButton);
        
        document.getElementById(connectionOfficeId).style.display = "block";
        document.getElementById(connectionOfficeId).appendChild(warningMessage);
        
        connectLink.addEventListener("click", async function (e) {
            e.preventDefault();
            token = await apiOD.authenticateWithMicrosoft(authUrl, true);
            return;
        });
        return;
    }   
    
    

    const tasksList = await apiOD.getTasksFile("tasksList.json", token);     
    const tasksTable = apiTODO.createTable(tasksList.tasks);
    document.getElementById(contentId).appendChild(tasksTable);
    


    
});
