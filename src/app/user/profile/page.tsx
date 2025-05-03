import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecentRaces } from '@/components/leaderboard/recent-races';
import { StatsCards } from '@/components/leaderboard/stats-cards';
// import { TypingHistoryChart } from '@/components/leaderboard/typing-chart-history';
import { ProfileHeader } from '@/components/profile/profile-header';

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <ProfileHeader />

      <div className="mt-8">
        <StatsCards />
      </div>

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typing Performance</CardTitle>
              <CardDescription>
                Your typing speed and accuracy over time
              </CardDescription>
            </CardHeader>
            {/* <CardContent className="pl-2">
              <TypingHistoryChart />
            </CardContent> */}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Races</CardTitle>
              <CardDescription>Your most recent typing races</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentRaces />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Race History</CardTitle>
              <CardDescription>
                A complete record of your typing races
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentRaces showAll />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="achievements" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Badges and milestones you&rsquo;ve earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
