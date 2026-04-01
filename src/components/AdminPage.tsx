import { useState, useEffect } from 'react';
import { db, logout, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User, Mail, Clock, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const path = 'users';
    const q = query(collection(db, path), orderBy('lastLogin', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 flex items-center gap-3">
              <ShieldCheck className="text-accent" size={40} />
              Admin Dashboard
            </h1>
            <p className="text-foreground/60">Manage and view all logged-in users.</p>
          </div>
          <button 
            onClick={() => logout()}
            className="flex items-center gap-2 px-6 py-3 glass rounded-2xl hover:bg-accent/10 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-2 border-accent/10 border-t-accent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="glass p-12 rounded-[40px] text-center">
            <User className="mx-auto mb-6 text-accent/20" size={64} />
            <h2 className="text-2xl font-display font-bold mb-2">No Users Yet</h2>
            <p className="text-foreground/60">When users sign in to your site, they will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {users.map((user) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden glass p-1">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent">
                      <User size={32} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 grid md:grid-cols-3 gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <User className="text-accent" size={20} />
                    <div>
                      <div className="text-xs uppercase tracking-widest opacity-50">Display Name</div>
                      <div className="font-bold">{user.displayName || 'Anonymous'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="text-accent" size={20} />
                    <div>
                      <div className="text-xs uppercase tracking-widest opacity-50">Email Address</div>
                      <div className="font-bold">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="text-accent" size={20} />
                    <div>
                      <div className="text-xs uppercase tracking-widest opacity-50">Last Login</div>
                      <div className="font-bold text-sm">
                        {new Date(user.lastLogin).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs font-mono opacity-30 select-all">
                  UID: {user.uid}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
