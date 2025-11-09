"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDatabase,
  ref,
  onValue,
} from "firebase/database"; // Make sure your Firebase app is initialized

export default function DashboardPage() {
  const router = useRouter();

  // Dashboard state for each module
  const [inventoryCount, setInventoryCount] = useState(0);
  const [productionCount, setProductionCount] = useState(0);
  const [complianceStatus, setComplianceStatus] = useState("Loading...");
  const [lastAudit, setLastAudit] = useState("");
  const [shippedCount, setShippedCount] = useState(0);
  const [pendingShipments, setPendingShipments] = useState(0);
  const [profitLossData, setProfitLossData] = useState([]);
  const [batchStatusData, setBatchStatusData] = useState([]);
  const [recentFormulas, setRecentFormulas] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Get live inventory count
  useEffect(() => {
    const db = getDatabase();
    onValue(ref(db, "inventory/count"), snapshot => {
      setInventoryCount(snapshot.val() || 0);
    });
    // If you store products shipped/pending in inventory node:
    onValue(ref(db, "inventory/shippedToday"), snapshot => {
      setShippedCount(snapshot.val() || 0);
    });
    onValue(ref(db, "inventory/pendingShipments"), snapshot => {
      setPendingShipments(snapshot.val() || 0);
    });
  }, []);

  // Get batches stats
  useEffect(() => {
    const db = getDatabase();
    onValue(ref(db, "batches/productionCount"), snapshot => {
      setProductionCount(snapshot.val() || 0);
    });
    onValue(ref(db, "batches/statusOverview"), snapshot => {
      setBatchStatusData(snapshot.val() || []);
    });
  }, []);

  // Get compliance status and last audit
  useEffect(() => {
    const db = getDatabase();
    onValue(ref(db, "compliance/status"), snapshot => {
      setComplianceStatus(snapshot.val() || "Unknown");
    });
    onValue(ref(db, "compliance/lastAudit"), snapshot => {
      setLastAudit(snapshot.val() || "");
    });
  }, []);

  // Get profit/loss chart data from budget node
  useEffect(() => {
    const db = getDatabase();
    onValue(ref(db, "budget/profitLoss"), snapshot => {
      setProfitLossData(snapshot.val() || []);
    });
  }, []);

  // Get recent formulas
  useEffect(() => {
    const db = getDatabase();
    onValue(ref(db, "formulas"), snapshot => {
      // Convert node to sorted array by updatedAt
      let data = Object.entries(snapshot.val() || {}).map(([id, f]) => ({
        id,
        ...f,
      }));
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setRecentFormulas(data.slice(0, 5));
    });
  }, []);

  // Get recent activities (example, you may have activities node)
  useEffect(() => {
    const db = getDatabase();
    onValue(ref(db, "activities"), snapshot => {
      let data = Object.entries(snapshot.val() || {}).map(([id, activity]) => ({
        id,
        ...activity,
      }));
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecentActivities(data.slice(0, 5));
    });
  }, []);

  // ...Render your UI as before, using these state variables

  return (
    <div>
      {/* Inventory Panel */}
      <div>{inventoryCount} items</div>
      {/* Production Panel */}
      <div>{productionCount} in production</div>
      {/* Compliance Panel */}
      <div>{complianceStatus} (Last audit: {lastAudit})</div>
      {/* Shipped Panel */}
      <div>{shippedCount} shipped, {pendingShipments} pending</div>
      {/* Profit & Loss Chart */}
      {/* pass profitLossData to your chart component */}
      {/* Batch Status Chart */}
      {/* pass batchStatusData to your chart component */}
      {/* Recent Formulas Table */}
      {/* map recentFormulas to your table */}
      {/* Recent Activities Table */}
      {/* map recentActivities to your table */}
    </div>
  );
}
