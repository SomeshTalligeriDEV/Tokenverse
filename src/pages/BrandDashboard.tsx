import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Eye, Users, TrendingUp, CheckCircle, Clock, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const BrandDashboard = () => {
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    reward: '',
    deadline: '',
    type: 'photo'
  });

  // Mock data for brand campaigns
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      title: 'Share Your Coffee Moment',
      description: 'Post a photo with your favorite coffee and tag us!',
      reward: 50,
      deadline: '2024-09-15',
      participants: 234,
      submissions: 45,
      type: 'photo',
      status: 'active',
      createdAt: '2024-08-15'
    },
    {
      id: '2',
      title: 'Weekend Vibes',
      description: 'Show us how you spend your perfect weekend',
      reward: 75,
      deadline: '2024-09-10',
      participants: 123,
      submissions: 28,
      type: 'video',
      status: 'active',
      createdAt: '2024-08-20'
    }
  ]);

  // Mock submissions data
  const [submissions] = useState([
    {
      id: '1',
      campaignId: '1',
      campaignTitle: 'Share Your Coffee Moment',
      userName: 'Alice Cooper',
      userWallet: '0x1234...5678',
      content: 'Amazing latte art at my local cafe!',
      submittedAt: '2024-09-01',
      status: 'pending',
      reward: 50
    },
    {
      id: '2',
      campaignId: '1',
      campaignTitle: 'Share Your Coffee Moment',
      userName: 'Bob Wilson',
      userWallet: '0x9876...4321',
      content: 'Morning coffee ritual with the sunrise',
      submittedAt: '2024-09-02',
      status: 'pending',
      reward: 50
    },
    {
      id: '3',
      campaignId: '2',
      campaignTitle: 'Weekend Vibes',
      userName: 'Charlie Brown',
      userWallet: '0x5555...9999',
      content: 'Hiking adventure in the mountains',
      submittedAt: '2024-08-30',
      status: 'approved',
      reward: 75
    }
  ]);

  const handleCreateCampaign = () => {
    if (!newCampaign.title || !newCampaign.description || !newCampaign.reward || !newCampaign.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const campaign = {
      id: Date.now().toString(),
      ...newCampaign,
      reward: parseInt(newCampaign.reward),
      participants: 0,
      submissions: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({ title: '', description: '', reward: '', deadline: '', type: 'photo' });
    setIsCreateOpen(false);
    
    toast({
      title: "Campaign Created",
      description: "Your campaign is now live!",
    });
  };

  const handleSubmissionAction = (submissionId: string, action: 'approve' | 'reject') => {
    // In a real app, this would update the submission status in the backend
    toast({
      title: action === 'approve' ? "Submission Approved" : "Submission Rejected",
      description: `The submission has been ${action}d`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-muted/20 text-muted-foreground border-muted/50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Brand Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your campaigns and engage with your community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="text-2xl font-bold text-accent">{campaigns.filter(c => c.status === 'active').length}</p>
                </div>
                <Eye className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold text-neon-purple">{campaigns.reduce((sum, c) => sum + c.participants, 0)}</p>
                </div>
                <Users className="w-8 h-8 text-neon-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Submissions</p>
                  <p className="text-2xl font-bold text-neon-cyan">{campaigns.reduce((sum, c) => sum + c.submissions, 0)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-neon-cyan" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold text-crypto-gold">{submissions.filter(s => s.status === 'pending').length}</p>
                </div>
                <Clock className="w-8 h-8 text-crypto-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Campaigns Management */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold gradient-text">Your Campaigns</h2>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:opacity-90 neon-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-border/50 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="gradient-text text-2xl">Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Launch a new campaign to engage with your community
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Campaign Title</Label>
                      <Input
                        id="title"
                        value={newCampaign.title}
                        onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                        placeholder="Enter campaign title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newCampaign.description}
                        onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                        placeholder="Describe your campaign..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reward">Reward Points</Label>
                        <Input
                          id="reward"
                          type="number"
                          value={newCampaign.reward}
                          onChange={(e) => setNewCampaign({ ...newCampaign, reward: e.target.value })}
                          placeholder="50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Campaign Type</Label>
                        <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newCampaign.deadline}
                        onChange={(e) => setNewCampaign({ ...newCampaign, deadline: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleCreateCampaign} className="w-full bg-gradient-primary hover:opacity-90">
                      Create Campaign
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="glass-card neon-glow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{campaign.title}</CardTitle>
                        <CardDescription>{campaign.description}</CardDescription>
                      </div>
                      <Badge className="bg-gradient-primary text-primary-foreground">
                        {campaign.reward} points
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Participants</p>
                        <p className="font-semibold text-accent">{campaign.participants}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Submissions</p>
                        <p className="font-semibold text-neon-purple">{campaign.submissions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-semibold">{new Date(campaign.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pending Submissions */}
          <div>
            <h2 className="text-xl font-bold gradient-text mb-6">Pending Submissions</h2>
            
            <div className="space-y-4">
              {submissions.filter(s => s.status === 'pending').map((submission) => (
                <Card key={submission.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-medium text-sm mb-1">{submission.campaignTitle}</h3>
                      <p className="text-xs text-muted-foreground">by {submission.userName}</p>
                    </div>
                    <p className="text-sm mb-4 text-muted-foreground">{submission.content}</p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleSubmissionAction(submission.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSubmissionAction(submission.id, 'reject')}
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {submissions.filter(s => s.status === 'pending').length === 0 && (
                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No pending submissions</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;