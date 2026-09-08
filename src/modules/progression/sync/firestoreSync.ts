import type { UserStats } from '../../../types/kana';

const TIMEOUT_MS = 20000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout (${timeoutMs}ms) vid ${operationName}`)), timeoutMs);
    })
  ]);
}

/**
 * Strips all undefined properties recursively so Firestore setDoc never encounters unsupported undefined values.
 */
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

const loadFirestore = async () => {
  const [{ doc, getDoc, getFirestore, setDoc }, { getFirebaseApp }] = await Promise.all([
    import('firebase/firestore'),
    import('../../../config/firebase')
  ]);

  return {
    db: getFirestore(getFirebaseApp()),
    doc,
    getDoc,
    setDoc
  };
};

export async function fetchUserStatsFromFirestore(userId: string): Promise<UserStats | null> {
  const { db, doc, getDoc } = await loadFirestore();
  const snap = await withTimeout(
    getDoc(doc(db, 'users', userId)),
    TIMEOUT_MS,
    'hämtning från Firestore'
  );

  if (!snap.exists()) {
    return null;
  }

  const data = snap.data();
  return data?.stats ? (data.stats as UserStats) : null;
}

export async function saveUserStatsToFirestore(
  userId: string,
  stats: UserStats,
  userProfile?: { displayName?: string | null; email?: string | null; photoURL?: string | null }
): Promise<boolean> {
  const { db, doc, setDoc } = await loadFirestore();
  const payload = sanitizeForFirestore({
    stats,
    profile: {
      displayName: userProfile?.displayName ?? null,
      email: userProfile?.email ?? null,
      photoURL: userProfile?.photoURL ?? null
    },
    updatedAt: new Date().toISOString()
  });

  await withTimeout(
    setDoc(doc(db, 'users', userId), payload, { merge: true }),
    TIMEOUT_MS,
    'sparning till Firestore'
  );
  return true;
}
