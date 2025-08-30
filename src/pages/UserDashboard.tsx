import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { Trophy, Coins, Gift, TrendingUp, Camera, Clock, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const UserDashboard = () => {
  const { user } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();

  // Mock data for campaigns
  const [campaigns] = useState([
    {
      id: '1',
      title: 'Share Your Coffee Moment',
      brand: 'CoffeeCorp',
      description: 'Post a photo with your favorite coffee and tag us!',
      reward: 50,
      deadline: '2024-09-15',
      participants: 234,
      type: 'photo',
      status: 'active'
    },
    {
      id: '2',
      title: 'Fitness Challenge',
      brand: 'FitGear',
      description: 'Show us your workout routine and win rewards!',
      reward: 75,
      deadline: '2024-09-20',
      participants: 145,
      type: 'video',
      status: 'active'
    },
    {
      id: '3',
      title: 'Tech Review Contest',
      brand: 'TechHub',
      description: 'Review your favorite gadget and share your thoughts',
      reward: 100,
      deadline: '2024-09-25',
      participants: 89,
      type: 'text',
      status: 'active'
    },
  ]);

  const [submissions] = useState([
    {
      id: '1',
      campaignTitle: 'Share Your Coffee Moment',
      submittedAt: '2024-09-01',
      status: 'approved',
      reward: 50
    },
    {
      id: '2',
      campaignTitle: 'Fitness Challenge',
      submittedAt: '2024-09-03',
      status: 'pending',
      reward: 75
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-muted/20 text-muted-foreground border-muted/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Discover new campaigns and earn rewards
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-accent">{user?.points}</p>
                </div>
                <Trophy className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tokens Earned</p>
                  <p className="text-2xl font-bold text-neon-purple">{user?.tokensEarned}</p>
                </div>
                <Coins className="w-8 h-8 text-neon-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ETH Balance</p>
                  <p className="text-2xl font-bold text-neon-cyan">{balance}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-neon-cyan" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/redeem')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Redeem</p>
                  <p className="text-2xl font-bold text-crypto-gold">Rewards</p>
                </div>
                <Gift className="w-8 h-8 text-crypto-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Campaigns */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold gradient-text">Available Campaigns</h2>
              <Button variant="outline" onClick={() => navigate('/leaderboard')}>
                View Leaderboard
              </Button>
            </div>
            
            <div className="space-y-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="glass-card neon-glow hover:scale-[1.02] transition-transform cursor-pointer"
                      onClick={() => navigate(`/campaign/${campaign.id}`)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{campaign.title}</CardTitle>
                        <CardDescription className="text-accent">{campaign.brand}</CardDescription>
                      </div>
                      <Badge className="bg-gradient-primary text-primary-foreground">
                        +{campaign.reward} points
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{campaign.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-muted-foreground">
                          <Camera className="w-4 h-4 mr-1" />
                          {campaign.type}
                        </span>
                        <span className="text-muted-foreground">
                          {campaign.participants} participants
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        Due: {new Date(campaign.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Submissions */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold gradient-text">Recent Submissions</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/my-submissions')}>
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm">{submission.campaignTitle}</h3>
                      <Badge className={getStatusColor(submission.status)}>
                        {getStatusIcon(submission.status)}
                        {submission.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                      {submission.status === 'approved' && (
                        <span className="text-green-400">+{submission.reward} points</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;