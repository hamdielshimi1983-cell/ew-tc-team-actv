import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useState } from "react";
import { Plus, FileText, Clock, CheckCircle, XCircle, AlertCircle, LogOut, Globe } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

type StatusFilter = "Pending" | "In Review" | "Approved" | "Rejected" | null;

// Mock requests data
const MOCK_REQUESTS = [
  {
    id: 1,
    title: "Q2 Email Campaign",
    description: "Email templates for product launch",
    submitter: "Bakr",
    status: "Approved",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Social Media Graphics",
    description: "Instagram and Facebook graphics",
    submitter: "Asmaa",
    status: "Pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Video Script",
    description: "Product demo video script",
    submitter: "Bakr",
    status: "In Review",
    createdAt: new Date(),
  },
];

const STATUS_FILTERS: { label: string; value: StatusFilter; icon: React.ReactNode; color: string }[] = [
  { label: "Pending", value: "Pending", icon: <Clock className="w-5 h-5" />, color: "bg-amber-50 border-amber-200 hover:bg-amber-100" },
  { label: "In Review", value: "In Review", icon: <FileText className="w-5 h-5" />, color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
  { label: "Approved", value: "Approved", icon: <CheckCircle className="w-5 h-5" />, color: "bg-green-50 border-green-200 hover:bg-green-100" },
  { label: "Rejected", value: "Rejected", icon: <XCircle className="w-5 h-5" />, color: "bg-red-50 border-red-200 hover:bg-red-100" },
];

const STATUS_BADGE_CONFIG: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Pending": { bg: "bg-amber-100", text: "text-amber-800", icon: <Clock className="w-3 h-3" /> },
  "In Review": { bg: "bg-blue-100", text: "text-blue-800", icon: <FileText className="w-3 h-3" /> },
  "Approved": { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle className="w-3 h-3" /> },
  "Rejected": { bg: "bg-red-100", text: "text-red-800", icon: <XCircle className="w-3 h-3" /> },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [, navigate] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>(null);

  const requests = MOCK_REQUESTS;
  const filteredRequests = selectedStatus
    ? requests.filter(req => req.status === selectedStatus)
    : requests;

  const statusCounts = {
    "Pending": requests.filter(r => r.status === "Pending").length || 0,
    "In Review": requests.filter(r => r.status === "In Review").length || 0,
    "Approved": requests.filter(r => r.status === "Approved").length || 0,
    "Rejected": requests.filter(r => r.status === "Rejected").length || 0,
  };

  const isAdmin = user?.role === "admin";
  const isMediaBuyer = user?.role === "media_buyer";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role.replace("_", " ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm"
              >
                <Globe className="w-4 h-4" />
                {language === "en" ? "العربية" : "English"}
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm text-slate-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t("marketingRequests")}</h1>
              <p className="text-slate-600 mt-1">{t("manageAndTrack")}</p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button
                  onClick={() => navigate("/briefs")}
                  variant="outline"
                  className="border-slate-300"
                >
                  {t("briefs")}
                </Button>
              )}
              {isAdmin && (
                <Button
                  onClick={() => navigate("/activity")}
                  variant="outline"
                  className="border-slate-300"
                >
                  {t("activityLog")}
                </Button>
              )}
              {isMediaBuyer && (
                <Button
                  onClick={() => navigate("/media-buyer")}
                  variant="outline"
                  className="border-slate-300"
                >
                  {t("mediabuyer")}
                </Button>
              )}
              <Button
                onClick={() => navigate("/create")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t("newRequest")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Filter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATUS_FILTERS.map(filter => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(selectedStatus === filter.value ? null : filter.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedStatus === filter.value
                  ? `${filter.color} border-current`
                  : `${filter.color} border-transparent`
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{filter.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {statusCounts[filter.value as keyof typeof statusCounts]}
                  </p>
                </div>
                <div className="text-slate-400">{filter.icon}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Requests List */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle>{t("allRequests")}</CardTitle>
            <CardDescription>
              {filteredRequests.length} {filteredRequests.length === 1 ? "request" : "requests"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">{t("noRequests")}</p>
                <p className="text-slate-500 text-sm mt-1">{t("createFirst")}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredRequests.map(request => (
                  <div
                    key={request.id}
                    onClick={() => navigate(`/request/${request.id}`)}
                    className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 line-clamp-1">{request.title}</h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{request.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                          <span>By: {request.submitter}</span>
                          <span>{format(request.createdAt, "MMM d, yyyy")}</span>
                        </div>
                      </div>
                      <Badge className={`${STATUS_BADGE_CONFIG[request.status].bg} ${STATUS_BADGE_CONFIG[request.status].text} border-0 whitespace-nowrap ml-4`}>
                        {STATUS_BADGE_CONFIG[request.status].icon}
                        <span className="ml-1">{request.status}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
