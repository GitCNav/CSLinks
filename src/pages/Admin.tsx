import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Button, Card, CardContent, CardHeader, CardTitle,
  Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger, Badge, Switch,
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui';
import { ArrowLeft, Plus, Trash2, Edit, Users, Link, Settings, Shield, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Reader {
  id: string;
  label: string;
  url: string;
  media_type: 'movie' | 'tv';
  language: 'VOSTFR' | 'VF' | 'VO';
  enabled: boolean;
  tmdb_id: number;
}

interface UserData {
  id: string;
  username: string;
  avatar_url?: string | null;
  friend_code: string;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [readers, setReaders] = useState<Reader[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReader, setEditingReader] = useState<Reader | null>(null);

  const [formData, setFormData] = useState<Omit<Reader, 'id' | 'enabled'>>({
    label: '',
    url: '',
    media_type: 'movie',
    language: 'VOSTFR',
    tmdb_id: 0,
  });

  /** 🔹 Fetch data */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [{ data: readersData, error: readersError }, { data: usersData, error: usersError }] = await Promise.all([
        supabase.from('readers').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      ]);

      if (readersError) throw readersError;
      if (usersError) throw usersError;

      setReaders(readersData ?? []);
      setUsers(usersData ?? []);
    } catch (err: any) {
      toast.error(`Erreur lors du chargement: ${err?.message ?? JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('Accès non autorisé');
      return;
    }
    fetchData();
  }, [isAdmin, navigate, fetchData]);

  /** 🔹 Reset form */
  const resetForm = useCallback(() => {
    setFormData({ label: '', url: '', media_type: 'movie', language: 'VOSTFR', tmdb_id: 0 });
  }, []);

  /** 🔹 Add reader */
  const handleAddReader = async () => {
    if (!formData.label || !formData.url || !formData.tmdb_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('readers')
        .insert({ ...formData, enabled: true, created_by: user?.id })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setReaders((prev) => [data, ...prev]);
        toast.success('Source ajoutée avec succès');
        setDialogOpen(false);
        resetForm();
      }
    } catch (err: any) {
      toast.error(`Erreur lors de l'ajout: ${err?.message ?? JSON.stringify(err)}`);
    } finally {
      setSaving(false);
    }
  };

  /** 🔹 Update reader */
  const handleUpdateReader = async () => {
    if (!editingReader) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('readers')
        .update(formData)
        .eq('id', editingReader.id);

      if (error) throw error;

      setReaders((prev) =>
        prev.map((r) => (r.id === editingReader.id ? { ...r, ...formData } : r))
      );
      toast.success('Source mise à jour');
      setDialogOpen(false);
      setEditingReader(null);
      resetForm();
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour: ${err?.message ?? JSON.stringify(err)}`);
    } finally {
      setSaving(false);
    }
  };

  /** 🔹 Delete reader */
  const handleDeleteReader = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette source?')) return;

    try {
      const { error } = await supabase.from('readers').delete().eq('id', id);
      if (error) throw error;

      setReaders((prev) => prev.filter((r) => r.id !== id));
      toast.success('Source supprimée');
    } catch (err: any) {
      toast.error(`Erreur lors de la suppression: ${err?.message ?? JSON.stringify(err)}`);
    }
  };

  /** 🔹 Toggle reader */
  const handleToggleReader = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase.from('readers').update({ enabled }).eq('id', id);
      if (error) throw error;

      setReaders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)));
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour du statut: ${err?.message ?? JSON.stringify(err)}`);
    }
  };

  /** 🔹 Open edit dialog */
  const openEditDialog = (reader: Reader) => {
    setEditingReader(reader);
    setFormData({
      label: reader.label,
      url: reader.url,
      media_type: reader.media_type,
      language: reader.language,
      tmdb_id: reader.tmdb_id,
    });
    setDialogOpen(true);
  };

  if (!isAdmin) return null;

  /** 🔹 Stats memo */
  const stats = useMemo(() => ({
    total: readers.length,
    active: readers.filter((r) => r.enabled).length,
    inactive: readers.filter((r) => !r.enabled).length,
    users: users.length,
  }), [readers, users]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="Retour">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-destructive to-destructive/60 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="pt-6"><p>Sources</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p>Utilisateurs</p><p className="text-2xl font-bold">{stats.users}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p>Actives</p><p className="text-2xl font-bold">{stats.active}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p>Désactivées</p><p className="text-2xl font-bold">{stats.inactive}</p></CardContent></Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sources" className
