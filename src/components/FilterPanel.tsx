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
  inquirySource: string;
  inquiryPerson: string;
  headFreightStatus: string;
  mainFreightStatus: string;
  tailFreightStatus: string;
  containerInfo: string;
  cargoReadyTime: string;
  cargoNature: string;
  shippingCompany: string;
  routeType: string;
  loadingPort: string;
  dischargePort: string;
  cargoName: string;
  remarks: string;
  createTime: string;
  appointmentNumberOp: string;
  inquirySourceOp: string;
  inquiryPersonOp: string;
  headFreightStatusOp: string;
  mainFreightStatusOp: string;
  tailFreightStatusOp: string;
  containerInfoOp: string;
  cargoReadyTimeOp: string;
  cargoNatureOp: string;
  shippingCompanyOp: string;
  routeTypeOp: string;
  loadingPortOp: string;
  dischargePortOp: string;
  cargoNameOp: string;
  remarksOp: string;
  createTimeOp: string;
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
    inquirySource: '',
    inquiryPerson: '',
    headFreightStatus: '',
    mainFreightStatus: '',
    tailFreightStatus: '',
    containerInfo: '',
    cargoReadyTime: '',
    cargoNature: '',
    shippingCompany: '',
    routeType: '',
    loadingPort: '',
    dischargePort: '',
    cargoName: '',
    remarks: '',
    createTime: '',
    appointmentNumberOp: '等于',
    inquirySourceOp: '等于',
    inquiryPersonOp: '等于',
    headFreightStatusOp: '等于',
    mainFreightStatusOp: '等于',
    tailFreightStatusOp: '等于',
    containerInfoOp: '等于',
    cargoReadyTimeOp: '等于',
    cargoNatureOp: '等于',
    shippingCompanyOp: '等于',
    routeTypeOp: '等于',
    loadingPortOp: '等于',
    dischargePortOp: '等于',
    cargoNameOp: '等于',
    remarksOp: '等于',
    createTimeOp: '等于'
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
      inquirySource: '',
      inquiryPerson: '',
      headFreightStatus: '',
      mainFreightStatus: '',
      tailFreightStatus: '',
      containerInfo: '',
      cargoReadyTime: '',
      cargoNature: '',
      shippingCompany: '',
      routeType: '',
      loadingPort: '',
      dischargePort: '',
      cargoName: '',
      remarks: '',
      createTime: '',
      appointmentNumberOp: '等于',
      inquirySourceOp: '等于',
      inquiryPersonOp: '等于',
      headFreightStatusOp: '等于',
      mainFreightStatusOp: '等于',
      tailFreightStatusOp: '等于',
      containerInfoOp: '等于',
      cargoReadyTimeOp: '等于',
      cargoNatureOp: '等于',
      shippingCompanyOp: '等于',
      routeTypeOp: '等于',
      loadingPortOp: '等于',
      dischargePortOp: '等于',
      cargoNameOp: '等于',
      remarksOp: '等于',
      createTimeOp: '等于'
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
          <button type="button" className="toggle-btn left" onClick={togglePanel} aria-label="展开筛选面板">
            <span className="dropdown-icon">▼</span>
          </button>
          <input
            type="text"
            className="quick-search"
            placeholder="快捷检索:约号"
          />
          <div className="action-buttons">
            <button type="button" className="blue-btn" onClick={handleSubmit}>查询</button>
            <button type="button" className="blue-btn" onClick={handleAddClick}>新增</button>
            <button type="button" className="blue-btn" onClick={handleEditClick}>编辑</button>
            <button type="button" className="red-btn" onClick={handleDeleteClick}>删除</button>
            <button type="button" className="blue-btn" onClick={handleActivateClick}>启用</button>
            <button type="button" className="gray-btn" onClick={handleDeactivateClick}>禁用</button>
          </div>
        </div>
      ) : (
        <>
          <div className="expanded-filter-header">
            <button type="button" className="toggle-btn left" onClick={togglePanel} aria-label="收起筛选面板">
              <span className="dropdown-icon up">▲</span>
            </button>
            <div className="action-buttons">
              <button type="button" className="blue-btn" onClick={handleSubmit}>查询</button>
              <button type="button" className="blue-btn" onClick={handleAddClick}>新增</button>
              <button type="button" className="blue-btn" onClick={handleEditClick}>编辑</button>
              <button type="button" className="red-btn" onClick={handleDeleteClick}>删除</button>
              <button type="button" className="blue-btn" onClick={handleActivateClick}>启用</button>
              <button type="button" className="gray-btn" onClick={handleDeactivateClick}>禁用</button>
            </div>
          </div>

          <div className="filter-actions-bar">
            <div className="action-links-container">
              <button type="button" className="action-link" aria-label="保存修改">保存修改</button>
              <button type="button" className="action-link" aria-label="增减条件">增减条件</button>
              <button type="button" className="action-link" onClick={handleReset} aria-label="重置条件">重置条件</button>
              <button type="button" className="action-link" aria-label="另存为方案">另存为方案</button>
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
                    title="约号操作符"
                    aria-label="约号操作符"
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
                    title="约号"
                    placeholder="请输入约号"
                    aria-label="约号"
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
                    title="船公司操作符"
                    aria-label="船公司操作符"
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
                    title="船公司"
                    placeholder="请输入船公司"
                    aria-label="船公司"
                  />
                </div>
              </div>

              <div className="filter-item">
                <label>询价来源</label>
                <div className="filter-input">
                  <select
                    name="inquirySourceOp"
                    value={filters.inquirySourceOp}
                    onChange={handleOperatorChange}
                    title="询价来源操作符"
                    aria-label="询价来源操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                  </select>
                  <select
                    name="inquirySource"
                    value={filters.inquirySource}
                    onChange={handleChange}
                    title="询价来源"
                    aria-label="询价来源"
                  >
                    <option value="">全部</option>
                    <option value="内部">内部</option>
                    <option value="外部">外部</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-item">
                <label>头程报价状态</label>
                <div className="filter-input">
                  <select
                    name="headFreightStatusOp"
                    value={filters.headFreightStatusOp}
                    onChange={handleOperatorChange}
                    title="头程报价状态操作符"
                    aria-label="头程报价状态操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                  </select>
                  <select
                    name="headFreightStatus"
                    value={filters.headFreightStatus}
                    onChange={handleChange}
                    title="头程报价状态"
                    aria-label="头程报价状态"
                  >
                    <option value="">全部</option>
                    <option value="待报价">待报价</option>
                    <option value="已报价">已报价</option>
                    <option value="拒绝报价">拒绝报价</option>
                  </select>
                </div>
              </div>

              <div className="filter-item">
                <label>干线报价状态</label>
                <div className="filter-input">
                  <select
                    name="mainFreightStatusOp"
                    value={filters.mainFreightStatusOp}
                    onChange={handleOperatorChange}
                    title="干线报价状态操作符"
                    aria-label="干线报价状态操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                  </select>
                  <select
                    name="mainFreightStatus"
                    value={filters.mainFreightStatus}
                    onChange={handleChange}
                    title="干线报价状态"
                    aria-label="干线报价状态"
                  >
                    <option value="">全部</option>
                    <option value="待报价">待报价</option>
                    <option value="已报价">已报价</option>
                    <option value="拒绝报价">拒绝报价</option>
                  </select>
                </div>
              </div>

              <div className="filter-item">
                <label>尾程报价状态</label>
                <div className="filter-input">
                  <select
                    name="tailFreightStatusOp"
                    value={filters.tailFreightStatusOp}
                    onChange={handleOperatorChange}
                    title="尾程报价状态操作符"
                    aria-label="尾程报价状态操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                  </select>
                  <select
                    name="tailFreightStatus"
                    value={filters.tailFreightStatus}
                    onChange={handleChange}
                    title="尾程报价状态"
                    aria-label="尾程报价状态"
                  >
                    <option value="">全部</option>
                    <option value="待报价">待报价</option>
                    <option value="已报价">已报价</option>
                    <option value="拒绝报价">拒绝报价</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-item">
                <label>询价人</label>
                <div className="filter-input">
                  <select
                    name="inquiryPersonOp"
                    value={filters.inquiryPersonOp}
                    onChange={handleOperatorChange}
                    title="询价人操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input
                    type="text"
                    name="inquiryPerson"
                    value={filters.inquiryPerson}
                    onChange={handleChange}
                    title="询价人"
                    placeholder="请输入询价人"
                  />
                </div>
              </div>

              <div className="filter-item">
                <label>货好时间</label>
                <div className="filter-input">
                  <select
                    name="cargoReadyTimeOp"
                    value={filters.cargoReadyTimeOp}
                    onChange={handleOperatorChange}
                    title="货好时间操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input
                    type="text"
                    name="cargoReadyTime"
                    value={filters.cargoReadyTime}
                    onChange={handleChange}
                    title="货好时间"
                    placeholder="请输入货好时间"
                  />
                </div>
              </div>

              <div className="filter-item">
                <label>货盘性质</label>
                <div className="filter-input">
                  <select
                    name="cargoNatureOp"
                    value={filters.cargoNatureOp}
                    onChange={handleOperatorChange}
                    title="货盘性质操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                  </select>
                  <select
                    name="cargoNature"
                    value={filters.cargoNature}
                    onChange={handleChange}
                    title="货盘性质"
                  >
                    <option value="">全部</option>
                    <option value="询价">询价</option>
                    <option value="实单">实单</option>
                  </select>
                </div>
              </div>
            </div>



            <div className="filter-row">
              <div className="filter-item">
                <label>箱型箱量</label>
                <div className="filter-input">
                  <select
                    name="containerInfoOp"
                    value={filters.containerInfoOp}
                    onChange={handleOperatorChange}
                    title="箱型箱量操作符"
                    aria-label="箱型箱量操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input
                    type="text"
                    name="containerInfo"
                    value={filters.containerInfo}
                    onChange={handleChange}
                    title="箱型箱量"
                    placeholder="请输入箱型箱量"
                    aria-label="箱型箱量"
                  />
                </div>
              </div>

              <div className="filter-item">
                <label>直达/中转</label>
                <div className="filter-input">
                  <select
                    name="routeTypeOp"
                    value={filters.routeTypeOp}
                    onChange={handleOperatorChange}
                    title="直达/中转操作符"
                    aria-label="直达/中转操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                  </select>
                  <select
                    name="routeType"
                    value={filters.routeType}
                    onChange={handleChange}
                    title="直达/中转"
                    aria-label="直达/中转"
                  >
                    <option value="">全部</option>
                    <option value="直达">直达</option>
                    <option value="中转">中转</option>
                  </select>
                </div>
              </div>

              <div className="filter-item">
                <label>起运港</label>
                <div className="filter-input">
                  <select
                    name="loadingPortOp"
                    value={filters.loadingPortOp}
                    onChange={handleOperatorChange}
                    title="起运港操作符"
                    aria-label="起运港操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input
                    type="text"
                    name="loadingPort"
                    value={filters.loadingPort}
                    onChange={handleChange}
                    title="起运港"
                    placeholder="请输入起运港"
                    aria-label="起运港"
                  />
                </div>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-item">
                <label>卸货港</label>
                <div className="filter-input">
                  <select
                    name="dischargePortOp"
                    value={filters.dischargePortOp}
                    onChange={handleOperatorChange}
                    title="卸货港操作符"
                    aria-label="卸货港操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input
                    type="text"
                    name="dischargePort"
                    value={filters.dischargePort}
                    onChange={handleChange}
                    title="卸货港"
                    placeholder="请输入卸货港"
                    aria-label="卸货港"
                  />
                </div>
              </div>

              <div className="filter-item">
                <label>品名</label>
                <div className="filter-input">
                  <select
                    name="cargoNameOp"
                    value={filters.cargoNameOp}
                    onChange={handleOperatorChange}
                    title="品名操作符"
                    aria-label="品名操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input
                    type="text"
                    name="cargoName"
                    value={filters.cargoName}
                    onChange={handleChange}
                    title="品名"
                    placeholder="请输入品名"
                    aria-label="品名"
                  />
                </div>
              </div>

              <div className="filter-item">
                <label>创建时间</label>
                <div className="filter-input">
                  <select
                    name="createTimeOp"
                    value={filters.createTimeOp}
                    onChange={handleOperatorChange}
                    title="创建时间操作符"
                    aria-label="创建时间操作符"
                  >
                    <option value="等于">等于</option>
                    <option value="不等于">不等于</option>
                    <option value="包含">包含</option>
                    <option value="不包含">不包含</option>
                  </select>
                  <input
                    type="text"
                    name="createTime"
                    value={filters.createTime}
                    onChange={handleChange}
                    title="创建时间"
                    placeholder="请输入创建时间"
                    aria-label="创建时间"
                  />
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