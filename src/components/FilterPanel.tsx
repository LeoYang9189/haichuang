import React, { useState } from 'react';
import './FilterPanel.css';
import EditModal from './EditModal';

interface FilterPanelProps {
  onFilter: (filters: FilterCriteria) => void;
  onAddAppointment?: (appointment: any) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onAdd?: () => void;
}

export interface FilterCriteria {
  appointmentNumber: string;
  line: string;
  shippingCompany: string;
  priceNature: string;
  isNAC: string;
  isActivated: string;
  validFrom: string;
  validTo: string;
  appointmentNumberOp: string;
  lineOp: string;
  shippingCompanyOp: string;
  priceNatureOp: string;
  isNACOp: string;
  isActivatedOp: string;
  validDateOp: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  onFilter, 
  onAddAppointment, 
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onAdd
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState<FilterCriteria>({
    appointmentNumber: '',
    line: '',
    shippingCompany: '',
    priceNature: '',
    isNAC: '',
    isActivated: '',
    validFrom: '',
    validTo: '',
    appointmentNumberOp: '等于',
    lineOp: '等于',
    shippingCompanyOp: '等于',
    priceNatureOp: '等于',
    isNACOp: '等于',
    isActivatedOp: '等于',
    validDateOp: '范围'
  });
  const [appendQuery, setAppendQuery] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      appointmentNumber: '',
      line: '',
      shippingCompany: '',
      priceNature: '',
      isNAC: '',
      isActivated: '',
      validFrom: '',
      validTo: '',
      appointmentNumberOp: '等于',
      lineOp: '等于',
      shippingCompanyOp: '等于',
      priceNatureOp: '等于',
      isNACOp: '等于',
      isActivatedOp: '等于',
      validDateOp: '范围'
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
      return;
    }
    
    setIsAddModalOpen(true);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleActivateClick = () => {
    if (onActivate) {
      onActivate();
    }
  };

  const handleDeactivateClick = () => {
    if (onDeactivate) {
      onDeactivate();
    }
  };

  const handleSaveAppointment = (appointment: any) => {
    if (onAddAppointment) {
      onAddAppointment(appointment);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="filter-panel">
      {!isExpanded ? (
        <div className="collapsed-filter">
          <button className="toggle-btn left" onClick={togglePanel}>
            <span className="dropdown-icon">▼</span>
          </button>
          <input 
            type="text" 
            className="quick-search" 
            placeholder="快捷检索:约号" 
          />
          <div className="action-buttons">
            <button className="blue-btn" onClick={handleSubmit}>查询</button>
            <button className="blue-btn" onClick={handleAddClick}>新增</button>
            <button className="blue-btn" onClick={handleEditClick}>编辑</button>
            <button className="red-btn" onClick={handleDeleteClick}>删除</button>
            <button className="blue-btn" onClick={handleActivateClick}>启用</button>
            <button className="gray-btn" onClick={handleDeactivateClick}>禁用</button>
          </div>
        </div>
      ) : (
        <>
          <div className="expanded-filter-header">
            <button className="toggle-btn left" onClick={togglePanel}>
              <span className="dropdown-icon up">▲</span>
            </button>
            <div className="action-buttons">
              <button className="blue-btn" onClick={handleSubmit}>查询</button>
              <button className="blue-btn" onClick={handleAddClick}>新增</button>
              <button className="blue-btn" onClick={handleEditClick}>编辑</button>
              <button className="red-btn" onClick={handleDeleteClick}>删除</button>
              <button className="blue-btn" onClick={handleActivateClick}>启用</button>
              <button className="gray-btn" onClick={handleDeactivateClick}>禁用</button>
            </div>
          </div>

          <div className="filter-actions-bar">
            <div className="action-links-container">
              <button className="action-link">保存修改</button>
              <button className="action-link">增减条件</button>
              <button className="action-link" onClick={handleReset}>重置条件</button>
              <button className="action-link">另存为方案</button>
              <label className="append-query">
                <input 
                  type="checkbox" 
                  checked={appendQuery}
                  onChange={() => setAppendQuery(!appendQuery)}
                />
                追加查询
              </label>
            </div>
          </div>
          
          <div className="filter-container">
            <div className="filter-row">
              <div className="filter-item">
                <label>约号</label>
                <div className="filter-input">
                  <select
                    name="appointmentNumberOp"
                    value={filters.appointmentNumberOp}
                    onChange={handleOperatorChange}
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input 
                    type="text" 
                    name="appointmentNumber" 
                    value={filters.appointmentNumber} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="filter-item">
                <label>适用航线</label>
                <div className="filter-input">
                  <select
                    name="lineOp"
                    value={filters.lineOp}
                    onChange={handleOperatorChange}
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input 
                    type="text" 
                    name="line" 
                    value={filters.line} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="filter-item">
                <label>船公司</label>
                <div className="filter-input">
                  <select
                    name="shippingCompanyOp"
                    value={filters.shippingCompanyOp}
                    onChange={handleOperatorChange}
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input 
                    type="text" 
                    name="shippingCompany" 
                    value={filters.shippingCompany} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="filter-item">
                <label>约价性质</label>
                <div className="filter-input">
                  <select
                    name="priceNatureOp"
                    value={filters.priceNatureOp}
                    onChange={handleOperatorChange}
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input 
                    type="text" 
                    name="priceNature" 
                    value={filters.priceNature} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
            
            <div className="filter-row">
              <div className="filter-item">
                <label>是否NAC</label>
                <div className="filter-input">
                  <select
                    name="isNACOp"
                    value={filters.isNACOp}
                    onChange={handleOperatorChange}
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                  </select>
                  <select
                    name="isNAC"
                    value={filters.isNAC}
                    onChange={handleChange}
                  >
                    <option value="">全部</option>
                    <option value="true">是</option>
                    <option value="false">否</option>
                  </select>
                </div>
              </div>
              
              <div className="filter-item">
                <label>是否启用</label>
                <div className="filter-input">
                  <select
                    name="isActivatedOp"
                    value={filters.isActivatedOp}
                    onChange={handleOperatorChange}
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                  </select>
                  <select
                    name="isActivated"
                    value={filters.isActivated}
                    onChange={handleChange}
                  >
                    <option value="">全部</option>
                    <option value="true">启用</option>
                    <option value="false">禁用</option>
                  </select>
                </div>
              </div>
              
              <div className="filter-item">
                <label>有效期</label>
                <div className="filter-input">
                  <select
                    name="validDateOp"
                    value={filters.validDateOp}
                    onChange={handleOperatorChange}
                  >
                    <option value="范围">范围</option>
                  </select>
                  <div className="date-range-inputs">
                    <input 
                      type="date" 
                      name="validFrom" 
                      value={filters.validFrom} 
                      onChange={handleChange}
                      placeholder="开始日期" 
                    />
                    <span className="date-separator">至</span>
                    <input 
                      type="date" 
                      name="validTo" 
                      value={filters.validTo} 
                      onChange={handleChange}
                      placeholder="结束日期" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      <EditModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        appointment={null}
        onSave={handleSaveAppointment}
        isAdd={true}
      />
    </div>
  );
};

export default FilterPanel; 