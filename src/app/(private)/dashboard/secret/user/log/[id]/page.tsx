"use client"
import LogTable from '@/components/Table/Log';
import { useParams } from 'next/navigation';

export default function LogPage() {
  const params = useParams(); // ✅ Get params from URL

  return (
    <div className="content">
      <h1 className="text-2xl mb-4">Lịch Sử Log</h1>
      <LogTable params={{ id: params.id }} /> {/* ✅ Pass params */}
    </div>
  );
}
