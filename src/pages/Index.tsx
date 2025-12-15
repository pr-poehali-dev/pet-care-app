import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Pet = {
  id: number;
  name: string;
  species: string;
  image: string;
  price: number;
  owned: boolean;
  level: number;
  health: number;
  hunger: number;
  activity: number;
  vitamins: number;
  isSick: boolean;
  sickness?: string;
  steps: number;
};

const PETS_DATA: Pet[] = [
  { id: 1, name: 'Рекс', species: 'Золотистый ретривер', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg', price: 0, owned: true, level: 1, health: 85, hunger: 60, activity: 40, vitamins: 70, isSick: false, steps: 1250 },
  { id: 2, name: 'Мурзик', species: 'Рыжий кот', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/10550fcc-179b-4a82-b1f4-e2631d5b693a.jpg', price: 0, owned: true, level: 1, health: 90, hunger: 75, activity: 55, vitamins: 65, isSick: false, steps: 0 },
  { id: 3, name: 'Хома', species: 'Сирийский хомяк', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/cd99cfa0-476f-4645-a753-2f565a31f812.jpg', price: 0, owned: true, level: 1, health: 95, hunger: 80, activity: 70, vitamins: 80, isSick: false, steps: 0 },
  { id: 4, name: 'Барсик', species: 'Британская кошка', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/10550fcc-179b-4a82-b1f4-e2631d5b693a.jpg', price: 50, owned: false, level: 1, health: 100, hunger: 100, activity: 100, vitamins: 100, isSick: false, steps: 0 },
  { id: 5, name: 'Джек', species: 'Джек рассел терьер', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg', price: 75, owned: false, level: 1, health: 100, hunger: 100, activity: 100, vitamins: 100, isSick: false, steps: 0 },
  { id: 6, name: 'Снежок', species: 'Ангорский кролик', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/cd99cfa0-476f-4645-a753-2f565a31f812.jpg', price: 100, owned: false, level: 1, health: 100, hunger: 100, activity: 100, vitamins: 100, isSick: false, steps: 0 },
  { id: 7, name: 'Буся', species: 'Персидская кошка', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/10550fcc-179b-4a82-b1f4-e2631d5b693a.jpg', price: 125, owned: false, level: 1, health: 100, hunger: 100, activity: 100, vitamins: 100, isSick: false, steps: 0 },
  { id: 8, name: 'Тайсон', species: 'Немецкая овчарка', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg', price: 150, owned: false, level: 1, health: 100, hunger: 100, activity: 100, vitamins: 100, isSick: false, steps: 0 },
  { id: 9, name: 'Фокс', species: 'Померанский шпиц', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg', price: 200, owned: false, level: 1, health: 100, hunger: 100, activity: 100, vitamins: 100, isSick: false, steps: 0 },
  { id: 10, name: 'Симба', species: 'Мейн-кун', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/10550fcc-179b-4a82-b1f4-e2631d5b693a.jpg', price: 250, owned: false, level: 1, health: 100, hunger: 100, activity: 100, vitamins: 100, isSick: false, steps: 0 },
];

const Index = () => {
  const [pets, setPets] = useState<Pet[]>(PETS_DATA);
  const [currentPetId, setCurrentPetId] = useState(1);
  const [stars, setStars] = useState(500);
  
  const currentPet = pets.find(p => p.id === currentPetId);
  const ownedPets = pets.filter(p => p.owned);

  const handleAction = (action: string, cost: number = 0) => {
    if (!currentPet) return;
    
    setPets(prev => prev.map(pet => {
      if (pet.id !== currentPetId) return pet;
      
      let updates: Partial<Pet> = {};
      
      switch (action) {
        case 'feed':
          updates = { hunger: Math.min(100, pet.hunger + 25) };
          toast.success('🍖 Питомец накормлен!');
          break;
        case 'walk':
          updates = { activity: Math.min(100, pet.activity + 30), steps: pet.steps + 500 };
          toast.success('🚶 Прогулка завершена! +500 шагов');
          break;
        case 'vitamins':
          updates = { vitamins: Math.min(100, pet.vitamins + 20) };
          toast.success('💊 Витамины даны!');
          break;
        case 'heal':
          if (pet.isSick && cost > 0 && stars >= cost) {
            setStars(prev => prev - cost);
            updates = { isSick: false, sickness: undefined, health: Math.min(100, pet.health + 40) };
            toast.success('💉 Питомец вылечен!');
          }
          break;
      }
      
      return { ...pet, ...updates };
    }));
  };

  const buyPet = (petId: number, price: number) => {
    if (stars >= price) {
      setStars(prev => prev - price);
      setPets(prev => prev.map(p => p.id === petId ? { ...p, owned: true } : p));
      toast.success('🎉 Новый питомец куплен!');
    } else {
      toast.error('❌ Недостаточно звёзд!');
    }
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 pt-6">
          <h1 className="text-5xl font-bold text-primary mb-2">🐾 Pet Life</h1>
          <p className="text-muted-foreground text-lg">Вырасти своего питомца и будь активным!</p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Icon name="Star" size={20} className="mr-2" />
              {stars} ⭐
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Icon name="Footprints" size={20} className="mr-2" />
              {currentPet?.steps || 0} шагов
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="pet" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pet" className="text-lg">
              <Icon name="Heart" size={18} className="mr-2" />
              Питомец
            </TabsTrigger>
            <TabsTrigger value="shop" className="text-lg">
              <Icon name="ShoppingBag" size={18} className="mr-2" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-lg">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Прогресс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pet" className="space-y-6">
            <div className="flex gap-4 mb-6 overflow-x-auto pb-4">
              {ownedPets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setCurrentPetId(pet.id)}
                  className={`flex-shrink-0 transition-all ${
                    currentPetId === pet.id ? 'scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </button>
              ))}
            </div>

            {currentPet && (
              <>
                <Card className="p-8 bg-white/80 backdrop-blur shadow-2xl border-2">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative">
                      <img 
                        src={currentPet.image} 
                        alt={currentPet.name}
                        className="w-64 h-64 rounded-3xl object-cover shadow-xl"
                      />
                      {currentPet.isSick && (
                        <Badge variant="destructive" className="absolute top-4 right-4 text-lg px-3 py-1">
                          <Icon name="AlertCircle" size={18} className="mr-1" />
                          Болен
                        </Badge>
                      )}
                      <Badge className="absolute bottom-4 left-4 text-xl px-4 py-2 bg-primary">
                        LVL {currentPet.level}
                      </Badge>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                      <div>
                        <h2 className="text-4xl font-bold text-primary mb-1">{currentPet.name}</h2>
                        <p className="text-xl text-muted-foreground">{currentPet.species}</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold flex items-center gap-2">
                              <Icon name="Heart" size={18} className="text-red-500" />
                              Здоровье
                            </span>
                            <span className="font-bold">{currentPet.health}%</span>
                          </div>
                          <Progress value={currentPet.health} className={`h-3 ${getStatColor(currentPet.health)}`} />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold flex items-center gap-2">
                              <Icon name="Apple" size={18} className="text-green-600" />
                              Сытость
                            </span>
                            <span className="font-bold">{currentPet.hunger}%</span>
                          </div>
                          <Progress value={currentPet.hunger} className={`h-3 ${getStatColor(currentPet.hunger)}`} />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold flex items-center gap-2">
                              <Icon name="Footprints" size={18} className="text-blue-600" />
                              Активность
                            </span>
                            <span className="font-bold">{currentPet.activity}%</span>
                          </div>
                          <Progress value={currentPet.activity} className={`h-3 ${getStatColor(currentPet.activity)}`} />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold flex items-center gap-2">
                              <Icon name="Pill" size={18} className="text-purple-600" />
                              Витамины
                            </span>
                            <span className="font-bold">{currentPet.vitamins}%</span>
                          </div>
                          <Progress value={currentPet.vitamins} className={`h-3 ${getStatColor(currentPet.vitamins)}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white/70 backdrop-blur">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Действия</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      size="lg" 
                      onClick={() => handleAction('feed')}
                      className="h-24 flex-col gap-2"
                    >
                      <Icon name="Apple" size={32} />
                      Покормить
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => handleAction('walk')}
                      className="h-24 flex-col gap-2"
                    >
                      <Icon name="Footprints" size={32} />
                      Прогулка
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => handleAction('vitamins')}
                      className="h-24 flex-col gap-2"
                    >
                      <Icon name="Pill" size={32} />
                      Витамины
                    </Button>
                    <Button 
                      size="lg" 
                      variant={currentPet.isSick ? "destructive" : "secondary"}
                      onClick={() => handleAction('heal', 50)}
                      disabled={!currentPet.isSick}
                      className="h-24 flex-col gap-2"
                    >
                      <Icon name="Stethoscope" size={32} />
                      Лечить (50⭐)
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="shop">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map(pet => (
                <Card key={pet.id} className="overflow-hidden hover:shadow-xl transition-shadow bg-white/80">
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{pet.name}</h3>
                        <p className="text-muted-foreground">{pet.species}</p>
                      </div>
                      {pet.owned && (
                        <Badge variant="default">Куплен</Badge>
                      )}
                    </div>
                    
                    {!pet.owned && (
                      <Button 
                        className="w-full mt-4" 
                        size="lg"
                        onClick={() => buyPet(pet.id, pet.price)}
                        disabled={pet.price === 0}
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
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/80">
                <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                  <Icon name="Trophy" size={24} />
                  Достижения
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
                    <div className="text-4xl">🏆</div>
                    <div className="flex-1">
                      <p className="font-bold">Первые шаги</p>
                      <p className="text-sm text-muted-foreground">Пройди 1000 шагов</p>
                    </div>
                    <Badge variant="default">Выполнено</Badge>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg opacity-60">
                    <div className="text-4xl">🎖️</div>
                    <div className="flex-1">
                      <p className="font-bold">Марафонец</p>
                      <p className="text-sm text-muted-foreground">Пройди 10000 шагов</p>
                    </div>
                    <Badge variant="secondary">В процессе</Badge>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg opacity-60">
                    <div className="text-4xl">⭐</div>
                    <div className="flex-1">
                      <p className="font-bold">Коллекционер</p>
                      <p className="text-sm text-muted-foreground">Собери всех питомцев</p>
                    </div>
                    <Badge variant="outline">Закрыто</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/80">
                <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                  <Icon name="BarChart3" size={24} />
                  Статистика
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Всего шагов</p>
                    <p className="text-3xl font-bold text-green-700">
                      {ownedPets.reduce((sum, pet) => sum + pet.steps, 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Питомцев в коллекции</p>
                    <p className="text-3xl font-bold text-blue-700">
                      {ownedPets.length} / {pets.length}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Средний уровень</p>
                    <p className="text-3xl font-bold text-purple-700">
                      {(ownedPets.reduce((sum, pet) => sum + pet.level, 0) / ownedPets.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
