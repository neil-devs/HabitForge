import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { CountUpNumber } from '../../components/animations/CountUpNumber';
import { CompletionAreaChart } from '../../components/charts/CompletionAreaChart';
import { CategoryPieChart } from '../../components/charts/CategoryPieChart';

const AnalyticsPage = () => {
  const { getOverview, getCompletionRate, getCategoryBreakdown } = useAnalytics();
  
  const { data: overview, isLoading: overviewLoading } = getOverview;
  const { data: rateData, isLoading: rateLoading } = getCompletionRate(30);
  const { data: categoryData, isLoading: catLoading } = getCategoryBreakdown;

  if (overviewLoading || rateLoading) {
    return <Skeleton className="w-full h-screen rounded-xl" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Insights</h1>
        <p className="text-text-muted">Deep dive into your behavioral data.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20" hover>
          <div className="text-sm font-medium text-emerald-500 uppercase tracking-wider mb-2">Total Completions</div>
          <CountUpNumber value={overview?.total_completions || 0} className="text-4xl font-bold tnum" />
        </Card>
        <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20" hover>
          <div className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-2">Best Streak</div>
          <CountUpNumber value={overview?.best_streak || 0} suffix=" days" className="text-4xl font-bold tnum" />
        </Card>
        <Card className="p-6 bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20" hover>
          <div className="text-sm font-medium text-violet-500 uppercase tracking-wider mb-2">XP This Month</div>
          <CountUpNumber value={overview?.xp_this_month || 0} className="text-4xl font-bold tnum" />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6" hover>
          <h3 className="font-bold text-lg mb-6">30-Day Completion Rate</h3>
          <CompletionAreaChart data={rateData} />
        </Card>

        <Card className="p-6" hover>
          <h3 className="font-bold text-lg mb-6">Category Breakdown</h3>
          <CategoryPieChart data={categoryData} />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
