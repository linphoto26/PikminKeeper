import { CollectionItem } from '../types';

// TODO: 請在此處填入您的 Google Cloud Console 資訊
// 1. 前往 https://console.cloud.google.com/
// 2. 建立新專案
// 3. 啟用 "Google Drive API"
// 4. 設定 OAuth 同意畫面 (新增測試使用者)
// 5. 建立憑證 (OAuth 2.0 用戶端 ID -> 網頁應用程式)
// 6. 重要：在授權的 JavaScript 來源 加入您的應用程式網域 (例如 http://localhost:3000 或預覽連結)
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; 
const API_KEY = 'YOUR_GOOGLE_API_KEY'; 

// const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']; 
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'pikmin-keeper-data.json';

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

export const initGoogleDrive = (onUserUpdate: (user: any) => void) => {
  const gapi = (window as any).gapi;
  const google = (window as any).google;

  return new Promise<void>((resolve, reject) => {
    // Safety Check: Gracefully handle missing credentials
    if (CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID' || API_KEY === 'YOUR_GOOGLE_API_KEY') {
        console.warn('Google Drive integration pending: Missing CLIENT_ID or API_KEY in services/driveService.ts. App running in offline mode.');
        // Resolve instead of reject to prevent App crash/error logs. 
        // User will be alerted only when they try to click Login.
        resolve();
        return;
    }

    // 1. Init GAPI (Drive API)
    if (!gapi) {
        reject(new Error("Google API script not loaded"));
        return;
    }

    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          // discoveryDocs: DISCOVERY_DOCS, // Removing explicit discovery docs to fix "missing required fields" error
        });
        
        // Load Drive API v3 directly
        await gapi.client.load('drive', 'v3');

        gapiInited = true;
        checkAuth();
      } catch (err) {
        console.error('GAPI Init Error:', err);
        // Don't reject here if it's just a network issue, let app load
        // reject(err); 
        resolve(); 
      }
    });

    // 2. Init GIS (Auth)
    if (!google) {
        reject(new Error("Google Identity Services script not loaded"));
        return;
    }

    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp: any) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            // Auth success
            if (resp.access_token) {
                await fetchUserProfile(resp.access_token, onUserUpdate);
            }
            resolve();
        },
        });
        gisInited = true;
        checkAuth();
    } catch (err) {
        console.error('GIS Init Error:', err);
        // Don't reject here either
        resolve();
    }

    function checkAuth() {
        if (gapiInited && gisInited) resolve();
    }
  });
};

const fetchUserProfile = async (accessToken: string, callback: (user: any) => void) => {
    try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const profile = await res.json();
        callback({
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
            accessToken: accessToken
        });
    } catch (e) {
        console.error("Failed to fetch user profile", e);
    }
};

export const handleLogin = () => {
  // Check for credentials before attempting login
  if (CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID' || API_KEY === 'YOUR_GOOGLE_API_KEY') {
    alert('Google 服務尚未設定。\n\n請開啟 services/driveService.ts 檔案，並填入您從 Google Cloud Console 取得的 CLIENT_ID 與 API_KEY。');
    return;
  }

  if (tokenClient) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when we prompt here, the callback defined in initTokenClient will be triggered.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    console.warn('Google Identity Services not initialized yet');
    // alert('Google 服務初始化中或失敗，請稍後再試。');
  }
};

export const handleLogout = () => {
    const google = (window as any).google;
    const gapi = (window as any).gapi;
    if (google && google.accounts && google.accounts.oauth2) {
        // There is no direct "logout" in GIS, but we can revoke the token.
        // For simple UX, we just reload the page or clear local state.
        const token = gapi.client.getToken();
        if (token && token.access_token) {
            google.accounts.oauth2.revoke(token.access_token, () => {
                console.log('Access token revoked');
            });
        }
        gapi.client.setToken('');
    }
};

/**
 * Searches for the app data file on Drive.
 * Returns the file ID if found, null otherwise.
 */
const findFileId = async (): Promise<string | null> => {
  const gapi = (window as any).gapi;
  if (!gapiInited) return null;
  
  try {
    const response = await gapi.client.drive.files.list({
      q: `name = '${FILE_NAME}' and trashed = false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });
    const files = response.result.files;
    if (files && files.length > 0) {
      return files[0].id;
    }
    return null;
  } catch (err) {
    console.error('Error finding file:', err);
    return null;
  }
};

/**
 * Loads collection data from Google Drive.
 */
export const loadFromDrive = async (): Promise<CollectionItem[] | null> => {
    const gapi = (window as any).gapi;
    if (!gapiInited) return null;

    try {
        const fileId = await findFileId();
        if (!fileId) return null;

        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media',
        });
        
        return response.result as CollectionItem[];
    } catch (err) {
        console.error('Error loading from Drive:', err);
        return null;
    }
};

/**
 * Saves collection data to Google Drive.
 * If file exists, updates it. If not, creates it.
 */
export const saveToDrive = async (data: CollectionItem[]): Promise<void> => {
    const gapi = (window as any).gapi;
    if (!gapiInited) return; // Silent return if not inited

    const fileContent = JSON.stringify(data);
    
    try {
        const fileId = await findFileId();

        const fileMetadata = {
            name: FILE_NAME,
            mimeType: 'application/json',
        };

        if (fileId) {
            // Update existing file
            await gapi.client.request({
                path: `/upload/drive/v3/files/${fileId}`,
                method: 'PATCH',
                params: { uploadType: 'media' },
                body: fileContent
            });
            console.log('Updated file on Drive');
        } else {
            // Create new file
            const boundary = '-------314159265358979323846';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";

            const contentType = 'application/json';

            const multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(fileMetadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n\r\n' +
                fileContent +
                close_delim;

            await gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: { uploadType: 'multipart' },
                headers: {
                    'Content-Type': 'multipart/related; boundary="' + boundary + '"'
                },
                body: multipartRequestBody
            });
            console.log('Created new file on Drive');
        }
    } catch (err) {
        console.error('Error saving to Drive:', err);
        throw err;
    }
};