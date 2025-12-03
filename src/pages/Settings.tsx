import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Palette, Bell, Shield, Globe, Moon, Sun, Check } from 'lucide-react';
import { toast } from 'sonner';

const themes = [
  { id: 'dark-purple', name: 'Purple Night', colors: ['#8B5CF6', '#1a1a2e'], isDark: true },
  { id: 'dark-blue', name: 'Ocean Deep', colors: ['#3B82F6', '#0f172a'], isDark: true },
  { id: 'dark-green', name: 'Forest', colors: ['#22C55E', '#14532d'], isDark: true },
  { id: 'dark-pink', name: 'Sakura', colors: ['#EC4899', '#1f1f1f'], isDark: true },
  { id: 'dark-orange', name: 'Sunset', colors: ['#F97316', '#1c1917'], isDark: true },
  { id: 'dark-cyan', name: 'Neon', colors: ['#06B6D4', '#0a0a0a'], isDark: true },
  { id: 'light-purple', name: 'Lavender', colors: ['#8B5CF6', '#faf5ff'], isDark: false },
  { id: 'light-blue', name: 'Sky', colors: ['#3B82F6', '#f0f9ff'], isDark: false },
  { id: 'light-green', name: 'Mint', colors: ['#22C55E', '#f0fdf4'], isDark: false },
  { id: 'light-pink', name: 'Rose', colors: ['#EC4899', '#fdf2f8'], isDark: false },
];

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('dark-purple');
  const [notifications, setNotifications] = useState({
    newContent: true,
    updates: true,
    recommendations: false,
  });
  const [language, setLanguage] = useState('fr');
  const [autoPlay, setAutoPlay] = useState(true);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    toast.success('Thème appliqué');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Paramètres</h1>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-4 block">Thèmes sombres</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {themes.filter(t => t.isDark).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`relative p-1 rounded-xl transition-all ${
                        selectedTheme === theme.id ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'
                      }`}
                    >
                      <div
                        className="w-full aspect-video rounded-lg flex items-end justify-center overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`,
                        }}
                      >
                        {selectedTheme === theme.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-center mt-1 text-muted-foreground">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-4 block">Thèmes clairs</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {themes.filter(t => !t.isDark).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`relative p-1 rounded-xl transition-all ${
                        selectedTheme === theme.id ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'
                      }`}
                    >
                      <div
                        className="w-full aspect-video rounded-lg flex items-end justify-center overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`,
                        }}
                      >
                        {selectedTheme === theme.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-center mt-1 text-muted-foreground">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Gérez vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Nouveau contenu</Label>
                  <p className="text-sm text-muted-foreground">Soyez notifié des nouveaux films et séries</p>
                </div>
                <Switch
                  checked={notifications.newContent}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newContent: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mises à jour</Label>
                  <p className="text-sm text-muted-foreground">Notifications sur les mises à jour de l'app</p>
                </div>
                <Switch
                  checked={notifications.updates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Recommandations</Label>
                  <p className="text-sm text-muted-foreground">Suggestions personnalisées basées sur vos goûts</p>
                </div>
                <Switch
                  checked={notifications.recommendations}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, recommendations: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language & Playback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Langue & Lecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Langue préférée</Label>
                  <p className="text-sm text-muted-foreground">Langue des métadonnées</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Lecture automatique</Label>
                  <p className="text-sm text-muted-foreground">Lancer automatiquement l'épisode suivant</p>
                </div>
                <Switch
                  checked={autoPlay}
                  onCheckedChange={setAutoPlay}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Télécharger mes données
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
