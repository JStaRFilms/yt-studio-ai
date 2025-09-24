import { Content } from '@google/genai';

export interface ChatMessage extends Content {
  // FIX: Explicitly define `role` and `parts` on ChatMessage.
  // The TypeScript compiler is failing to correctly infer these properties from
  // the extended `Content` type from the `@google/genai` package in this project context.
  // This change makes the properties explicit, resolving type errors across the application.
  role: 'user' | 'model';
  parts: { text: string; }[];
  timestamp: number;
  context: 'brainstorm' | 'assistant';
}

export interface Project {
  id?: number;
  title: string;
  script: string;
  createdAt: Date;
  updatedAt: Date;
  chatHistory?: ChatMessage[];
}

const DB_NAME = 'ScriptFlowDB';
const DB_VERSION = 3; // Incremented version for schema change
const STORE_NAME = 'projects';

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject('Database error');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = (event.target as IDBOpenDBRequest).transaction;
      let store: IDBObjectStore;

      // Handle initial store creation.
      // This runs when the database is first created (oldVersion is 0).
      if (!db.objectStoreNames.contains(STORE_NAME)) {
          store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      } else {
          store = transaction!.objectStore(STORE_NAME);
      }
      
      // Handle migration for users coming from a version older than 3.
      if (event.oldVersion > 0 && event.oldVersion < 3) {
          console.log(`Migrating data in '${STORE_NAME}' from v${event.oldVersion} to v${DB_VERSION}...`);

          store.openCursor().onsuccess = (e) => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
              const oldProject = cursor.value as any;
              
              // Only migrate if the old structure (`chatHistories` object) exists
              if (oldProject.chatHistories && typeof oldProject.chatHistories === 'object') {
                const newChatHistory: ChatMessage[] = [];
                let timestamp = new Date(oldProject.createdAt || Date.now()).getTime();

                const brainstormHistory = oldProject.chatHistories.brainstorm || [];
                const assistantHistory = oldProject.chatHistories.assistant || [];

                brainstormHistory.forEach((msg: Content) => {
                  newChatHistory.push({ ...(msg as any), context: 'brainstorm', timestamp: (timestamp += 1000) });
                });
                assistantHistory.forEach((msg: Content) => {
                  newChatHistory.push({ ...(msg as any), context: 'assistant', timestamp: (timestamp += 1000) });
                });

                newChatHistory.sort((a, b) => a.timestamp - b.timestamp);
                
                const newProject = { ...oldProject, chatHistory: newChatHistory };
                delete newProject.chatHistories;
                cursor.update(newProject);
              }
              cursor.continue();
            }
          };
      }
    };
  });
};

export const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const newProject: Omit<Project, 'id'> = {
        ...project,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const request = store.add(newProject);

    request.onsuccess = () => {
      resolve(request.result as number);
    };

    request.onerror = () => {
      console.error('Error adding project:', request.error);
      reject(request.error);
    };
  });
};

export const getAllProjects = async (): Promise<Project[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result.sort((a: Project, b: Project) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        };
        
        request.onerror = () => {
            console.error('Error getting all projects:', request.error);
            reject(request.error);
        };
    });
};

export const getProject = async (id: number): Promise<Project | undefined> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error(`Error getting project ${id}:`, request.error);
            reject(request.error);
        };
    });
};

export const updateProject = async (id: number, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<void> => {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    return new Promise<void>((resolve, reject) => {
        getRequest.onerror = () => reject(getRequest.error);
        
        getRequest.onsuccess = () => {
            const project = getRequest.result as Project | undefined;
            if (project) {
                const updatedProject = { 
                    ...project, 
                    ...updates, 
                    updatedAt: new Date() 
                };

                const putRequest = store.put(updatedProject);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
            } else {
                reject(`Project with id ${id} not found.`);
            }
        };
    });
};
