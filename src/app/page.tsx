"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import { Box, FlaskConical, CheckCircle, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth'; // ADD THIS LINE

const batchStatusChartData = [
  { status: 'In Progress', count: 45, fill: 'hsl(var(--chart-1))' },
  { status: 'Completed', count: 78, fill: 'hsl(var(--chart-2))' },
  { status: 'QA Pending', count: 22, fill: 'hsl(var(--chart-4))' },
  { status: 'On Hold', count: 12, fill: 'hsl(var(--destructive))' },
];

const batchStatusChartConfig: ChartConfig = {
  count: {
    label: 'Batches',
  },
};

const profitLossData = [
  { month: 'Jan', profit: 4000, loss: 2400 },
  { month: 'Feb', profit: 3000, loss: 1398 },
  { month: 'Mar', profit: 2000, loss: 9800 },
  { month: 'Apr', profit: 2780, loss: 3908 },
  { month: 'May', profit: 1890, loss: 4800 },
  { month: 'Jun', profit: 2390, loss: 3800 },
];

const profitLossChartConfig: ChartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
  loss: {
    label: "Loss",
    color: "hsl(var(--destructive))",
  },
};

const recentActivities = [
  { id: 'ACT-001', description: 'Raw material RM-456 received', timestamp: '2 hours ago', type: 'Inventory' },
  { id: 'ACT-002', description: 'Batch B-789 moved to QA phase', timestamp: '5 hours ago', type: 'Batch' },
  { id: 'ACT-003', description: 'Finished product FP-123 shipped', timestamp: '1 day ago', type: 'Inventory' },
  { id: 'ACT-004', description: 'Compliance audit passed for Line 2', timestamp: '2 days ago', type: 'Compliance' },
  { id: 'ACT-005', description: 'Batch B-788 completed manufacturing', timestamp: '3 days ago', type: 'Batch' },
];

const recentFormulas = [
  { id: 'F-002-D', productName: 'PainAway Syrup', version: 2.6, status: 'Active' },
  { id: 'F-004-A', productName: 'Ortho-Relief Gel', version: 0.8, status: 'In Development' },
  { id: 'F-001-B', productName: 'Pharma-C 500mg Tablets', version: 1.3, status: 'Superseded' },
  { id: 'F-003-B', productName: 'Vita-Boost Capsules', version: 1.0, status: 'In Development' },
  { id: 'F-001-A', productName: 'Pharma-C 500mg Tablets', version: 1.2, status: 'Active' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Log out handler
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem('auth'); // clear local token
      router.push('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('auth');
      if (!authToken) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    };

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'In Development':
        return 'secondary';
      case 'Superseded':
        return 'outline';
      case 'Retired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* LOG OUT BUTTON AT TOP-RIGHT */}
      <Button
        variant="outline"
        className="absolute right-4 top-4 z-50"
        onClick={handleLogout}
      >
        Log out
      </Button>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/inventory">
          <Card className="hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inventory Items
              </CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,453</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/batch-tracking">
          <Card className="hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Batches in Production</CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+5 since yesterday</p>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Compliant</div>
            <p className="text-xs text-muted-foreground">Last audit 2 days ago</p>
          </CardContent>
        </Card>
        <Link href="/inventory">
          <Card className="hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Shipped Today</CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,204</div>
              <p className="text-xs text-muted-foreground">3 shipments pending</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profit & Loss</CardTitle>
            <CardDescription>Last 6 months performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={profitLossChartConfig} className="min-h-[250px] w-full">
              <BarChart data={profitLossData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
                <Bar dataKey="loss" fill="var(--color-loss)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Batch Status Overview</CardTitle>
            <CardDescription>A summary of current production batch statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={batchStatusChartConfig} className="min-h-[250px] w-full">
              <BarChart accessibilityLayer data={batchStatusChartData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="status" type="category" tickLine={false} axisLine={false} />
                <XAxis type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" layout="vertical" radius={5}>
                  {batchStatusChartData.map((entry) => (
                    <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Formulas</CardTitle>
                <CardDescription>A list of the latest drug formulations.</CardDescription>
              </div>
              <Link href="/formulas">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formula ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Version</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentFormulas.map((formula) => (
                  <TableRow key={formula.id}>
                    <TableCell className="font-medium">
                      <Link href={`/formulas/${formula.id}`} className="text-primary hover:underline">
                        {formula.id}
                      </Link>
                    </TableCell>
                    <TableCell>{formula.productName}</TableCell>
                    <TableCell className="text-right">{formula.version.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(formula.status)}>{formula.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A log of the latest actions across the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.description}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={activity.type === 'Compliance' ? 'default' : 'secondary'}>
                        {activity.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
