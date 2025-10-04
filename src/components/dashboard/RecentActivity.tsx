import React from 'react';
import { Card } from '../ui/Card';
import mockData from '../../data/mockData.json';

export const RecentActivity: React.FC = () => {
  const { recentActivity } = mockData;

  return (
    <Card>
      <h2 className="text-2xl font-bold text-primary-dark mb-6">Actividad reciente</h2>
      <div className="space-y-4">
        {recentActivity.map((activity, index) => (
          <div
            key={index}
            className="bg-secondary bg-opacity-20 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-primary-dark">
                  {activity.description}
                </p>
                <p className="text-text-secondary text-sm">
                  {activity.user} - {activity.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
