import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Camera, Video, FileText, Users, Calendar, Trophy, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submission, setSubmission] = useState({
    content: '',
    file: null as File | null
  });

  // Mock campaign data
  const campaign = {
    id: '1',
    title: 'Share Your Coffee Moment',
    brand: 'CoffeeCorp',
    description: 'We love seeing how our customers enjoy their daily coffee ritual! Share a photo of your favorite coffee moment - whether it\'s your morning brew, an afternoon pick-me-up, or a cozy evening coffee. Tag us and show the world how you make every sip count!',
    fullDescription: `
      Join our coffee community and share your unique coffee experience! 
      
      **What we're looking for:**
      • High-quality photos of you enjoying coffee
      • Creative compositions and good lighting
      • Authentic moments that tell a story
      • Include our brand in the photo (coffee cup, package, etc.)
      
      **Tips for great submissions:**
      • Natural lighting works best
      • Show the coffee and the moment
      • Be authentic and creative
      • Include a short caption about your experience
    `,
    reward: 50,
    deadline: '2024-09-15',
    participants: 234,
    type: 'photo',
    status: 'active',
    requirements: [
      'Must include CoffeeCorp product in the photo',
      'Original content only',
      'Minimum 1080p resolution',
      'Include a creative caption'
    ],
    examples: [
      'Morning coffee with sunrise',
      'Coffee break at work',
      'Weekend coffee with friends',
      'Artistic latte art photos'
    ]
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubmission({ ...submission, file });
    }
  };

  const handleSubmit = () => {
    if (!submission.content) {
      toast({
        title: "Content Required",
        description: "Please add a description for your submission",
        variant: "destructive",
      });
      return;
    }

    if (campaign.type === 'photo' && !submission.file) {
      toast({
        title: "File Required",
        description: "Please upload a photo for this campaign",
        variant: "destructive",
      });
      return;
    }

    // Simulate submission
    toast({
      title: "Submission Successful!",
      description: "Your submission has been sent for review. You'll be notified once it's approved.",
    });

    setIsSubmitOpen(false);
    setSubmission({ content: '', file: null });
    
    // Navigate to submissions page
    setTimeout(() => {
      navigate('/my-submissions');
    }, 1500);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'text': return <FileText className="w-5 h-5" />;
      default: return <Camera className="w-5 h-5" />;
    }
  };

  const isDeadlinePassed = new Date(campaign.deadline) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Campaign Header */}
            <Card className="glass-card neon-glow mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">{campaign.title}</CardTitle>
                    <CardDescription className="text-lg text-accent font-medium">
                      by {campaign.brand}
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-primary text-primary-foreground text-lg px-4 py-2">
                    <Trophy className="w-4 h-4 mr-2" />
                    {campaign.reward} points
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{campaign.description}</p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    {getTypeIcon(campaign.type)}
                    <span className="capitalize text-muted-foreground">{campaign.type} submission</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-5 h-5 text-neon-purple" />
                    <span className="text-muted-foreground">{campaign.participants} participants</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-5 h-5 text-neon-cyan" />
                    <span className={`${isDeadlinePassed ? 'text-destructive' : 'text-muted-foreground'}`}>
                      Due: {new Date(campaign.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {isDeadlinePassed && (
                  <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 mb-6">
                    <p className="text-destructive font-medium">This campaign has ended</p>
                    <p className="text-destructive/80 text-sm">Submissions are no longer accepted</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Description */}
            <Card className="glass-card mb-8">
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  {campaign.fullDescription.split('\n').map((line, index) => (
                    <p key={index} className="mb-2 text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {campaign.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Submit Section */}
            <Card className="glass-card neon-glow sticky top-24">
              <CardHeader>
                <CardTitle className="gradient-text">Ready to Participate?</CardTitle>
                <CardDescription>
                  Submit your entry and earn {campaign.reward} points
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.role === 'user' ? (
                  <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-primary hover:opacity-90 neon-glow"
                        disabled={isDeadlinePassed}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border/50 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="gradient-text text-2xl">Submit Your Entry</DialogTitle>
                        <DialogDescription>
                          Upload your {campaign.type} and add a description
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {(campaign.type === 'photo' || campaign.type === 'video') && (
                          <div>
                            <Label htmlFor="file">Upload {campaign.type}</Label>
                            <Input
                              id="file"
                              type="file"
                              accept={campaign.type === 'photo' ? 'image/*' : 'video/*'}
                              onChange={handleFileChange}
                              className="cursor-pointer"
                            />
                            {submission.file && (
                              <p className="text-sm text-green-400 mt-2">
                                File selected: {submission.file.name}
                              </p>
                            )}
                          </div>
                        )}
                        <div>
                          <Label htmlFor="content">Description</Label>
                          <Textarea
                            id="content"
                            value={submission.content}
                            onChange={(e) => setSubmission({ ...submission, content: e.target.value })}
                            placeholder="Describe your submission and share your story..."
                            rows={4}
                          />
                        </div>
                        <Button onClick={handleSubmit} className="w-full bg-gradient-primary hover:opacity-90">
                          Submit Entry
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Only users can participate in campaigns
                    </p>
                    <Button variant="outline" onClick={() => navigate('/brand-dashboard')}>
                      Go to Brand Dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Examples */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>Example Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {campaign.examples.map((example, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-neon-purple rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{example}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;