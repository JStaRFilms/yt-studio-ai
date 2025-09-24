import { Content } from '@google/genai';

export interface Project {
  id?: number;
  title: string;
  script: string;
  createdAt: Date;
  updatedAt: Date;
  chatHistories?: {
    brainstorm: Content[];
    assistant: Content[];
  };
}

const DB_NAME = 'ScriptFlowDB';
const DB_VERSION = 2; // Incremented version for schema change
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
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      // Schema migration logic can be added here if needed for future versions.
    };
  });
};

export const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const newProject: Omit<Project, 'id'> = {
        title: project.title,
        script: project.script,
        chatHistories: {
          brainstorm: project.chatHistories?.brainstorm || [],
          assistant: [],
        },
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
            // Sort by most recently updated
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
                // Deep merge chatHistories
                const newChatHistories = {
                    brainstorm: updates.chatHistories?.brainstorm ?? project.chatHistories?.brainstorm ?? [],
                    assistant: updates.chatHistories?.assistant ?? project.chatHistories?.assistant ?? [],
                };

                const updatedProject = { 
                    ...project, 
                    ...updates, 
                    chatHistories: newChatHistories,
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