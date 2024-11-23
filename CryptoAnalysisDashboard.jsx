import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart } from 'recharts';
import { Loader2 } from 'lucide-react';

const CryptoAnalysisDashboard = () => {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/crypto-analysis/${selectedAsset}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setAnalysisData(result.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedAsset]);

  const calculateSummary = (data) => {
    if (!data || data.length === 0) return null;
    
    const returns = data.map(d => d.return);
    return {
      avgReturn: returns.reduce((a, b) => a + b, 0) / returns.length,
      positiveYears: returns.filter(r => r > 0).length,
      negativeYears: returns.filter(r => r < 0).length,
      bestReturn: Math.max(...returns),
      worstReturn: Math.min(...returns)
    };
  };

  const summary = calculateSummary(analysisData);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cryptocurrency December-March Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <RadioGroup
              defaultValue="BTC"
              value={selectedAsset}
              onValueChange={setSelectedAsset}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BTC" id="btc" />
                <Label htmlFor="btc">Bitcoin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ETH" id="eth" />
                <Label htmlFor="eth">Ethereum</Label>
              </div>
            </RadioGroup>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <>
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600">Average Return</div>
                    <div className="text-2xl font-bold">{summary.avgReturn.toFixed(1)}%</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600">Positive Years</div>
                    <div className="text-2xl font-bold">{summary.positiveYears}</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-600">Negative Years</div>
                    <div className="text-2xl font-bold">{summary.negativeYears}</div>
                  </div>
                </div>
              )}

              {analysisData && (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analysisData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis label={{ value: 'Return (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="return" fill="#3b82f6" name="Period Return %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analysisData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="volatility" stroke="#ef4444" name="Volatility %" />
                        <Line type="monotone" dataKey="drawdown" stroke="#eab308" name="Max Drawdown %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoAnalysisDashboard;