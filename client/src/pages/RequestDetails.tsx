import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, MessageSquare, FileText, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface RequestDetailsProps {
  requestId: string;
}

export default function RequestDetails({ requestId }: RequestDetailsProps) {
  const [, navigate] = useLocation();
  const [newComment, setNewComment] = useState("");

  // Mock request data
  const request = {
    id: parseInt(requestId, 10),
    title: "Q2 Email Campaign",
    description: "Email templates for product launch",
    submitter: "Bakr",
    status: "Approved",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    comments: [
      {
        id: 1,
        author: "Hamdi",
        content: "Looks good! Please adjust the color scheme slightly.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  };

  const statusColors: Record<string, string> = {
    "Pending": "bg-amber-100 text-amber-800",
    "In Review": "bg-blue-100 text-blue-800",
    "Approved": "bg-green-100 text-green-800",
    "Rejected": "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">{request.title}</h1>
            <Badge className={`${statusColors[request.status]} border-0 px-3 py-1`}>
              {request.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-1">Description</p>
                  <p className="text-slate-900">{request.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">Submitted By</p>
                    <p className="text-slate-900">{request.submitter}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">Deadline</p>
                    <p className="text-slate-900">{format(request.deadline, "MMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">Created</p>
                    <p className="text-slate-900 text-sm">{format(request.createdAt, "MMM d, yyyy HH:mm")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">Updated</p>
                    <p className="text-slate-900 text-sm">{format(request.updatedAt, "MMM d, yyyy HH:mm")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments & Feedback
                </CardTitle>
                <CardDescription>{request.comments.length} comments</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {request.comments.map(comment => (
                  <div key={comment.id} className="border-l-2 border-blue-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-900">{comment.author}</p>
                      <p className="text-xs text-slate-500">{format(comment.createdAt, "MMM d, yyyy HH:mm")}</p>
                    </div>
                    <p className="text-slate-700">{comment.content}</p>
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-200">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border-slate-300"
                    rows={3}
                  />
                  <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button className="w-full border-slate-300" variant="outline">
                  Request Changes
                </Button>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-base">Status History</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Approved</p>
                      <p className="text-slate-500 text-xs">by Hamdi</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Submitted</p>
                      <p className="text-slate-500 text-xs">by Bakr</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
