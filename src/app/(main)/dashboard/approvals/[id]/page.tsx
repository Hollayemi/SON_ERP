"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle, XCircle, ArrowLeft, FileText, User, Calendar, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RequestDetail {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: {
    name: string;
    email: string;
    department: string;
  };
  purpose: string;
  justification: string;
  status: string;
  currentStage: "CHECKER" | "REVIEWER" | "APPROVER";
  submittedDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  approvalHistory: Array<{
    stage: string;
    approver: string;
    action: string;
    comments: string;
    date: string;
  }>;
}

// Mock data
const mockRequestDetail: RequestDetail = {
  id: "1",
  requestNumber: "REQ-2024-001",
  itemName: "Desktop Computers",
  quantity: 3,
  department: "IT Department",
  initiator: {
    name: "Easy Gee",
    email: "easy.gee@son.gov.ng",
    department: "IT Department",
  },
  purpose: "To replace outdated computers that are affecting productivity",
  justification:
    "The current computers are over 5 years old and can no longer run the latest software required for our operations. This is causing significant delays in project completion and affecting team productivity. New computers with updated specifications will improve efficiency by at least 40%.",
  status: "PENDING",
  currentStage: "CHECKER",
  submittedDate: "2024-01-25",
  priority: "HIGH",
  documents: [
    {
      id: "1",
      name: "Technical_Specifications.pdf",
      type: "PDF",
      url: "#",
    },
    {
      id: "2",
      name: "Budget_Justification.docx",
      type: "DOCX",
      url: "#",
    },
  ],
  approvalHistory: [],
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CHECKED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REVIEWED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function ApprovalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [request] = useState<RequestDetail>(mockRequestDetail);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Request approved successfully!", {
        description: `${request.requestNumber} has been forwarded to the next stage.`,
      });

      router.push("/dashboard/approvals");
    } catch (error) {
      toast.error("Failed to approve request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      toast.error("Please provide rejection comments");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Request rejected", {
        description: `${request.requestNumber} has been rejected with comments.`,
      });

      router.push("/dashboard/approvals");
    } catch (error) {
      toast.error("Failed to reject request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = async () => {
    if (!comments.trim()) {
      toast.error("Please provide return comments");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Request returned for correction", {
        description: `${request.requestNumber} has been sent back to the initiator.`,
      });

      router.push("/dashboard/approvals");
    } catch (error) {
      toast.error("Failed to return request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">Review Request</h1>
          <p className="text-muted-foreground text-sm">Evaluate and process this approval request</p>
        </div>
        <Badge variant="outline" className={statusColors[request.status as keyof typeof statusColors]}>
          {request.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    Request Details
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Request ID: <span className="font-mono font-medium">{request.requestNumber}</span>
                  </CardDescription>
                </div>
                <Badge variant="outline" className={priorityColors[request.priority]}>
                  {request.priority} PRIORITY
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground text-xs">Item Requested</Label>
                  <p className="font-medium">{request.itemName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Quantity</Label>
                  <p className="font-medium">{request.quantity}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Department</Label>
                  <p className="font-medium">{request.department}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Submitted Date</Label>
                  <p className="font-medium">
                    {new Date(request.submittedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-muted-foreground text-xs">Purpose</Label>
                <p className="mt-2 text-sm leading-relaxed">{request.purpose}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Justification</Label>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{request.justification}</p>
              </div>
            </CardContent>
          </Card>

          {/* Initiator Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Initiator Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-xs">Name</Label>
                <p className="font-medium">{request.initiator.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Email</Label>
                <p className="font-medium">{request.initiator.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Department</Label>
                <p className="font-medium">{request.initiator.department}</p>
              </div>
            </CardContent>
          </Card>

          {/* Supporting Documents */}
          {request.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Supporting Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {request.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="hover:bg-accent flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-muted-foreground size-5" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-muted-foreground text-xs">{doc.type}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approval History */}
          {request.approvalHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  Approval History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.approvalHistory.map((history, index) => (
                    <div key={index} className="border-muted border-l-2 pl-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{history.stage}</p>
                          <p className="text-muted-foreground text-sm">{history.approver}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            history.action === "APPROVED" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }
                        >
                          {history.action}
                        </Badge>
                      </div>
                      {history.comments && <p className="text-muted-foreground mt-2 text-sm">{history.comments}</p>}
                      <p className="text-muted-foreground mt-1 text-xs">
                        {new Date(history.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-5" />
                Take Action
              </CardTitle>
              <CardDescription>Review and approve or reject this request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  placeholder="Add your comments or feedback..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="mt-2 min-h-32 resize-none"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" disabled={isSubmitting}>
                      <CheckCircle className="mr-2" />
                      Approve Request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve this request? It will be forwarded to the next stage in the
                        approval workflow.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleApprove}>Approve</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" variant="outline" disabled={isSubmitting}>
                      <Send className="mr-2" />
                      Return for Correction
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Return for Correction</AlertDialogTitle>
                      <AlertDialogDescription>
                        This request will be sent back to the initiator for corrections. Please ensure you&lsquo;ve
                        added comments explaining what needs to be changed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReturn}>Return</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" variant="destructive" disabled={isSubmitting}>
                      <XCircle className="mr-2" />
                      Reject Request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reject this request? This action cannot be undone. Please ensure
                        you&lsquo;ve provided rejection comments.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground">
                        Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="text-muted-foreground space-y-1 border-t pt-4 text-xs">
                <p>• Approved requests move to the next stage</p>
                <p>• Rejected requests are closed permanently</p>
                <p>• Returned requests go back to initiator</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
