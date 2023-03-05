import React from 'react';
import { Timeline } from 'antd';

const ActivityLog = () => {
  return (
    <Timeline>
      <Timeline.Item color="green">Approved User</Timeline.Item>
      <Timeline.Item color="blue">Added Thesis</Timeline.Item>
      <Timeline.Item color="red">Removed Thesis</Timeline.Item>
    </Timeline>
  );
};

export default ActivityLog;
