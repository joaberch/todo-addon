export function authenticateWithMicrosoft(authUrl, askForLogin, timeoutMs = 1000) {
    return new Promise((resolve, reject) => {
        let timer;

        const launchAuth = () => {
            chrome.identity.launchWebAuthFlow({
                url: authUrl,
                interactive: askForLogin
            }, (resultUrl) => {
                clearTimeout(timer);
                if (chrome.runtime.lastError) {
                    console.error('Erreur lors de l\'authentification:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else if (resultUrl) {
                    const url = new URL(resultUrl);
                    const accessToken = url.hash.match(/access_token=([^&]*)/)[1];
                    if (accessToken) {
                        resolve(accessToken);
                    } else {
                        reject(new Error('Token d\'accès manquant.'));
                    }
                } else {
                    reject(new Error('URL de résultat manquante.'));
                }
            });
        };

        if (askForLogin) {
            launchAuth();
        } else {
            const timeoutPromise = new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error('Timeout lors de la tentative d\'authentification.')), timeoutMs);
            });

            const authPromise = new Promise((resolve, reject) => {
                launchAuth();
            });

            Promise.race([authPromise, timeoutPromise])
                .then(resolve)  
                .catch(reject);  
        }
    });
}



export async function uploadTasksFile(filename, fileContent, accessToken) {
    const fileUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/addon_todo/${encodeURIComponent(filename)}`;
    const uploadUrl = `${fileUrl}:/content`;

    const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/octet-stream",
        "Content-Length": fileContent.length
    };
    const options = {
        method: "PUT",
        headers: headers,
        body: fileContent
    };    
   
    try {
        const response = await fetch(uploadUrl, options);

        if (response.ok) {
            return true;            
        }
        console.error(`HTTP error! Status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);        
    } 
    catch (error) {
        console.error(`Error uploading file:`, error);        
        throw error;
    }             
}


export async function getTasksFile(filename, accessToken) {    
    const fileUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/addon_todo/${encodeURIComponent(filename)}:/content`;

    try {
        const response = await fetch(fileUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            throw new Error(`Failed to fetch tasks file. Status: ${response.status}`);
        }

        // OneDrive
        const tasks = await response.json(); 
        return tasks;
        
    } catch (error) {
        console.error("Error fetching tasks file: ", error);
        throw error;
    }
}