import type { UserStats } from '../../../types/kana';

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
  try {
    const { db, doc, getDoc } = await loadFirestore();
    const snap = await getDoc(doc(db, 'users', userId));
    const data = snap.exists() ? snap.data() : null;
    return data?.stats ? data.stats as UserStats : null;
  } catch (err) {
    console.error('Error fetching stats from Firestore:', err);
    return null;
  }
}

export async function saveUserStatsToFirestore(
  userId: string,
  stats: UserStats,
  userProfile?: { displayName?: string | null; email?: string | null; photoURL?: string | null }
): Promise<boolean> {
  try {
    const { db, doc, setDoc } = await loadFirestore();
    await setDoc(doc(db, 'users', userId), {
      stats,
      profile: userProfile || null,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving stats to Firestore:', err);
    return false;
  }
}
