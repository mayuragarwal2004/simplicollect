import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, PhoneCall, MessageSquareText, StickyNote } from 'lucide-react';

const TrackVisitor = () => {
  const [visitor, setVisitor] = useState<any>({});
  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const visitorId = useParams().visitorId;

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        const response = await fetch(`/api/visitor/${visitorId}`);
        if (!response.ok) throw new Error('Failed to fetch visitor data');
        const data = await response.json();
        setVisitor(data);
      } catch (error) {
        toast.error('Error fetching visitor');
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/visitor/${visitorId}/history`);
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        toast.error('Error fetching history');
      }
    };

    if (visitorId) {
      fetchVisitor();
      fetchHistory();
    }
  }, [visitorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisitor({ ...visitor, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/visitor/${visitorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitor),
      });

      if (!response.ok) throw new Error('Failed to save visitor data');
      setEditMode(false);
      toast.success('Visitor updated');
    } catch (error) {
      toast.error('Error saving visitor');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <PhoneCall className="text-blue-500" />;
      case 'email':
        return <Mail className="text-red-500" />;
      case 'whatsapp':
        return <MessageSquareText className="text-green-500" />;
      case 'note':
        return <StickyNote className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Visitor Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  name="firstName"
                  value={visitor.firstName || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  name="lastName"
                  value={visitor.lastName || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  value={visitor.email || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="mobileNumber">Phone</Label>
                <Input
                  name="mobileNumber"
                  value={visitor.mobileNumber || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="invitedBy">Invited By</Label>
                <Input
                  name="invitedBy"
                  value={visitor.invitedBy || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  name="companyName"
                  value={visitor.companyName || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="classification">Classification</Label>
                <Input
                  name="classification"
                  value={visitor.classification || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  name="industry"
                  value={visitor.industry || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="heardAboutBni">Heard About BNI</Label>
              <Input
                name="heardAboutBni"
                value={visitor.heardAboutBni || ''}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>
        </CardContent>
        
        <CardContent>
          <div className="space-y-4">

            {!editMode && (
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}

            {editMode && (
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent className="mt-10">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="call">Call</TabsTrigger>
              <TabsTrigger value="note">Note</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="call">
              <Label>Phone Number</Label>
              <Input value={visitor.mobileNumber || ''} disabled />
              <Label className="mt-2">Remark</Label>
              <Textarea placeholder="Enter call remarks..." />
              <Button className="mt-2">Save Call Log</Button>
            </TabsContent>

            <TabsContent value="note">
              <Label>Note</Label>
              <Textarea placeholder="Enter note..." />
              <Button className="mt-2">Save</Button>
            </TabsContent>

            <TabsContent value="email">
              <Label>Email</Label>
              <Input value={visitor.email || ''} disabled />
              <Label className="mt-2">Title</Label>
              <Input placeholder="Enter email title" />
              <Label className="mt-2">Subject</Label>
              <Textarea placeholder="Enter email subject or message..." />
              <Button className="mt-2">Send Email</Button>
            </TabsContent>

            <TabsContent value="whatsapp">
              <Label>WhatsApp Number</Label>
              <Input value={visitor.mobileNumber || ''} disabled />
              <Label className="mt-2">Title</Label>
              <Input placeholder="Enter WhatsApp title" />
              <Label className="mt-2">Content</Label>
              <Textarea placeholder="Enter WhatsApp message content..." />
              <Button className="mt-2">Send WhatsApp</Button>
            </TabsContent>

            <TabsContent value="history">
              <div className="flex gap-4 justify-center mb-6">
                {history.map((item, index) => (
                  <div key={index}>{getIcon(item.type)}</div>
                ))}
              </div>

              <div className="space-y-6">
                {history.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="pt-1">{getIcon(item.type)}</div>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {item.type}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.timestamp}
                      </p>
                      <p className="mt-1">{item.message || item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackVisitor;
