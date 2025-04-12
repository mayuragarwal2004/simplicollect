import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const TrackVisitor = () => {
  const [visitor, setVisitor] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    invitedBy: '',
    companyName: '',
    classification: '',
    industry: '',
    heardAboutBni: '',
  });
  const [editMode, setEditMode] = useState(false);
  const visitorId = useParams().visitorId;

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        // setLoading(true);
        const response = await fetch(`/api/visitor/${visitorId}`);
        if (!response.ok) throw new Error('Failed to fetch visitor data');
        const data = await response.json();
        setVisitor(data);
        toast.success('Visitor data loaded successfully');
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to load visitor data',
        );
      } finally {
        // setLoading(false);
      }
    };
    if (visitorId) {
      fetchVisitor();
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
      toast.success('Visitor data saved successfully');
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save visitor data',
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Visitor Information</CardTitle>
          <Button
            variant="outline"
            onClick={() => setEditMode(true)}
            disabled={editMode}
          >
            Edit Information
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  name="firstName"
                  value={visitor.firstName}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  name="lastName"
                  value={visitor.lastName}
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
                  value={visitor.email}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="mobileNumber">Phone</Label>
                <Input
                  name="mobileNumber"
                  value={visitor.mobileNumber}
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
                  value={visitor.invitedBy}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  name="companyName"
                  value={visitor.companyName}
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
                  value={visitor.classification}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  name="industry"
                  value={visitor.industry}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="heardAboutBni">How Heard About BNI</Label>
              <Input
                name="heardAboutBni"
                value={visitor.heardAboutBni}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>

            {editMode && (
              <div className="flex gap-2">
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
        <CardContent className='mt-10'>
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="call">Call</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="call">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="callPhoneNumber">Phone Number</Label>
                  <Input
                    id="callPhoneNumber"
                    value={visitor.mobileNumber}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="callRemark">Remark</Label>
                  <Textarea
                    id="callRemark"
                    placeholder="Enter call remarks..."
                    // optionally handle remark state if needed
                  />
                </div>
                <Button className="mt-2">Save Call Log</Button>
              </div>
            </TabsContent>

            <TabsContent value="email">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="emailAddress">Email</Label>
                  <Input id="emailAddress" value={visitor.email} disabled />
                </div>
                <div>
                  <Label htmlFor="emailTitle">Title</Label>
                  <Input
                    id="emailTitle"
                    placeholder="Enter email title"
                    // You can manage state here if needed
                  />
                </div>
                <div>
                  <Label htmlFor="emailSubject">Subject</Label>
                  <Textarea
                    id="emailSubject"
                    placeholder="Enter email subject or message..."
                    // You can manage state here if needed
                  />
                </div>
                <Button className="mt-2">Send Email</Button>
              </div>
            </TabsContent>

            <TabsContent value="whatsapp">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <Input
                    id="whatsappNumber"
                    value={visitor.mobileNumber}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="whatsappTitle">Title</Label>
                  <Input
                    id="whatsappTitle"
                    placeholder="Enter WhatsApp title"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsappContent">Content</Label>
                  <Textarea
                    id="whatsappContent"
                    placeholder="Enter WhatsApp message content..."
                  />
                </div>
                <Button className="mt-2">Send WhatsApp</Button>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">example</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* History Section Below Tabs */}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackVisitor;
