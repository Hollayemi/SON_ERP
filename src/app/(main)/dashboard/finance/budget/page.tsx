"use client";

import { useState } from "react";
import { TrendingDown, TrendingUp, Wallet, AlertTriangle, Download } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BudgetCategory {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
}

interface MonthlyExpenditure {
  month: string;
  amount: number;
}

const mockBudgetData: BudgetCategory[] = [
  {
    id: "1",
    category: "IT Equipment",
    allocated: 5000000,
    spent: 2450000,
    remaining: 2550000,
    percentage: 49,
    status: "HEALTHY",
  },
  {
    id: "2",
    category: "Office Furniture",
    allocated: 2000000,
    spent: 1600000,
    remaining: 400000,
    percentage: 80,
    status: "WARNING",
  },
  {
    id: "3",
    category: "Office Supplies",
    allocated: 1500000,
    spent: 950000,
    remaining: 550000,
    percentage: 63,
    status: "HEALTHY",
  },
  {
    id: "4",
    category: "Training & Development",
    allocated: 3000000,
    spent: 2750000,
    remaining: 250000,
    percentage: 92,
    status: "CRITICAL",
  },
  {
    id: "5",
    category: "Maintenance",
    allocated: 1000000,
    spent: 450000,
    remaining: 550000,
    percentage: 45,
    status: "HEALTHY",
  },
];

const mockMonthlyData: MonthlyExpenditure[] = [
  { month: "Jan", amount: 3200000 },
  { month: "Feb", amount: 2800000 },
  { month: "Mar", amount: 4100000 },
  { month: "Apr", amount: 3500000 },
  { month: "May", amount: 4200000 },
  { month: "Jun", amount: 3900000 },
];

const statusColors = {
  HEALTHY: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  WARNING: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function BudgetTrackerPage() {
  const [data] = useState<BudgetCategory[]>(mockBudgetData);
  const [selectedYear, setSelectedYear] = useState("2024");

  const totalAllocated = data.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = data.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalAllocated) * 100);

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Budget Tracker</h1>
          <p className="text-muted-foreground text-sm">Monitor budget allocation and spending across departments</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Wallet className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalAllocated.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1 text-xs">Allocated for {selectedYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1 text-xs">{overallPercentage}% of budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRemaining.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1 text-xs">{100 - overallPercentage}% available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Categories</CardTitle>
            <AlertTriangle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((c) => c.status === "CRITICAL").length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Above 90% spent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Budget Utilization</CardTitle>
          <CardDescription>Total budget usage across all categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget Utilization</span>
              <span className="font-medium">{overallPercentage}%</span>
            </div>
            <Progress value={overallPercentage} className="h-3" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Spent: ₦{totalSpent.toLocaleString()}</span>
              <span className="text-muted-foreground">Remaining: ₦{totalRemaining.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget by Category</CardTitle>
              <CardDescription>Detailed breakdown of budget allocation and spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{category.category}</div>
                        <Badge variant="outline" className={statusColors[category.status]}>
                          {category.status}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium">{category.percentage}%</div>
                    </div>

                    <Progress value={category.percentage} className="h-2" />

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">Allocated</div>
                        <div className="font-medium">₦{category.allocated.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Spent</div>
                        <div className="font-medium">₦{category.spent.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Remaining</div>
                        <div className="font-medium">₦{category.remaining.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenditure Trend</CardTitle>
              <CardDescription>Monthly spending pattern for {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMonthlyData.map((month) => (
                  <div key={month.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{month.month}</div>
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-muted-foreground">₦{month.amount.toLocaleString()}</span>
                        <span className="font-medium">
                          {Math.round((month.amount / totalAllocated) * 100)}% of total budget
                        </span>
                      </div>
                      <Progress value={(month.amount / totalAllocated) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <div className="text-muted-foreground text-xs">Average Monthly</div>
                    <div className="mt-1 text-lg font-semibold">
                      ₦
                      {Math.round(
                        mockMonthlyData.reduce((sum, m) => sum + m.amount, 0) / mockMonthlyData.length,
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Highest Month</div>
                    <div className="mt-1 text-lg font-semibold">
                      ₦{Math.max(...mockMonthlyData.map((m) => m.amount)).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Lowest Month</div>
                    <div className="mt-1 text-lg font-semibold">
                      ₦{Math.min(...mockMonthlyData.map((m) => m.amount)).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Total YTD</div>
                    <div className="mt-1 text-lg font-semibold">
                      ₦{mockMonthlyData.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
