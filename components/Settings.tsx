import React, { useRef, useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle2, HardDrive } from 'lucide-react';
import { CollectionItem } from '../types';

interface SettingsProps {
  collection: CollectionItem[];
  setCollection: (newCollection: CollectionItem[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ collection, setCollection }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = () => {
    const dataStr = JSON.stringify(collection, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pikmin-keeper-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json) && json.length > 0 && json[0].id) {
          // Basic validation passed
          setCollection(json);
          setImportStatus('success');
          setTimeout(() => setImportStatus('idle'), 3000);
        } else {
          setImportStatus('error');
        }
      } catch (err) {
        console.error("Import failed", err);
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="glass-panel rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">設定與資料管理</h2>

      {/* Local Storage Info */}
      <div className="p-6 bg-white/60 rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <HardDrive size={120} />
        </div>
        <h3 className="font-bold text-gray-800 flex items-center mb-4 text-lg relative z-10">
            <HardDrive size={20} className="mr-2 text-gray-600" /> 本機儲存 (Local Storage)
        </h3>
        
        <div className="relative z-10">
            <p className="text-sm text-gray-500 mb-2 leading-relaxed">
                您的收藏進度會自動儲存在此瀏覽器中。請記得定期手動備份 JSON 檔案，以免清除瀏覽器快取後資料遺失。
            </p>
            <p className="text-xs text-green-600 font-medium flex items-center">
                 <CheckCircle2 size={12} className="mr-1" /> 自動儲存功能已啟用
            </p>
        </div>
      </div>

      <hr className="border-gray-300/30" />

      {/* Manual Export Section */}
      <div className="p-6 bg-white/60 rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm">
        <h3 className="font-bold text-gray-800 flex items-center mb-2 text-lg">
            <Download size={20} className="mr-2 text-gray-600" /> 手動匯出備份 (JSON)
        </h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">將你的收藏進度下載為 JSON 檔案，以防資料遺失或轉移至其他裝置。</p>
        <button 
            onClick={handleExport}
            className="px-5 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-black transition-colors font-medium flex items-center shadow-lg shadow-gray-900/20 active:scale-95 duration-200"
        >
            下載備份檔案
        </button>
      </div>

      {/* Manual Import Section */}
      <div className="p-6 bg-white/60 rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm">
        <h3 className="font-bold text-gray-800 flex items-center mb-2 text-lg">
            <Upload size={20} className="mr-2 text-gray-600" /> 手動匯入還原
        </h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">讀取之前的備份檔案以還原進度。注意：這將覆蓋目前的資料。</p>
        
        <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
        />
        
        <div className="flex items-center space-x-4">
            <button 
                onClick={handleImportClick}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm active:scale-95 duration-200"
            >
                選擇檔案...
            </button>
            
            {importStatus === 'success' && (
                <span className="text-green-600 text-sm flex items-center animate-in fade-in font-medium bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                    <CheckCircle2 size={16} className="mr-1.5" /> 匯入成功！
                </span>
            )}
            {importStatus === 'error' && (
                <span className="text-red-600 text-sm flex items-center animate-in fade-in font-medium bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                    <AlertCircle size={16} className="mr-1.5" /> 檔案格式錯誤
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;