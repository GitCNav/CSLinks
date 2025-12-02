import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Trash2, Edit, Users, Link, Settings, Shield, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Reader {
  id: string;
  label: string;
  url: string;
  media_type: string;
  language: string;
  enabled: boolean;
  tmdb_id: number;
}

interface UserData {
  id: string;
  username: string;
  avatar_url: string | null;
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
  
  // Form state
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    media_type: 'movie',
    language: 'VOSTFR',
    tmdb_id: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('Accès non autorisé');
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch readers
    const { data: readersData, error: readersError } = await supabase
      .from('readers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (readersData) {
      setReaders(readersData);
    }

    // Fetch users (profiles)
    const { data: usersData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (usersData) {
      setUsers(usersData);
    }
    
    setLoading(false);
  };

  const notifyDiscord = async (type: string, data: object) => {
    try {
      await supabase.functions.invoke('discord-webhook', {
        body: { type, data }
      });
    } catch (error) {
      console.error('Failed to notify Discord:', error);
    }
  };

  const handleAddReader = async () => {
    if (!formData.label || !formData.url || !formData.tmdb_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    
    const { data, error } = await supabase
      .from('readers')
      .insert({
        label: formData.label,
        url: formData.url,
        media_type: formData.media_type,
        language: formData.language,
        tmdb_id: formData.tmdb_id,
        enabled: true,
        created_by: user?.id
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de l\'ajout: ' + error.message);
    } else {
      toast.success('Source ajoutée avec succès');
      setReaders([data, ...readers]);
      setDialogOpen(false);
      resetForm();
      
      notifyDiscord('source_added', {
        name: formData.label,
        url: formData.url,
        type: formData.media_type
      });
    }
    
    setSaving(false);
  };

  const handleUpdateReader = async () => {
    if (!editingReader) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from('readers')
      .update({
        label: formData.label,
        url: formData.url,
        media_type: formData.media_type,
        language: formData.language,
        tmdb_id: formData.tmdb_id
      })
      .eq('id', editingReader.id);

    if (error) {
      toast.error('Erreur lors de la mise à jour: ' + error.message);
    } else {
      toast.success('Source mise à jour');
      fetchData();
      setDialogOpen(false);
      setEditingReader(null);
      resetForm();
    }
    
    setSaving(false);
  };

  const handleDeleteReader = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette source?')) return;
    
    const { error } = await supabase
      .from('readers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression: ' + error.message);
    } else {
      toast.success('Source supprimée');
      setReaders(readers.filter(r => r.id !== id));
    }
  };

  const handleToggleReader = async (id: string, enabled: boolean) => {
    const { error } = await supabase
      .from('readers')
      .update({ enabled })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      setReaders(readers.map(r => r.id === id ? { ...r, enabled } : r));
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      url: '',
      media_type: 'movie',
      language: 'VOSTFR',
      tmdb_id: 0
    });
  };

  const openEditDialog = (reader: Reader) => {
    setEditingReader(reader);
    setFormData({
      label: reader.label,
      url: reader.url,
      media_type: reader.media_type,
      language: reader.language,
      tmdb_id: reader.tmdb_id
    });
    setDialogOpen(true);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sources</p>
                  <p className="text-2xl font-bold">{readers.length}</p>
                </div>
                <Link className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Actives</p>
                  <p className="text-2xl font-bold">{readers.filter(r => r.enabled).length}</p>
                </div>
                <Settings className="w-8 h-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Désactivées</p>
                  <p className="text-2xl font-bold">{readers.filter(r => !r.enabled).length}</p>
                </div>
                <Settings className="w-8 h-8 text-red-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sources">
              <Link className="w-4 h-4 mr-2" />
              Sources
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Gestion des sources</h2>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) {
                  setEditingReader(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une source
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingReader ? 'Modifier la source' : 'Nouvelle source'}</DialogTitle>
                    <DialogDescription>
                      {editingReader ? 'Modifiez les informations de la source' : 'Ajoutez une nouvelle source de streaming'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="label">Nom *</Label>
                      <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="Ex: One Piece - Egghead"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">URL *</Label>
                      <Input
                        id="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={formData.media_type}
                          onValueChange={(value) => setFormData({ ...formData, media_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="movie">Film</SelectItem>
                            <SelectItem value="tv">Série</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Langue</Label>
                        <Select
                          value={formData.language}
                          onValueChange={(value) => setFormData({ ...formData, language: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VOSTFR">VOSTFR</SelectItem>
                            <SelectItem value="VF">VF</SelectItem>
                            <SelectItem value="VO">VO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tmdb_id">TMDB ID *</Label>
                      <Input
                        id="tmdb_id"
                        type="number"
                        value={formData.tmdb_id || ''}
                        onChange={(e) => setFormData({ ...formData, tmdb_id: parseInt(e.target.value) || 0 })}
                        placeholder="123456"
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={editingReader ? handleUpdateReader : handleAddReader}
                      disabled={saving}
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      {editingReader ? 'Mettre à jour' : 'Ajouter'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Langue</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : readers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucune source ajoutée
                      </TableCell>
                    </TableRow>
                  ) : (
                    readers.map((reader) => (
                      <TableRow key={reader.id}>
                        <TableCell className="font-medium">{reader.label}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {reader.url}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{reader.media_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{reader.language}</Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={reader.enabled}
                            onCheckedChange={(checked) => handleToggleReader(reader.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(reader)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteReader(reader.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <h2 className="text-lg font-semibold">Utilisateurs inscrits</h2>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Code ami</TableHead>
                    <TableHead>Inscrit le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        Aucun utilisateur
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((userData) => (
                      <TableRow key={userData.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {userData.username?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <span className="font-medium">{userData.username}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{userData.friend_code}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(userData.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
