'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import {
  ArrowRight,
  BarChart3,
  Code,
  FileText,
  History,
  LineChart,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';

import { useAuth } from '@/lib/context/auth-context';
import {
  ChartDataResponse,
  DrillService,
  HistoryResponse,
} from '@/lib/services/drill-service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccuracyChart } from '@/components/dashboard/accuracy-chart';
import { ComparisonChart } from '@/components/dashboard/comparison-chart';
import { HistoryList } from '@/components/dashboard/history-list';
import { ProgressionChart } from '@/components/dashboard/progression-chart';
import { StatsCards } from '@/components/leaderboard/stats-cards';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('activity');
  const [chartData, setChartData] = useState<ChartDataResponse['data'] | null>(
    null
  );
  const [history, setHistory] = useState<HistoryResponse['data'] | null>(null);
  const [isLoadingCharts, setIsLoadingCharts] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Fetch chart data and history on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingCharts(true);
        setIsLoadingHistory(true);

        // Fetch chart data
        const chartResponse = await DrillService.getChartData();
        if (chartResponse.success) {
          setChartData(chartResponse.data);
        }

        // Fetch history data
        const historyResponse = await DrillService.getUserHistory();
        if (historyResponse.success) {
          setHistory(historyResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoadingCharts(false);
        setIsLoadingHistory(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      title: 'Practice',
      description: 'Improve your typing skills with practice drills',
      icon: Target,
      href: ROUTES.PRACTICE,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Code Practice',
      description: 'Practice typing code snippets in various languages',
      icon: Code,
      href: `${ROUTES.PRACTICE}/code`,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Competition',
      description: 'Join or create typing competitions',
      icon: Zap,
      href: ROUTES.COMPETITION.HOME,
      color: 'bg-red-500/10 text-red-500',
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank against other typists',
      icon: Trophy,
      href: ROUTES.LEADERBOARD,
      color: 'bg-amber-500/10 text-amber-500',
    },
  ];

  return (
    <div className="container p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name || 'Typist'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and continue improving your typing skills
        </p>
      </div>

      <div className="mb-8">
        <StatsCards />
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className={`w-fit rounded-lg p-2 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-2 text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between"
                >
                  <Link href={action.href}>
                    Start <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="activity">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="stats">
            <LineChart className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <BarChart3 className="mr-2 h-4 w-4" />
            Comparison
          </TabsTrigger>
        </TabsList>

        {/* History Tab */}
        <TabsContent value="activity" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest typing drills and competitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <HistoryList
                  drillHistory={[]}
                  raceHistory={[]}
                  isLoading={true}
                />
              ) : history ? (
                <HistoryList
                  drillHistory={history.drillHistory}
                  raceHistory={history.raceHistory}
                />
              ) : (
                <div className="rounded-md border p-4 text-center">
                  <p className="text-muted-foreground">
                    No activity found. Complete drills or races to see your
                    history here.
                  </p>
                  <div className="mt-4 flex justify-center space-x-4">
                    <Button asChild variant="outline">
                      <Link href={ROUTES.PRACTICE}>Practice Now</Link>
                    </Button>
                    <Button asChild>
                      <Link href={ROUTES.COMPETITION.HOME}>Join a Race</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            {history &&
              (history.drillHistory.length > 0 ||
                history.raceHistory.length > 0) && (
                <CardFooter className="border-t px-6 py-4">
                  <div className="text-muted-foreground text-sm">
                    Showing recent history (
                    {history.drillHistory.length + history.raceHistory.length}{' '}
                    items)
                  </div>
                </CardFooter>
              )}
          </Card>
        </TabsContent>

        {/* Performance Charts Tab */}
        <TabsContent value="stats" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>WPM Progression</CardTitle>
                <CardDescription>Your typing speed over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingCharts ? (
                  <div className="flex h-full items-center justify-center">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : chartData?.progression ? (
                  <ProgressionChart data={chartData.progression} />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <LineChart className="mb-2 h-10 w-10 opacity-20" />
                    <p className="text-muted-foreground">
                      Complete more typing activities to see your performance
                      charts
                    </p>
                    <Button asChild className="mt-4">
                      <Link href={ROUTES.PRACTICE}>Practice Now</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accuracy Tracking</CardTitle>
                <CardDescription>
                  Your typing accuracy over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingCharts ? (
                  <div className="flex h-full items-center justify-center">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : chartData?.progression ? (
                  <AccuracyChart data={chartData.progression} />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <Target className="mb-2 h-10 w-10 opacity-20" />
                    <p className="text-muted-foreground">
                      Complete more typing activities to see your accuracy
                      charts
                    </p>
                    <Button asChild className="mt-4">
                      <Link href={ROUTES.PRACTICE}>Practice Now</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Drill vs Race Performance</CardTitle>
                <CardDescription>
                  Compare your performance in drills and races
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingCharts ? (
                  <div className="flex h-full items-center justify-center">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : chartData?.typeStats ? (
                  <ComparisonChart
                    typeStats={chartData.typeStats}
                    mode="type"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <BarChart3 className="mb-2 h-10 w-10 opacity-20" />
                    <p className="text-muted-foreground">
                      Complete drills and races to see comparison charts
                    </p>
                    <Button asChild className="mt-4">
                      <Link href={ROUTES.PRACTICE}>Practice Now</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Text vs Code Performance</CardTitle>
                <CardDescription>
                  Compare your performance with different content types
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingCharts ? (
                  <div className="flex h-full items-center justify-center">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : chartData?.categoryStats ? (
                  <ComparisonChart
                    categoryStats={chartData.categoryStats}
                    mode="category"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-2 flex items-center gap-4">
                      <FileText className="h-8 w-8 opacity-20" />
                      <Code className="h-8 w-8 opacity-20" />
                    </div>
                    <p className="text-muted-foreground">
                      Practice with different content types to see comparison
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button asChild variant="outline">
                        <Link href={ROUTES.PRACTICE}>Text Practice</Link>
                      </Button>
                      <Button asChild>
                        <Link href={`${ROUTES.PRACTICE}/code`}>
                          Code Practice
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
