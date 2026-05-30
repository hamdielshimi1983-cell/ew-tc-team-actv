import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

// Mock activity data - in real app would come from API
const MOCK_ACTIVITIES = [
  {
    id: 1,
    user: "Hamdi",
    action: "creative_approved",
    actionLabel: "Approved Creative",
    target: "Post #5",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: "Approved creative post for Q2 campaign",
  },
  {
    id: 2,
    user: "Bakr",
    action: "creative_uploaded",
    actionLabel: "Uploaded Creative",
    target: "Post #5",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    details: "Uploaded image and caption for Q2 campaign",
  },
  {
    id: 3,
    user: "Hadeer",
    action: "status_changed",
    actionLabel: "Status Changed",
    target: "Post #4",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    details: "Changed status from Approved to Published",
  },
  {
    id: 4,
    user: "Hamdi",
    action: "creative_returned",
    actionLabel: "Returned Creative",
    target: "Post #3",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    details: "Requested changes on creative submission",
  },
  {
    id: 5,
    user: "Asmaa",
    action: "creative_uploaded",
    actionLabel: "Uploaded Creative",
    target: "Post #3",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    details: "Uploaded video and internal notes",
  },
];

const ACTION_ICONS: Record<string, React.ReactNode> = {
  creative_uploaded: <FileText className="w-4 h-4" />,
  creative_approved: <CheckCircle className="w-4 h-4" />,
  creative_returned: <XCircle className="w-4 h-4" />,
  creative_published: <CheckCircle className="w-4 h-4" />,
  status_changed: <Clock className="w-4 h-4" />,
};

const ACTION_COLORS: Record<string, string> = {
  creative_uploaded: "bg-blue-100 text-blue-800",
  creative_approved: "bg-green-100 text-green-800",
  creative_returned: "bg-red-100 text-red-800",
  creative_published: "bg-green-100 text-green-800",
  status_changed: "bg-amber-100 text-amber-800",
};

export default function ActivityLog() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Global Activity Log</h1>
          <p className="text-slate-600 mt-1">Complete audit trail of all system actions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>
              {MOCK_ACTIVITIES.length} activities recorded
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200">
              {MOCK_ACTIVITIES.map((activity, index) => (
                <div key={activity.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        {ACTION_ICONS[activity.action] || <Clock className="w-4 h-4" />}
                      </div>
                      {index < MOCK_ACTIVITIES.length - 1 && (
                        <div className="w-0.5 h-12 bg-slate-200 mt-2" />
                      )}
                    </div>

                    {/* Activity content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${ACTION_COLORS[activity.action]} border-0`}>
                          {activity.actionLabel}
                        </Badge>
                        <span className="text-sm font-medium text-slate-900">
                          {activity.user}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {activity.details}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-mono">{activity.target}</span>
                        <span>{format(activity.timestamp, "MMM d, yyyy HH:mm")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
