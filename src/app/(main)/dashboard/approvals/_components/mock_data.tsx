import { ApprovalRequest, ApprovedRequest, CheckedRequest, ReviewedRequest } from "@/types/tableColumns";

// Mock Data
export const mockPendingRequests: ApprovalRequest[] = [
  {
    id: "1",
    requestNumber: "REQ-2024-001",
    itemName: "Desktop Computers",
    quantity: 3,
    department: "IT Department",
    initiator: "Easy Gee",
    status: "PENDING",
    submittedDate: "2024-01-25",
    currentStage: "CHECKER",
    priority: "HIGH",
  },
  {
    id: "2",
    requestNumber: "REQ-2024-002",
    itemName: "Office Chairs",
    quantity: 10,
    department: "Administration",
    initiator: "Oluwasusi Stephen",
    status: "PENDING",
    submittedDate: "2024-01-26",
    currentStage: "CHECKER",
    priority: "MEDIUM",
  },
];

export const mockCheckedRequests: ApprovalRequest[] = [
  {
    id: "3",
    requestNumber: "REQ-2024-003",
    itemName: "Printers",
    quantity: 2,
    department: "Finance",
    initiator: "Mike Johnson",
    status: "CHECKED",
    submittedDate: "2024-01-24",
    currentStage: "REVIEWER",
    priority: "MEDIUM",
  },
];

export const mockReviewedRequests: ApprovalRequest[] = [
  {
    id: "4",
    requestNumber: "REQ-2024-004",
    itemName: "Laptops",
    quantity: 5,
    department: "Operations",
    initiator: "Sarah Williams",
    status: "REVIEWED",
    submittedDate: "2024-01-23",
    currentStage: "APPROVER",
    priority: "HIGH",
  },
];

export const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: "5",
    requestNumber: "REQ-2024-005",
    itemName: "Projectors",
    quantity: 1,
    department: "Training",
    initiator: "David Brown",
    status: "APPROVED",
    submittedDate: "2024-01-20",
    currentStage: "APPROVER",
    priority: "LOW",
  },
];

// approved

export const mockApprovedRequests: ApprovedRequest[] = [
  {
    id: "5",
    requestNumber: "REQ-2024-005",
    itemName: "Projectors",
    quantity: 1,
    department: "Training",
    initiator: "David Brown",
    approvedBy: "DG SON",
    approvedDate: "2024-01-26",
    procurementStatus: "IN_PROGRESS",
  },
  {
    id: "6",
    requestNumber: "REQ-2024-009",
    itemName: "Standing Desks",
    quantity: 8,
    department: "Administration",
    initiator: "Lisa Martinez",
    approvedBy: "DG SON",
    approvedDate: "2024-01-25",
    procurementStatus: "COMPLETED",
  },
  {
    id: "7",
    requestNumber: "REQ-2024-010",
    itemName: "Network Switches",
    quantity: 3,
    department: "IT Department",
    initiator: "Kevin Lee",
    approvedBy: "DG SON",
    approvedDate: "2024-01-27",
    procurementStatus: "PENDING",
  },
];

export const mockCheckedData: CheckedRequest[] = [
  {
    id: "3",
    requestNumber: "REQ-2024-003",
    itemName: "Printers",
    quantity: 2,
    department: "Finance",
    initiator: "Mike Johnson",
    checkedBy: "Sarah Checker",
    checkedDate: "2024-01-26",
    submittedDate: "2024-01-24",
  },
  {
    id: "4",
    requestNumber: "REQ-2024-007",
    itemName: "External Hard Drives",
    quantity: 5,
    department: "IT Department",
    initiator: "James Wilson",
    checkedBy: "Sarah Checker",
    checkedDate: "2024-01-27",
    submittedDate: "2024-01-25",
  },
];

export const mockReviewedData: ReviewedRequest[] = [
  {
    id: "4",
    requestNumber: "REQ-2024-004",
    itemName: "Laptops",
    quantity: 5,
    department: "Operations",
    initiator: "Sarah Williams",
    reviewedBy: "Director Stephen",
    reviewedDate: "2024-01-27",
    recommendation: "APPROVE",
  },
  {
    id: "5",
    requestNumber: "REQ-2024-008",
    itemName: "Conference Room Equipment",
    quantity: 1,
    department: "Administration",
    initiator: "Tom Anderson",
    reviewedBy: "Director Johnson",
    reviewedDate: "2024-01-26",
    recommendation: "APPROVE",
  },
];
