
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Search, Calendar, TrendingUp, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      title: "Total People",
      value: "1,247",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Documents",
      value: "3,891",
      change: "+8.2%",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "ID Cards Issued",
      value: "892",
      change: "+15.3%",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Monthly Growth",
      value: "23.1%",
      change: "+4.1%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    { id: 1, action: "New person added", name: "John Doe", time: "2 minutes ago" },
    { id: 2, action: "Document uploaded", name: "Jane Smith", time: "5 minutes ago" },
    { id: 3, action: "ID Card generated", name: "Mike Johnson", time: "10 minutes ago" },
    { id: 4, action: "Profile updated", name: "Sarah Wilson", time: "15 minutes ago" },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your identity management system
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-primary to-accent">
            <Link to="/people">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Person
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks you can perform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/people">
                  <Users className="mr-2 h-4 w-4" />
                  Manage People
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/documents">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Documents
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Search Records
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/id-cards">
                  <Calendar className="mr-2 h-4 w-4" />
                  Generate ID Cards
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.name} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
