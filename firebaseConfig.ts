// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração das variáveis de ambiente
const firebaseEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Verificar variáveis obrigatórias
const requiredVars = ["apiKey", "authDomain", "projectId"];
const missingVars = requiredVars.filter(
  (key) => !firebaseEnvVars[key as keyof typeof firebaseEnvVars]
);

if (missingVars.length > 0) {
  console.error("❌ Missing Firebase environment variables:", missingVars);
  console.error("Make sure you have these variables in your .env.local file:");
  missingVars.forEach((varName) => {
    console.error(
      `NEXT_PUBLIC_FIREBASE_${varName.toUpperCase().replace("ID", "_ID")}`
    );
  });
  throw new Error(
    `Missing required Firebase environment variables: ${missingVars.join(", ")}`
  );
}

const firebaseConfig = {
  apiKey: firebaseEnvVars.apiKey,
  authDomain: firebaseEnvVars.authDomain,
  projectId: firebaseEnvVars.projectId,
  storageBucket: firebaseEnvVars.storageBucket,
  messagingSenderId: firebaseEnvVars.messagingSenderId,
  appId: firebaseEnvVars.appId,
};

// Log para desenvolvimento (remover em produção)
if (process.env.NODE_ENV === "development") {
  console.log("Firebase config loaded:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    // Não loggar a API key por segurança
  });
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
