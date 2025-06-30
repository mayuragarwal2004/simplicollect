import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../utils/config';
import { Mail, PhoneCall, MessageSquareText, StickyNote } from 'lucide-react';

const TrackVisitor = () => {
  const [visitor, setVisitor] = useState<any>({});
  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const visitorId = useParams().visitorId;
  const [callRemark, setCallRemark] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [whatsappTitle, setWhatsappTitle] = useState('');
  const [whatsappContent, setWhatsappContent] = useState('');
  const [editingHistoryId, setEditingHistoryId] = useState(null);
const [editingContent, setEditingContent] = useState('');

 useEffect(() => {
  const fetchVisitor = async () => {
    try {
      const response = await axiosInstance.get(`/api/visitor/${visitorId}`);
      if (!response.data) throw new Error('Failed to fetch visitor data');
      setVisitor(response.data);
    } catch (error) {
      toast.error('Error fetching visitor');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axiosInstance.get(`/api/visitor-history/getHistory/${visitorId}`);
      setHistory(response.data);
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
 const saveHistory = async (type, data) => {
  try {
    const response = await axiosInstance.post(`/api/visitor-history/addHistory/${visitorId}`, {
      type,
      ...data,
    });
    if (!response.data) throw new Error('Failed to save history');
    toast.success(`${type} history saved`);

    // Refetch updated history
    const updated = await axiosInstance.get(`/api/visitor-history/getHistory/${visitorId}`);
    setHistory(updated.data);
  } catch (error) {
    toast.error(`Error saving ${type}: ${error.message}`);
  }
};
const deleteHistory = async (historyId) => {
  try {
    await axiosInstance.delete(`/api/visitor-history/deleteHistory/${visitorId}/${historyId}`);
    toast.success('History deleted');

    // Refetch updated history
    const updated = await axiosInstance.get(`/api/visitor-history/getHistory/${visitorId}`);
    setHistory(updated.data);
  } catch (error) {
    toast.error(`Error deleting history: ${error.message}`);
  }
};

const updateHistory = async (historyId, updatedData) => {
  try {
    await axiosInstance.put(`/api/visitor-history/updateHistory/${visitorId}/${historyId}`, updatedData);
    toast.success('History updated');

    // Refetch updated history
    const updated = await axiosInstance.get(`/api/visitor-history/getHistory/${visitorId}`);
    setHistory(updated.data);
  } catch (error) {
    toast.error(`Error updating history: ${error.message}`);
  }
};



 const handleSave = async () => {
  try {
    const response = await axiosInstance.put(`/api/visitor/updateVisitor/${visitorId}`, visitor);
    if (!response.data) throw new Error('Failed to save visitor data');
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
              <Textarea
                placeholder="Enter call remarks..."
                value={callRemark}
                onChange={(e) => setCallRemark(e.target.value)}
              />
              <Button
                className="mt-2"
                onClick={() =>
                  saveHistory('call', {
                    to: visitor.mobileNumber,
                    content: callRemark,
                  })
                }
              >
                Save Call Log
              </Button>
            </TabsContent>

            <TabsContent value="note">
              <Label>Note</Label>
              <Textarea
                placeholder="Enter note..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <Button
                className="mt-2"
                onClick={() =>
                  saveHistory('note', {
                    content: noteContent,
                  })
                }
              >
                Save
              </Button>
            </TabsContent>

            <TabsContent value="email">
              <Label>Email</Label>
              <Input value={visitor.email || ''} disabled />
              <Label className="mt-2">Title</Label>
              <Input
                placeholder="Enter email title"
                value={emailTitle}
                onChange={(e) => setEmailTitle(e.target.value)}
              />
              <Label className="mt-2">Subject</Label>
              <Textarea
                placeholder="Enter email subject or message..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
              <Button
                className="mt-2"
                onClick={() =>
                  saveHistory('email', {
                    to: visitor.email,
                    title: emailTitle,
                    content: emailContent,
                  })
                }
              >
                Send Email
              </Button>
            </TabsContent>

            <TabsContent value="whatsapp">
              <Label>WhatsApp Number</Label>
              <Input value={visitor.mobileNumber || ''} disabled />
              <Label className="mt-2">Title</Label>
              <Input
                placeholder="Enter WhatsApp title"
                value={whatsappTitle}
                onChange={(e) => setWhatsappTitle(e.target.value)}
              />
              <Label className="mt-2">Content</Label>
              <Textarea
                placeholder="Enter WhatsApp message content..."
                value={whatsappContent}
                onChange={(e) => setWhatsappContent(e.target.value)}
              />
              <Button
                className="mt-2"
                onClick={() =>
                  saveHistory('whatsapp', {
                    to: visitor.mobileNumber,
                    title: whatsappTitle,
                    content: whatsappContent,
                  })
                }
              >
                Send WhatsApp
              </Button>
            </TabsContent>

            <TabsContent value="history">
              <div className="flex gap-4 justify-center mb-6">
                {history && history.map((item, index) => (
                  <div key={index}>{getIcon(item.type)}</div>
                ))}
              </div>

              <div className="space-y-6">
               {history && history.map((item, index) => (
  <div key={index} className="flex flex-col gap-2 border p-2 rounded">
    <div className="flex items-start gap-4">
      <div className="pt-1">{getIcon(item.type)}</div>
      <div className="flex-1">
        <p className="text-sm font-medium capitalize">{item.type}</p>
        <p className="text-muted-foreground text-xs">{item.createdAt}</p>
        {editingHistoryId === item.historyId ? (
          <Textarea
            className="mt-1"
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
          />
        ) : (
          <p className="mt-1">{item.content || item.title}</p>
        )}
      </div>
    </div>

    <div className="flex gap-2 mt-2 ml-8">
      {editingHistoryId === item.historyId ? (
        <>
          <Button
            size="sm"
            onClick={() => {
              updateHistory(item.historyId, { content: editingContent });
              setEditingHistoryId(null);
            }}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingHistoryId(null)}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button
            size="sm"
            onClick={() => {
              setEditingHistoryId(item.historyId);
              setEditingContent(item.content || item.title);
            }}
          >
            Update
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteHistory(item.historyId)}
          >
            Delete
          </Button>
        </>
      )}
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
