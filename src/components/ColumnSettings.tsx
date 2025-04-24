import React, { useState, useEffect } from 'react';
import './ColumnSettings.css';

// 表格列配置项
export interface ColumnConfig {
  key: string;
  title: string;
  visible: boolean;
  order: number;
}

interface ColumnSettingsProps {
  open: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  onSave: (columns: ColumnConfig[]) => void;
}

const ColumnSettings: React.FC<ColumnSettingsProps> = ({
  open,
  onClose,
  columns,
  onSave
}) => {
  const [localColumns, setLocalColumns] = useState<ColumnConfig[]>([]);

  // 初始化本地列配置
  useEffect(() => {
    setLocalColumns([...columns].sort((a, b) => a.order - b.order));
  }, [columns]);

  // 切换列显示状态
  const toggleColumnVisibility = (key: string) => {
    setLocalColumns(prev => 
      prev.map(col => 
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // 移动列的位置（上移或下移）
  const moveColumn = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === localColumns.length - 1)
    ) {
      return; // 边界检查
    }

    const newColumns = [...localColumns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // 交换位置
    [newColumns[index], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[index]];
    
    // 更新排序
    const updatedColumns = newColumns.map((col, idx) => ({
      ...col,
      order: idx
    }));
    
    setLocalColumns(updatedColumns);
  };

  // 全选/取消全选
  const toggleSelectAll = (selected: boolean) => {
    setLocalColumns(prev =>
      prev.map(col => ({ ...col, visible: selected }))
    );
  };

  // 保存设置
  const handleSave = () => {
    onSave(localColumns);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="column-settings-overlay">
      <div className="column-settings-drawer">
        <div className="column-settings-header">
          <h3>设置列</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="select-all-container">
          <div className="checkbox-container">
            <input 
              type="checkbox"
              checked={localColumns.every(col => col.visible)}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            <label>全选</label>
          </div>
          <div className="help-text">可通过拖动调整列的顺序</div>
        </div>
        
        <div className="column-list">
          {localColumns.map((column, index) => (
            <div key={column.key} className="column-item">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={() => toggleColumnVisibility(column.key)}
                />
                <span className="column-title">{column.title}</span>
              </div>
              <div className="column-actions">
                <button 
                  onClick={() => moveColumn(index, 'up')}
                  disabled={index === 0}
                  className={index === 0 ? 'disabled' : ''}
                >
                  ↑
                </button>
                <button 
                  onClick={() => moveColumn(index, 'down')}
                  disabled={index === localColumns.length - 1}
                  className={index === localColumns.length - 1 ? 'disabled' : ''}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="column-settings-footer">
          <button className="cancel-button" onClick={onClose}>取消</button>
          <button className="save-button" onClick={handleSave}>确定</button>
        </div>
      </div>
    </div>
  );
};

export default ColumnSettings; 