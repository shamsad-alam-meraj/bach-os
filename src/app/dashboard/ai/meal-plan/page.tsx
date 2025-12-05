'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { aiService } from '@/services/ai';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ChefHat, Download, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MealPlanPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Please enter your meal plan requirements');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const res = await aiService.generateMealPlan({
        prompt: prompt.trim(),
      });

      if (res.error) {
        setError(res.error.message || 'Failed to generate meal plan');
        return;
      }

      if (res.data) {
        setResult(res.data.mealPlan);
      }
    } catch (err) {
      setError('Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  const downloadMealPlan = () => {
    if (!result) return;

    const content = `AI Generated Meal Plan

Requirements: ${prompt}

${result}

Generated on: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const examplePrompts = [
    'Create a weekly meal plan for 20 people with vegetarian and non-vegetarian options, keeping costs under 50 BDT per meal.',
    'Plan nutritious breakfast, lunch, and dinner for 15 students for 7 days with balanced nutrition.',
    'Generate a cost-effective meal plan for a month with local ingredients and cultural preferences.',
    'Create a special diet meal plan for diabetic mess members with controlled carbohydrate intake.',
  ];

  return (
    <div className="min-h-screen bg-background page-theme-unified page-themed">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6">
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
                <h2 className="text-3xl font-bold">Meal Plan Generator</h2>
                <p className="text-muted-foreground">
                  Create nutritious and cost-effective meal plans
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
                    <ChefHat className="w-5 h-5" />
                    Meal Plan Requirements
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Describe your meal planning needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="prompt">Describe your requirements</Label>
                      <Textarea
                        id="prompt"
                        placeholder="E.g., Create a weekly meal plan for 20 people with vegetarian and non-vegetarian options, keeping costs under 50 BDT per meal..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[120px] max-h-40 resize-none mt-5"
                        required
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Example prompts:</Label>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {examplePrompts.map((example, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setPrompt(example)}
                            className="w-full text-left justify-start p-2 h-auto whitespace-normal"
                          >
                            <Sparkles className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-xs leading-relaxed">{example}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !prompt.trim()}
                      className="w-full bg-primary hover:bg-primary/80"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating Meal Plan...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Meal Plan
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Generated Meal Plan</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your AI-generated meal planning suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{result}</pre>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={downloadMealPlan} variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download Plan
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ChefHat className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Describe your requirements and generate a meal plan
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Tips for Better Meal Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Include in your prompt:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Number of people</li>
                        <li>• Duration (daily, weekly, monthly)</li>
                        <li>• Dietary preferences/restrictions</li>
                        <li>• Budget constraints</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Benefits:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Balanced nutrition</li>
                        <li>• Cost optimization</li>
                        <li>• Cultural preferences</li>
                        <li>• Seasonal ingredients</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
