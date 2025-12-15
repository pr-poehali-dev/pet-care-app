import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Pet, ShopItem, VetClinic, Mission } from '@/types/game';
import { INITIAL_PETS, SHOP_ITEMS, VET_CLINICS, INITIAL_MISSIONS, TUTORIAL_TIPS, calculateXPForLevel } from '@/data/gameData';

const Index = () => {
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [currentPetId, setCurrentPetId] = useState(1);
  const [stars, setStars] = useState(1500);
  const [clinics, setClinics] = useState<VetClinic[]>(VET_CLINICS);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [selectedClinic, setSelectedClinic] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  
  const currentPet = pets.find(p => p.id === currentPetId);
  const ownedPets = pets.filter(p => p.owned);
  const currentClinic = clinics.find(c => c.id === selectedClinic);
  const currentTutorial = currentPet && currentPet.level <= 10 ? TUTORIAL_TIPS.find(t => t.level === currentPet.level) : null;

  useEffect(() => {
    if (currentPet && currentPet.level <= 10 && currentTutorial) {
      setShowTutorial(true);
    }
  }, [currentPet?.level]);

  const addXP = (petId: number, baseXP: number) => {
    setPets(prev => prev.map(pet => {
      if (pet.id !== petId) return pet;
      
      const boostMultiplier = pet.boostLevel * 10;
      const totalXP = baseXP + boostMultiplier;
      let newXP = pet.xp + totalXP;
      let newLevel = pet.level;
      let xpToNext = pet.xpToNextLevel;

      while (newXP >= xpToNext && newLevel < 99) {
        newXP -= xpToNext;
        newLevel++;
        xpToNext = calculateXPForLevel(newLevel);
        toast.success(`🎉 ${pet.name} повысил уровень до ${newLevel}!`);
      }

      return { ...pet, xp: newXP, level: newLevel, xpToNextLevel: xpToNext };
    }));
  };

  const handleAction = (action: string, cost: number = 0) => {
    if (!currentPet || currentPet.isDead) {
      toast.error('Питомец мёртв! Используй прививку возрождения.');
      return;
    }
    
    setPets(prev => prev.map(pet => {
      if (pet.id !== currentPetId) return pet;
      
      let updates: Partial<Pet> = {};
      
      switch (action) {
        case 'feed':
          updates = { hunger: Math.min(100, pet.hunger + 25) };
          toast.success('🍖 Питомец накормлен!');
          addXP(pet.id, 10);
          updateMissionProgress(2, 1);
          break;
        case 'walk':
          const newSteps = pet.steps + 500;
          updates = { activity: Math.min(100, pet.activity + 30), steps: newSteps };
          toast.success('🚶 Прогулка завершена! +500 шагов');
          addXP(pet.id, 15);
          updateMissionProgress(1, 500);
          updateMissionProgress(4, 500);
          break;
        case 'vitamins':
          updates = { vitamins: Math.min(100, pet.vitamins + 20) };
          toast.success('💊 Витамины даны!');
          addXP(pet.id, 5);
          updateMissionProgress(3, 1);
          break;
        case 'heal':
          if (pet.isSick && cost > 0 && stars >= cost) {
            setStars(prev => prev - cost);
            const treatmentBonus = currentClinic?.treatmentBonus || 1;
            const healAmount = Math.floor(40 * treatmentBonus);
            updates = { isSick: false, sickness: undefined, health: Math.min(100, pet.health + healAmount) };
            toast.success(`💉 Питомец вылечен! +${healAmount} здоровья`);
          }
          break;
      }
      
      return { ...pet, ...updates };
    }));
  };

  const buyItem = (item: ShopItem) => {
    if (!currentPet) return;
    
    if (stars < item.price) {
      toast.error('❌ Недостаточно звёзд!');
      return;
    }

    setStars(prev => prev - item.price);

    if (item.type === 'revive') {
      setPets(prev => prev.map(pet => 
        pet.id === currentPetId ? { ...pet, isDead: false, health: 100 } : pet
      ));
      toast.success('💚 Питомец возрождён!');
      return;
    }

    if (item.type === 'booster' && item.boostLevel) {
      setPets(prev => prev.map(pet => 
        pet.id === currentPetId ? { ...pet, boostLevel: item.boostLevel! } : pet
      ));
      toast.success(`⚡ Ускоритель x${item.boostLevel} активирован!`);
      return;
    }

    if (item.effect) {
      setPets(prev => prev.map(pet => {
        if (pet.id !== currentPetId) return pet;
        
        return {
          ...pet,
          health: Math.min(100, pet.health + (item.effect?.health || 0)),
          hunger: Math.min(100, pet.hunger + (item.effect?.hunger || 0)),
          vitamins: Math.min(100, pet.vitamins + (item.effect?.vitamins || 0)),
          happiness: Math.min(100, pet.happiness + (item.effect?.happiness || 0)),
        };
      }));
      toast.success(`✅ ${item.name} применён!`);
    }
  };

  const buyPet = (petId: number, price: number) => {
    if (stars >= price) {
      setStars(prev => prev - price);
      setPets(prev => prev.map(p => p.id === petId ? { ...p, owned: true } : p));
      toast.success('🎉 Новый питомец куплен!');
      updateMissionProgress(5, 1);
    } else {
      toast.error('❌ Недостаточно звёзд!');
    }
  };

  const unlockClinic = (clinic: VetClinic) => {
    if (stars >= clinic.unlockCost) {
      setStars(prev => prev - clinic.unlockCost);
      setClinics(prev => prev.map(c => c.id === clinic.id ? { ...c, unlocked: true } : c));
      setSelectedClinic(clinic.id);
      toast.success(`🏥 ${clinic.name} разблокирована!`);
    } else {
      toast.error('❌ Недостаточно звёзд!');
    }
  };

  const updateMissionProgress = (missionId: number, progress: number) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId || m.completed) return m;
      
      const newProgress = m.progress + progress;
      const completed = newProgress >= m.target;
      
      if (completed && !m.completed) {
        setStars(s => s + m.reward);
        toast.success(`🎯 Задание выполнено! +${m.reward}⭐`);
      }
      
      return { ...m, progress: newProgress, completed };
    }));
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'free': return 'bg-gray-500';
      case 'common': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'free': return 'Бесплатный';
      case 'common': return 'Обычный';
      case 'rare': return 'Редкий';
      case 'epic': return 'Эпический';
      case 'legendary': return 'Легендарный';
      default: return rarity;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 pt-6">
          <h1 className="text-5xl font-bold text-primary mb-2">🐾 Pet Life</h1>
          <p className="text-muted-foreground text-lg">Вырасти своего питомца и будь активным!</p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Icon name="Star" size={20} className="mr-2" />
              {stars} ⭐
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Icon name="Footprints" size={20} className="mr-2" />
              {currentPet?.steps || 0} шагов
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Icon name="TrendingUp" size={20} className="mr-2" />
              LVL {currentPet?.level || 1}
            </Badge>
          </div>
        </header>

        {showTutorial && currentTutorial && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Icon name="Lightbulb" size={20} />
            <AlertDescription className="text-base ml-2">
              {currentTutorial.tip}
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-4"
                onClick={() => setShowTutorial(false)}
              >
                Скрыть
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="pet" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="pet">
              <Icon name="Heart" size={16} className="mr-1" />
              Питомец
            </TabsTrigger>
            <TabsTrigger value="shop">
              <Icon name="ShoppingBag" size={16} className="mr-1" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="clinic">
              <Icon name="Hospital" size={16} className="mr-1" />
              Клиники
            </TabsTrigger>
            <TabsTrigger value="missions">
              <Icon name="Target" size={16} className="mr-1" />
              Задания
            </TabsTrigger>
            <TabsTrigger value="collection">
              <Icon name="Book" size={16} className="mr-1" />
              Коллекция
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pet" className="space-y-4">
            <div className="flex gap-3 mb-4 overflow-x-auto pb-3">
              {ownedPets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setCurrentPetId(pet.id)}
                  className={`flex-shrink-0 relative transition-all ${
                    currentPetId === pet.id ? 'scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {pet.isDead && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💀</span>
                    </div>
                  )}
                  <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-1">
                    {pet.level}
                  </Badge>
                </button>
              ))}
            </div>

            {currentPet && (
              <>
                <Card className="p-6 bg-white/80 backdrop-blur shadow-2xl border-2">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative">
                      <img 
                        src={currentPet.image} 
                        alt={currentPet.name}
                        className="w-48 h-48 rounded-3xl object-cover shadow-xl"
                      />
                      {currentPet.isDead && (
                        <div className="absolute inset-0 bg-black/70 rounded-3xl flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-6xl">💀</span>
                            <p className="text-white font-bold mt-2">Мёртв</p>
                          </div>
                        </div>
                      )}
                      {currentPet.isSick && !currentPet.isDead && (
                        <Badge variant="destructive" className="absolute top-3 right-3 px-2 py-1">
                          <Icon name="AlertCircle" size={16} className="mr-1" />
                          Болен
                        </Badge>
                      )}
                      <Badge className="absolute bottom-3 left-3 text-lg px-3 py-1 bg-primary">
                        LVL {currentPet.level}
                      </Badge>
                      {currentPet.boostLevel > 0 && (
                        <Badge className="absolute top-3 left-3 px-2 py-1 bg-amber-500">
                          <Icon name="Zap" size={14} className="mr-1" />
                          x{currentPet.boostLevel}
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <h2 className="text-3xl font-bold text-primary mb-1">{currentPet.name}</h2>
                        <p className="text-lg text-muted-foreground">{currentPet.species}</p>
                      </div>

                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-semibold">Опыт до {currentPet.level + 1} уровня</span>
                          <span>{currentPet.xp} / {currentPet.xpToNextLevel}</span>
                        </div>
                        <Progress value={(currentPet.xp / currentPet.xpToNextLevel) * 100} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-semibold flex items-center gap-1">
                              <Icon name="Heart" size={14} className="text-red-500" />
                              Здоровье
                            </span>
                            <span className="font-bold">{currentPet.health}%</span>
                          </div>
                          <Progress value={currentPet.health} className={`h-2 ${getStatColor(currentPet.health)}`} />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-semibold flex items-center gap-1">
                              <Icon name="Apple" size={14} className="text-green-600" />
                              Сытость
                            </span>
                            <span className="font-bold">{currentPet.hunger}%</span>
                          </div>
                          <Progress value={currentPet.hunger} className={`h-2 ${getStatColor(currentPet.hunger)}`} />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-semibold flex items-center gap-1">
                              <Icon name="Footprints" size={14} className="text-blue-600" />
                              Активность
                            </span>
                            <span className="font-bold">{currentPet.activity}%</span>
                          </div>
                          <Progress value={currentPet.activity} className={`h-2 ${getStatColor(currentPet.activity)}`} />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-semibold flex items-center gap-1">
                              <Icon name="Pill" size={14} className="text-purple-600" />
                              Витамины
                            </span>
                            <span className="font-bold">{currentPet.vitamins}%</span>
                          </div>
                          <Progress value={currentPet.vitamins} className={`h-2 ${getStatColor(currentPet.vitamins)}`} />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-semibold flex items-center gap-1">
                              <Icon name="Smile" size={14} className="text-pink-600" />
                              Счастье
                            </span>
                            <span className="font-bold">{currentPet.happiness}%</span>
                          </div>
                          <Progress value={currentPet.happiness} className={`h-2 ${getStatColor(currentPet.happiness)}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-white/70 backdrop-blur">
                  <h3 className="text-xl font-bold mb-3 text-primary">Действия</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button 
                      size="lg" 
                      onClick={() => handleAction('feed')}
                      disabled={currentPet.isDead}
                      className="h-20 flex-col gap-1"
                    >
                      <Icon name="Apple" size={24} />
                      Покормить
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => handleAction('walk')}
                      disabled={currentPet.isDead}
                      className="h-20 flex-col gap-1"
                    >
                      <Icon name="Footprints" size={24} />
                      Прогулка
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => handleAction('vitamins')}
                      disabled={currentPet.isDead}
                      className="h-20 flex-col gap-1"
                    >
                      <Icon name="Pill" size={24} />
                      Витамины
                    </Button>
                    <Button 
                      size="lg" 
                      variant={currentPet.isSick ? "destructive" : "secondary"}
                      onClick={() => handleAction('heal', 50)}
                      disabled={!currentPet.isSick || currentPet.isDead}
                      className="h-20 flex-col gap-1"
                    >
                      <Icon name="Stethoscope" size={24} />
                      Лечить (50⭐)
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="shop">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-primary flex items-center gap-2">
                    <Icon name="Zap" size={24} />
                    Ускорители роста
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {SHOP_ITEMS.filter(i => i.type === 'booster').map(item => (
                      <Card key={item.id} className="p-4 bg-white/80 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="p-3 bg-amber-100 rounded-lg">
                            <Icon name={item.icon as any} size={24} className="text-amber-700" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            <Button 
                              size="sm" 
                              onClick={() => buyItem(item)}
                              className="w-full"
                            >
                              <Icon name="Star" size={14} className="mr-1" />
                              {item.price}⭐
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-primary flex items-center gap-2">
                    <Icon name="Pill" size={24} />
                    Медикаменты
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {SHOP_ITEMS.filter(i => i.type === 'medicine' || i.type === 'revive').map(item => (
                      <Card key={item.id} className="p-4 bg-white/80 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <Icon name={item.icon as any} size={24} className="text-green-700" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            <Button 
                              size="sm" 
                              onClick={() => buyItem(item)}
                              className="w-full"
                              variant={item.type === 'revive' ? 'destructive' : 'default'}
                            >
                              <Icon name="Star" size={14} className="mr-1" />
                              {item.price}⭐
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-primary flex items-center gap-2">
                    <Icon name="Shirt" size={24} />
                    Одежда и игрушки
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {SHOP_ITEMS.filter(i => i.type === 'clothes' || i.type === 'toy').map(item => (
                      <Card key={item.id} className="p-4 bg-white/80 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <Icon name={item.icon as any} size={24} className="text-purple-700" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            <Button 
                              size="sm" 
                              onClick={() => buyItem(item)}
                              className="w-full"
                            >
                              <Icon name="Star" size={14} className="mr-1" />
                              {item.price}⭐
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-primary flex items-center gap-2">
                    <Icon name="Cookie" size={24} />
                    Еда и лакомства
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {SHOP_ITEMS.filter(i => i.type === 'food').map(item => (
                      <Card key={item.id} className="p-4 bg-white/80 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="p-3 bg-orange-100 rounded-lg">
                            <Icon name={item.icon as any} size={24} className="text-orange-700" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            <Button 
                              size="sm" 
                              onClick={() => buyItem(item)}
                              className="w-full"
                            >
                              <Icon name="Star" size={14} className="mr-1" />
                              {item.price}⭐
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="clinic">
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Icon name="Info" size={20} />
                <AlertDescription className="ml-2">
                  Лучшие клиники повышают эффективность лечения. Текущая клиника: <strong>{currentClinic?.name}</strong>
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                {clinics.map(clinic => (
                  <Card key={clinic.id} className={`p-6 bg-white/80 ${clinic.unlocked ? 'border-green-500 border-2' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary">{clinic.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{clinic.description}</p>
                      </div>
                      {clinic.unlocked && (
                        <Badge variant="default">Открыта</Badge>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Уровень:</span>
                        <span className="font-bold">{clinic.level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Бонус лечения:</span>
                        <span className="font-bold text-green-600">x{clinic.treatmentBonus}</span>
                      </div>
                    </div>

                    {!clinic.unlocked ? (
                      <Button 
                        className="w-full" 
                        onClick={() => unlockClinic(clinic)}
                        disabled={clinic.unlockCost > stars}
                      >
                        <Icon name="Unlock" size={18} className="mr-2" />
                        Разблокировать за {clinic.unlockCost}⭐
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant={selectedClinic === clinic.id ? 'default' : 'outline'}
                        onClick={() => setSelectedClinic(clinic.id)}
                      >
                        {selectedClinic === clinic.id ? 'Используется' : 'Выбрать клинику'}
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="missions">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-primary flex items-center gap-2">
                  <Icon name="Calendar" size={24} />
                  Ежедневные задания
                </h3>
                <div className="space-y-3">
                  {missions.filter(m => m.type === 'daily').map(mission => (
                    <Card key={mission.id} className={`p-4 bg-white/80 ${mission.completed ? 'opacity-60' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg">{mission.title}</h4>
                            {mission.completed && (
                              <Badge variant="default">
                                <Icon name="Check" size={14} className="mr-1" />
                                Выполнено
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Прогресс</span>
                              <span>{Math.min(mission.progress, mission.target)} / {mission.target}</span>
                            </div>
                            <Progress value={(mission.progress / mission.target) * 100} className="h-2" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-600">{mission.reward}⭐</div>
                          <div className="text-xs text-muted-foreground">Награда</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3 text-primary flex items-center gap-2">
                  <Icon name="Trophy" size={24} />
                  Еженедельные задания
                </h3>
                <div className="space-y-3">
                  {missions.filter(m => m.type === 'weekly').map(mission => (
                    <Card key={mission.id} className={`p-4 bg-white/80 ${mission.completed ? 'opacity-60' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg">{mission.title}</h4>
                            {mission.completed && (
                              <Badge variant="default">
                                <Icon name="Check" size={14} className="mr-1" />
                                Выполнено
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Прогресс</span>
                              <span>{Math.min(mission.progress, mission.target)} / {mission.target}</span>
                            </div>
                            <Progress value={(mission.progress / mission.target) * 100} className="h-2" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-600">{mission.reward}⭐</div>
                          <div className="text-xs text-muted-foreground">Награда</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collection">
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map(pet => (
                  <Card key={pet.id} className="overflow-hidden bg-white/80 hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img 
                        src={pet.image} 
                        alt={pet.name}
                        className={`w-full h-40 object-cover ${!pet.owned ? 'opacity-40 grayscale' : ''}`}
                      />
                      <Badge className={`absolute top-2 right-2 ${getRarityColor(pet.rarity)}`}>
                        {getRarityText(pet.rarity)}
                      </Badge>
                      {!pet.owned && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Icon name="Lock" size={32} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-primary">{pet.name}</h3>
                          <p className="text-sm text-muted-foreground">{pet.species}</p>
                        </div>
                        {pet.owned && (
                          <Badge variant="outline">LVL {pet.level}</Badge>
                        )}
                      </div>
                      
                      {!pet.owned ? (
                        <Button 
                          className="w-full mt-3" 
                          size="lg"
                          onClick={() => buyPet(pet.id, pet.price)}
                          disabled={pet.price === 0 && pet.owned}
                        >
                          {pet.price === 0 ? (
                            'Бесплатно'
                          ) : (
                            <>
                              <Icon name="Star" size={18} className="mr-2" />
                              Купить за {pet.price}⭐
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button 
                          className="w-full mt-3" 
                          variant="outline"
                          onClick={() => setCurrentPetId(pet.id)}
                        >
                          Выбрать питомца
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
