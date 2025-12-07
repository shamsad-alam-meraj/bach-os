'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api-client';
import { aiService } from '@/services/ai';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Calendar, Download, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MarketSchedulePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    schedule: { date: string; member: string }[];
    explanation: string;
    confidence: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    messId: '',
    prompt: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUserMess();
  }, [router]);

  const fetchUserMess = async () => {
    try {
      const profileRes = await apiClient.get<{ id: string; messId?: string }>('/users/profile');
      if (profileRes.data?.messId) {
        setFormData((prev) => ({ ...prev, messId: profileRes.data!.messId! }));
      }
    } catch (err) {
      // Ignore error, user can manually enter messId
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.messId || !formData.prompt) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const res = await aiService.generateMarketSchedule({
        messId: formData.messId,
        prompt: formData.prompt,
        month: formData.month,
        year: formData.year,
      });

      if (res.error) {
        setError(res.error.message || 'Failed to generate schedule');
        return;
      }

      if (res.data && (res.data as any).data) {
        setResult((res.data as any).data);
      }
    } catch (err) {
      setError('Failed to generate market schedule');
    } finally {
      setLoading(false);
    }
  };

  const downloadSchedule = () => {
    if (!result) return;

    const content = `Market Duty Schedule
Month: ${formData.month}/${formData.year}

Generated Schedule:
${result.schedule.map((item, index) => `${index + 1}. ${item.date} - ${item.member}`).join('\n')}

Explanation:
${result.explanation}

Confidence: ${result.confidence}%
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-schedule-${formData.month}-${formData.year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen bg-background page-theme-unified page-themed">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" onClick={() => router.push('/dashboard/ai')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to AI Tools
              </Button>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Market Schedule Generator</h2>
                <p className="text-muted-foreground">
                  Generate fair market duty schedules for your mess
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule Parameters
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Configure your market schedule requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label className="mb-2" htmlFor="messId">
                        Mess ID
                      </Label>
                      <Input
                        id="messId"
                        placeholder="Enter your mess ID"
                        value={formData.messId}
                        onChange={(e) => setFormData({ ...formData, messId: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2" htmlFor="month">
                          Month
                        </Label>
                        <Select
                          value={formData.month.toString()}
                          onValueChange={(value) =>
                            setFormData({ ...formData, month: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value.toString()}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="mb-2" htmlFor="year">
                          Year
                        </Label>
                        <Select
                          value={formData.year.toString()}
                          onValueChange={(value) =>
                            setFormData({ ...formData, year: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2" htmlFor="prompt">
                        Requirements
                      </Label>
                      <Textarea
                        id="prompt"
                        placeholder="Describe your market schedule requirements (e.g., number of members, special constraints, etc.)"
                        value={formData.prompt}
                        onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                        className="min-h-[100px] max-h-40 resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/80"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating Schedule...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Schedule
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Generated Schedule</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your AI-generated market duty schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">Generating your market schedule...</p>
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-3">Market Duty Dates:</h4>
                        <div className="space-y-2">
                          {result.schedule.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              <span>{item.date} - {item.member}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">AI Explanation:</h4>
                        <p className="text-sm text-muted-foreground">{result.explanation}</p>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <span className="text-sm text-muted-foreground">Confidence:</span>
                          <span className="ml-2 font-semibold">{result.confidence}%</span>
                        </div>
                        <Button onClick={downloadSchedule} variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Fill out the form and generate your schedule
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
