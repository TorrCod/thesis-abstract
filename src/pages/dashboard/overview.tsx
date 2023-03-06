import DashboardLayout from "@/components/dashboardLayout";
import React, { Component } from "react";

export class DashboardOverview extends Component {
  render() {
    return (
      <DashboardLayout
        userSelectedMenu="/dashboard"
        userSelectedSider="/dashboard/overview"
      >
        dashboardOverview
      </DashboardLayout>
    );
  }
}

export default DashboardOverview;
