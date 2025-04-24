import React, { useState, useEffect } from 'react';
import './AppointmentTable.css';
import EditModal from './EditModal';
import FilterPanel, { FilterCriteria } from './FilterPanel';
import Toast from './Toast';
import ColumnSettings, { ColumnConfig } from './ColumnSettings';
import ConfirmModal from './ConfirmModal';
import ModalInstructions from './ModalInstructions';

interface Appointment {
  id: string;
  line: string;
  isActivated: boolean;
  isSelected?: boolean;
  shippingCompany: string;
  priceNature: string;
  isNAC: boolean | null;
  nac: string;
  applicableProducts: string | null;
  customProduct: string;
  mqc: string;
  cabinProtection: string | null;
  cabinProtectionValue: string;
  cabinProtectionUnit: string;
  validFrom: string; // 有效期开始日期
  validTo: string;   // 有效期结束日期
}

// 船公司缩写与中文名称的映射
const shippingCompanyNames: {[key: string]: string} = {
  'MSC': '地中海',
  'COSCO': '中远海运',
  'OOCL': '东方海外',
  'CMA': '达飞轮船',
  'ONE': '海洋网联',
  'HAPAG': '赫伯罗特',
  'ZIM': '以星航运',
  'MAERSK': '马士基',
  'EVERGREEN': '长荣海运',
  'YANGMING': '阳明海运'
};

// 格式化船公司显示
const formatShippingCompany = (code: string): string => {
  return `${code} | ${shippingCompanyNames[code] || code}`;
};

export interface AppointmentTableProps {
  debug?: boolean;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({debug = false}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([
    { id: '888888', line: '', isActivated: true, shippingCompany: 'MSC', priceNature: '自有约价', isNAC: false, nac: '', applicableProducts: '化工品', customProduct: '', mqc: '140', cabinProtection: '有', cabinProtectionValue: '200', cabinProtectionUnit: 'TEU/月', validFrom: '2024-01-01', validTo: '2024-12-31' },
    { id: '20240510', line: '', isActivated: true, shippingCompany: 'COSCO', priceNature: '客户约价', isNAC: true, nac: 'NAC001', applicableProducts: '危险品', customProduct: '', mqc: '220', cabinProtection: '无', cabinProtectionValue: '', cabinProtectionUnit: '', validFrom: '2024-05-10', validTo: '2025-05-09' },
    { id: 'WT2383333', line: '', isActivated: true, isSelected: true, shippingCompany: 'OOCL', priceNature: '海外代理约价', isNAC: false, nac: '', applicableProducts: '特种柜', customProduct: '', mqc: '140', cabinProtection: '有', cabinProtectionValue: '50', cabinProtectionUnit: 'TEU/周', validFrom: '2024-04-01', validTo: '2024-10-31' },
    { id: '4', line: '新加坡', isActivated: true, shippingCompany: 'CMA', priceNature: '无约价', isNAC: true, nac: 'NAC002', applicableProducts: '冷冻货', customProduct: '', mqc: '120', cabinProtection: '无', cabinProtectionValue: '', cabinProtectionUnit: '', validFrom: '2024-03-15', validTo: '2025-03-14' },
    { id: 'MJ1', line: '美西', isActivated: true, shippingCompany: 'ONE', priceNature: '同行约价', isNAC: false, nac: '', applicableProducts: 'FAK', customProduct: '', mqc: '240', cabinProtection: '有', cabinProtectionValue: '100', cabinProtectionUnit: 'TEU/水', validFrom: '2024-02-15', validTo: '2024-08-14' },
    { id: '1', line: '中美洲', isActivated: false, shippingCompany: 'HAPAG', priceNature: 'AFC约价', isNAC: true, nac: 'NAC003', applicableProducts: '纺织品', customProduct: '', mqc: '145', cabinProtection: '无', cabinProtectionValue: '', cabinProtectionUnit: '', validFrom: '2024-06-01', validTo: '2025-05-31' },
    { id: '100', line: '', isActivated: true, shippingCompany: 'ZIM', priceNature: 'AFG约价', isNAC: false, nac: '', applicableProducts: '其他', customProduct: '电子产品', mqc: '240', cabinProtection: '有', cabinProtectionValue: '300', cabinProtectionUnit: 'TEU/年', validFrom: '2024-01-15', validTo: '2024-12-31' },
    { id: '001', line: '新加坡', isActivated: true, shippingCompany: 'MSC', priceNature: '自有约价', isNAC: true, nac: 'NAC004', applicableProducts: '其他', customProduct: '塑料制品', mqc: '120', cabinProtection: '无', cabinProtectionValue: '', cabinProtectionUnit: '', validFrom: '2024-04-15', validTo: '2025-04-14' },
    { id: '298822264', line: '加勒比', isActivated: true, shippingCompany: 'MAERSK', priceNature: '客户约价', isNAC: null, nac: '', applicableProducts: null, customProduct: '', mqc: '340', cabinProtection: null, cabinProtectionValue: '', cabinProtectionUnit: '', validFrom: '2024-03-01', validTo: '2024-08-31' },
    { id: '12345', line: '美西', isActivated: false, shippingCompany: 'EVERGREEN', priceNature: '海外代理约价', isNAC: true, nac: 'NAC005', applicableProducts: '化工品', customProduct: '', mqc: '140', cabinProtection: '无', cabinProtectionValue: '', cabinProtectionUnit: '', validFrom: '2024-05-01', validTo: '2024-10-31' },
    { id: '1767', line: '', isActivated: true, shippingCompany: 'YANGMING', priceNature: '无约价', isNAC: null, nac: '', applicableProducts: null, customProduct: '', mqc: '220', cabinProtection: '有', cabinProtectionValue: '150', cabinProtectionUnit: 'TEU/合约期', validFrom: '2024-02-01', validTo: '2025-01-31' },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterCriteria | null>(null);
  
  // Toast相关状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedAppointments, setPaginatedAppointments] = useState<Appointment[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [goToPage, setGoToPage] = useState('');
  
  // 列设置相关状态
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([
    { key: 'id', title: '船公司约号', visible: true, order: 0 },
    { key: 'line', title: '适用航线', visible: true, order: 1 },
    { key: 'shippingCompany', title: '船公司', visible: true, order: 2 },
    { key: 'priceNature', title: '约价性质', visible: true, order: 3 },
    { key: 'isNAC', title: '是否NAC', visible: true, order: 4 },
    { key: 'nac', title: 'NAC', visible: true, order: 5 },
    { key: 'applicableProducts', title: '适用品名', visible: true, order: 6 },
    { key: 'mqc', title: 'MQC', visible: true, order: 7 },
    { key: 'cabinProtection', title: '舱保', visible: true, order: 8 },
    { key: 'validPeriod', title: '有效期', visible: true, order: 9 },
    { key: 'isActivated', title: '是否启用', visible: true, order: 10 },
  ]);
  
  // 添加确认删除模态框状态
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // 添加确认模态框配置状态
  interface ConfirmModalConfig {
    title: string;
    content: string;
    onConfirm: () => void;
    type: 'delete' | 'activate' | 'deactivate';
  }

  const [confirmModalConfig, setConfirmModalConfig] = useState<ConfirmModalConfig>({
    title: '',
    content: '',
    onConfirm: () => {},
    type: 'delete'
  });
  
  // 组件初始化时，尝试从localStorage读取列配置
  useEffect(() => {
    const savedColumnConfigs = localStorage.getItem('appointmentTableColumns');
    if (savedColumnConfigs) {
      try {
        const parsedConfigs = JSON.parse(savedColumnConfigs);
        setColumnConfigs(parsedConfigs);
      } catch (e) {
        console.error('Failed to parse saved column configs', e);
      }
    }
  }, []);

  // 处理列配置变更
  const handleColumnConfigChange = (newConfigs: ColumnConfig[]) => {
    setColumnConfigs(newConfigs);
    // 保存到localStorage
    localStorage.setItem('appointmentTableColumns', JSON.stringify(newConfigs));
  };

  // 获取可见的排序后的列配置
  const getVisibleColumns = () => {
    return [...columnConfigs]
      .sort((a, b) => a.order - b.order)
      .filter(col => col.visible);
  };

  // 在组件挂载和 allAppointments 更新时应用筛选
  useEffect(() => {
    if (currentFilters) {
      handleFilter(currentFilters);
    } else {
      setAppointments(allAppointments);
    }
  }, [allAppointments]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      // 如果搜索词为空，恢复筛选结果或所有记录
      if (currentFilters) {
        handleFilter(currentFilters);
      } else {
        setAppointments(allAppointments);
      }
      return;
    }

    // 根据搜索词筛选
    const filtered = allAppointments.filter(appointment => 
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.line.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.shippingCompany.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setAppointments(filtered);
  };

  const handleFilter = (filters: FilterCriteria) => {
    setCurrentFilters(filters);
    
    const filtered = allAppointments.filter(appointment => {
      // 根据操作符和值进行筛选
      // 约号筛选
      if (filters.appointmentNumber) {
        const val = appointment.id.toLowerCase();
        const filterVal = filters.appointmentNumber.toLowerCase();
        
        switch (filters.appointmentNumberOp) {
          case '等于':
            if (val !== filterVal) return false;
            break;
          case '不等于':
            if (val === filterVal) return false;
            break;
          case '包含':
            if (!val.includes(filterVal)) return false;
            break;
          case '不包含':
            if (val.includes(filterVal)) return false;
            break;
        }
      }
      
      // 适用航线筛选
      if (filters.line) {
        const val = appointment.line.toLowerCase();
        const filterVal = filters.line.toLowerCase();
        
        switch (filters.lineOp) {
          case '等于':
            if (val !== filterVal) return false;
            break;
          case '不等于':
            if (val === filterVal) return false;
            break;
          case '包含':
            if (!val.includes(filterVal)) return false;
            break;
          case '不包含':
            if (val.includes(filterVal)) return false;
            break;
        }
      }
      
      // 船公司筛选
      if (filters.shippingCompany) {
        const val = appointment.shippingCompany.toLowerCase();
        const filterVal = filters.shippingCompany.toLowerCase();
        
        switch (filters.shippingCompanyOp) {
          case '等于':
            if (val !== filterVal) return false;
            break;
          case '不等于':
            if (val === filterVal) return false;
            break;
          case '包含':
            if (!val.includes(filterVal)) return false;
            break;
          case '不包含':
            if (val.includes(filterVal)) return false;
            break;
        }
      }
      
      // 约价性质筛选
      if (filters.priceNature) {
        const val = appointment.priceNature.toLowerCase();
        const filterVal = filters.priceNature.toLowerCase();
        
        switch (filters.priceNatureOp) {
          case '等于':
            if (val !== filterVal) return false;
            break;
          case '不等于':
            if (val === filterVal) return false;
            break;
          case '包含':
            if (!val.includes(filterVal)) return false;
            break;
          case '不包含':
            if (val.includes(filterVal)) return false;
            break;
        }
      }
      
      // 是否NAC筛选
      if (filters.isNAC) {
        const isNacValue = filters.isNAC === 'true' ? true : filters.isNAC === 'false' ? false : null;
        
        switch (filters.isNACOp) {
          case '等于':
            if (appointment.isNAC !== isNacValue) return false;
            break;
          case '不等于':
            if (appointment.isNAC === isNacValue) return false;
            break;
        }
      }
      
      // 是否启用筛选
      if (filters.isActivated) {
        const isActivatedValue = filters.isActivated === 'true';
        
        switch (filters.isActivatedOp) {
          case '等于':
            if (appointment.isActivated !== isActivatedValue) return false;
            break;
          case '不等于':
            if (appointment.isActivated === isActivatedValue) return false;
            break;
        }
      }
      
      // 有效期筛选
      if (filters.validFrom || filters.validTo) {
        // 将字符串日期转换为 Date 对象进行比较
        const appValidFrom = appointment.validFrom ? new Date(appointment.validFrom) : null;
        const appValidTo = appointment.validTo ? new Date(appointment.validTo) : null;
        const filterValidFrom = filters.validFrom ? new Date(filters.validFrom) : null;
        const filterValidTo = filters.validTo ? new Date(filters.validTo) : null;
        
        // 使用范围筛选
        if (filters.validDateOp === '范围') {
          if (filterValidFrom && filterValidTo) {
            // 筛选条件有开始和结束日期，检查是否有重叠
            if (!appValidFrom || !appValidTo) return false;
            if (appValidTo < filterValidFrom || appValidFrom > filterValidTo) return false;
          } else if (filterValidFrom) {
            // 只有开始日期，查找在此日期之后结束的约号
            if (!appValidTo) return false;
            if (appValidTo < filterValidFrom) return false;
          } else if (filterValidTo) {
            // 只有结束日期，查找在此日期之前开始的约号
            if (!appValidFrom) return false;
            if (appValidFrom > filterValidTo) return false;
          }
        }
      }
      
      return true;
    });
    
    setAppointments(filtered);
  };

  const handleAdd = () => {
    setIsAddMode(true);
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = () => {
    const selected = appointments.filter(a => a.isSelected);
    if (selected.length === 1) {
      setIsAddMode(false);
      setSelectedAppointment(selected[0]);
      setIsModalOpen(true);
    } else if (selected.length > 1) {
      setToastMessage('请只选择一个约号进行编辑');
      setToastType('error');
      setShowToast(true);
    } else {
      setToastMessage('请先选择一个约号');
      setToastType('error');
      setShowToast(true);
    }
  };
  
  const handleDeleteClick = () => {
    const selectedCount = appointments.filter(a => a.isSelected).length;
    if (selectedCount > 0) {
      // 显示确认模态框
      setConfirmModalConfig({
        title: '确认删除',
        content: `您确定要删除选中的${selectedCount}个约号吗？此操作无法撤销。`,
        onConfirm: handleDelete,
        type: 'delete'
      });
      setIsConfirmModalOpen(true);
    } else {
      setToastMessage('请至少选择一个约号');
      setToastType('error');
      setShowToast(true);
    }
  };
  
  const handleDelete = () => {
    const selectedAppointments = appointments.filter(a => a.isSelected);
    if (selectedAppointments.length > 0) {
      const selectedIds = new Set(selectedAppointments.map(a => a.id));
      
      // 从显示列表中删除
      const newAppointments = appointments.filter(a => !a.isSelected);
      setAppointments(newAppointments);
      
      // 从完整数据列表中删除
      const newAllAppointments = allAppointments.filter(a => !selectedIds.has(a.id));
      setAllAppointments(newAllAppointments);
      
      // 显示删除成功提示
      setToastMessage(`成功删除${selectedAppointments.length}个约号`);
      setToastType('success');
      setShowToast(true);
      
      // 关闭确认模态框
      setIsConfirmModalOpen(false);
    }
  };
  
  // 添加以下函数来检查选中的记录的启用状态
  const checkSelectedStatus = () => {
    const selectedAppointments = appointments.filter(a => a.isSelected);
    
    // 如果没有选中任何记录，返回空对象
    if (selectedAppointments.length === 0) {
      return { count: 0, allActivated: false, allDeactivated: false };
    }
    
    // 检查是否所有选中的记录都是启用状态
    const allActivated = selectedAppointments.every(a => a.isActivated);
    
    // 检查是否所有选中的记录都是禁用状态
    const allDeactivated = selectedAppointments.every(a => !a.isActivated);
    
    return {
      count: selectedAppointments.length,
      allActivated,
      allDeactivated
    };
  };

  // 修改激活按钮的处理函数
  const handleActivateClick = () => {
    const status = checkSelectedStatus();
    
    if (status.count === 0) {
      setToastMessage('请选择至少一个约号');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    if (!status.allDeactivated) {
      setToastMessage('只有当所有选中的约号都处于禁用状态时，才能进行激活操作');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    // 显示确认模态框
    setConfirmModalConfig({
      title: '确认激活',
      content: '激活后用户将可以在订单详情页面选择此约号，确认启用？',
      onConfirm: handleActivate,
      type: 'activate'
    });
    setIsConfirmModalOpen(true);
  };

  // 修改禁用按钮的处理函数
  const handleDeactivateClick = () => {
    const status = checkSelectedStatus();
    
    if (status.count === 0) {
      setToastMessage('请选择至少一个约号');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    if (!status.allActivated) {
      setToastMessage('只有当所有选中的约号都处于启用状态时，才能进行禁用操作');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    // 显示确认模态框
    setConfirmModalConfig({
      title: '确认禁用',
      content: '禁用之后，该约号无法在订单详情中被选择，确定禁用？',
      onConfirm: handleDeactivate,
      type: 'deactivate'
    });
    setIsConfirmModalOpen(true);
  };

  // 修改handleActivate函数
  const handleActivate = () => {
    const selectedIds = new Set(
      appointments.filter(a => a.isSelected).map(a => a.id)
    );
    
    // 更新显示列表
    const newAppointments = appointments.map(appointment => {
      if (appointment.isSelected) {
        return { ...appointment, isActivated: true };
      }
      return appointment;
    });
    setAppointments(newAppointments);
    
    // 更新完整数据列表
    const newAllAppointments = allAppointments.map(appointment => {
      if (selectedIds.has(appointment.id)) {
        return { ...appointment, isActivated: true };
      }
      return appointment;
    });
    setAllAppointments(newAllAppointments);
    
    // 关闭确认模态框
    setIsConfirmModalOpen(false);
    
    // 显示成功提示
    setToastMessage('启用成功');
    setToastType('success');
    setShowToast(true);
  };

  // 修改handleDeactivate函数
  const handleDeactivate = () => {
    const selectedIds = new Set(
      appointments.filter(a => a.isSelected).map(a => a.id)
    );
    
    // 更新显示列表
    const newAppointments = appointments.map(appointment => {
      if (appointment.isSelected) {
        return { ...appointment, isActivated: false };
      }
      return appointment;
    });
    setAppointments(newAppointments);
    
    // 更新完整数据列表
    const newAllAppointments = allAppointments.map(appointment => {
      if (selectedIds.has(appointment.id)) {
        return { ...appointment, isActivated: false };
      }
      return appointment;
    });
    setAllAppointments(newAllAppointments);
    
    // 关闭确认模态框
    setIsConfirmModalOpen(false);
    
    // 显示成功提示
    setToastMessage('禁用成功');
    setToastType('success');
    setShowToast(true);
  };

  // 向控制台写入调试信息
  const logDebug = (message: string) => {
    if (debug) {
      console.log(`[DebugInfo] ${message}`);
    }
  };

  const toggleSelection = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    logDebug(`尝试切换第${index}行的选择状态`);
    
    const newAppointments = [...appointments];
    const actualIndex = (currentPage - 1) * pageSize + index;
    
    if (actualIndex >= 0 && actualIndex < newAppointments.length) {
      // 直接切换选中状态
      const newStatus = !newAppointments[actualIndex].isSelected;
      newAppointments[actualIndex].isSelected = newStatus;
      
      // 获取要切换的约号ID
      const appointmentId = newAppointments[actualIndex].id;
      
      logDebug(`约号 ${appointmentId} 的选中状态将变为: ${newStatus}`);
      
      // 更新显示列表
      setAppointments(newAppointments);
      
      // 更新完整数据列表中的对应项
      const newAllAppointments = allAppointments.map(a => 
        a.id === appointmentId ? {...a, isSelected: newStatus} : a
      );
      
      setAllAppointments(newAllAppointments);
    }
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    if (isAddMode) {
      // 添加新约号到完整数据列表
      const newAppointment = { ...appointment, isSelected: false };
      const newAllAppointments = [...allAppointments, newAppointment];
      setAllAppointments(newAllAppointments);
      
      // 如果当前应用了筛选，检查新数据是否符合筛选条件
      if (currentFilters) {
        handleFilter(currentFilters);
      } else {
        setAppointments([...appointments, newAppointment]);
      }

      // 显示新增成功Toast
      setToastMessage('新增成功');
      setToastType('success');
      setShowToast(true);
    } else {
      // 更新现有约号
      const updatedAppointment = { ...appointment, isSelected: true };
      
      // 更新显示列表
      const newAppointments = appointments.map(a => 
        a.isSelected ? updatedAppointment : a
      );
      setAppointments(newAppointments);
      
      // 更新完整数据列表
      const newAllAppointments = allAppointments.map(a => 
        a.id === updatedAppointment.id ? updatedAppointment : a
      );
      setAllAppointments(newAllAppointments);

      // 显示更新成功Toast
      setToastMessage('更新成功');
      setToastType('success');
      setShowToast(true);
    }
  };

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    console.log(`全选状态切换为: ${isChecked}`);
    
    // 获取当前页的约号IDs
    const currentPageIds = paginatedAppointments.map(a => a.id);
    
    // 更新appointments中当前页约号的选中状态
    const newAppointments = appointments.map(a => {
      if (currentPageIds.includes(a.id)) {
        return { ...a, isSelected: isChecked };
      }
      return a;
    });
    
    // 更新allAppointments中当前页约号的选中状态
    const newAllAppointments = allAppointments.map(a => {
      if (currentPageIds.includes(a.id)) {
        return { ...a, isSelected: isChecked };
      }
      return a;
    });
    
    setAppointments(newAppointments);
    setAllAppointments(newAllAppointments);
  };

  // 组件初始化时设置 appointments 为 allAppointments
  useEffect(() => {
    setAppointments(allAppointments);
  }, []);

  // 计算总页数并更新分页数据
  useEffect(() => {
    const total = Math.ceil(appointments.length / pageSize);
    setTotalPages(total || 1);
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedAppointments(appointments.slice(startIndex, endIndex));
    
    // 如果当前页大于总页数，则重置为第一页
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
  }, [appointments, currentPage, pageSize]);

  // 处理页码变化
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 处理每页显示数量变化
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理跳转到指定页
  const handleGoToPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoToPage(e.target.value);
  };

  const handleGoToPageSubmit = () => {
    const page = parseInt(goToPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setGoToPage('');
  };

  // 计算显示哪些页码按钮
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5; // 最多显示的页码数
    let startPage = Math.max(1, currentPage - Math.floor(showMax / 2));
    let endPage = Math.min(totalPages, startPage + showMax - 1);
    
    if (endPage - startPage + 1 < showMax) {
      startPage = Math.max(1, endPage - showMax + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="appointment-container">
      {showToast && (
        <Toast 
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      
      <FilterPanel 
        onFilter={handleFilter} 
        onAddAppointment={handleSaveAppointment}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onActivate={handleActivateClick}
        onDeactivate={handleDeactivateClick}
        onAdd={handleAdd}
      />
      
      <div className="appointment-table">
        {/* 列设置按钮 */}
        <div className="table-header-actions">
          <button 
            className="column-settings-button"
            onClick={() => setShowColumnSettings(true)}
          >
            设置列
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th className="checkbox-column">
                <input 
                  type="checkbox" 
                  onChange={handleToggleSelectAll}
                />
              </th>
              {getVisibleColumns().map(column => (
                <th key={column.key} className={`col-${column.key}`}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedAppointments.map((appointment, index) => (
              <tr 
                key={appointment.id} 
                className={appointment.isSelected ? 'selected-row' : ''}
              >
                <td className="checkbox-column">
                  <input 
                    type="checkbox" 
                    checked={!!appointment.isSelected}
                    onChange={(e) => toggleSelection(index, e.nativeEvent as unknown as React.MouseEvent)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                {getVisibleColumns().map(column => (
                  <td 
                    key={column.key}
                    className={`col-${column.key}`}
                    onClick={() => toggleSelection(index)}
                  >
                    {renderCellContent(appointment, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 分页器和数量统计 */}
        <div className="pagination-container">
          <div className="pagination-info">
            共 {appointments.length} 条记录，每页
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            条，共 {totalPages} 页
          </div>
          
          <div className="pagination">
            <button 
              className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              首页
            </button>
            <button 
              className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            
            {getPageNumbers().map(page => (
              <button 
                key={page}
                className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
            <button 
              className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              末页
            </button>
            
            <div style={{ marginLeft: '10px' }}>
              前往
              <input 
                type="text" 
                className="pagination-input" 
                value={goToPage} 
                onChange={handleGoToPageChange}
              />
              页
              <button className="pagination-go" onClick={handleGoToPageSubmit}>
                确定
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 功能说明区域 */}
      <div className="feature-description-container">
        <h3 className="feature-description-heading">以下为功能说明，请勿在最终页面中呈现</h3>
        <ol className="feature-description-list">
          <li>此需求为新增菜单页面：船公司约号管理，归属于【运价】的一级菜单下。并根据这里维护的数据，为订舱增加字段自动同步规则</li>
          <li>在以下页面增加规则：海出--【订舱预审】【海运订舱】 订舱页签的字段【船公司约号】，控件改为支持模糊匹配选择的下拉框。用户可以输入2个以上字符，触发匹配，可以点击选择对应约号，选择约号之后，根据数据维护，自动在 基本页签的 约价性质 中自动跳对应的 内容</li>
          <li>如果匹配不上，用户依然可以强制输入，只是无法自动跳约价性质了</li>
          <li>页面布局说明：请使用标配的多条件筛选控件，默认的字段和上方原型保持一致。使用标准的AG GRID表格控件，支持自定义设置列功能，默认展示的列表字段和顺序，请参考上方原型展示。</li>
          <li>约号的有效期字段为非必填，表格中以"开始日期 至 结束日期"的形式显示，仅填写开始日期时显示为"开始日期 起"，仅填写结束日期时显示为"至 结束日期"。筛选时使用"范围"操作符进行日期范围查找。</li>
          <li>对于按钮功能的说明：
            <ul className="feature-sub-list">
              <li><strong>新增</strong>：点击拉起新增弹窗，功能说明请点击后查看</li>
              <li><strong>编辑</strong>：只有在勾选一条约号记录的时候，可点击，点击拉起编辑弹窗，功能说明请点击后查看</li>
              <li><strong>删除</strong>：点击后跳二次确认弹窗，文案点一下看，确认后删除约号，确定后跳toast，提示删除成功</li>
              <li><strong>启用</strong>：只有当选中的记录"是否启用"状态都是"否"的时候，启用按钮才可以被点击。点击之后弹窗提示："激活后用户将可以在订单详情页面选择此约号，确认启用？"确定之后toast提示"启用成功"</li>
              <li><strong>禁用</strong>：反之，只有都是启用状态才能点击禁用按钮，弹窗提示"禁用之后，该约号无法在订单详情中被选择，确定禁用？"确定之后toast提示"禁用成功"</li>
            </ul>
          </li>
          <li><strong>保存校验</strong>：点击保存时候，要校验必填项是否填写，未填写，无法保存，直接在该字段外框线变为红色，下方显示"必填"。校验通过，跳 toast，提示"新增成功"或"更新成功"</li>
        </ol>
      </div>

      <EditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onSave={handleSaveAppointment}
        isAdd={isAddMode}
      />

      {/* 编辑/新增弹窗说明 */}
      <ModalInstructions 
        isOpen={isModalOpen}
        title="以下为功能说明，请勿在最终页面中呈现"
      />

      <ColumnSettings
        open={showColumnSettings}
        onClose={() => setShowColumnSettings(false)}
        columns={columnConfigs}
        onSave={handleColumnConfigChange}
      />

      {/* 确认删除模态框 */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={confirmModalConfig.title}
        content={confirmModalConfig.content}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );

  // 辅助函数: 根据列键名渲染单元格内容
  function renderCellContent(appointment: Appointment, columnKey: string) {
    switch (columnKey) {
      case 'id':
        return appointment.id;
      case 'line':
        return appointment.line;
      case 'shippingCompany':
        return formatShippingCompany(appointment.shippingCompany);
      case 'priceNature':
        return appointment.priceNature;
      case 'isNAC':
        return appointment.isNAC === null ? '' : appointment.isNAC ? '是' : '否';
      case 'nac':
        return appointment.isNAC ? appointment.nac : '';
      case 'applicableProducts':
        return appointment.applicableProducts === null 
          ? '' 
          : appointment.applicableProducts === '其他' 
            ? `其他 (${appointment.customProduct})` 
            : appointment.applicableProducts;
      case 'mqc':
        return appointment.mqc;
      case 'cabinProtection':
        return appointment.cabinProtection === null
          ? ''
          : appointment.cabinProtection === '有' && appointment.cabinProtectionValue && appointment.cabinProtectionUnit
            ? `有 (${appointment.cabinProtectionValue} ${appointment.cabinProtectionUnit})`
            : appointment.cabinProtection;
      case 'validPeriod':
        if (appointment.validFrom && appointment.validTo) {
          return `${appointment.validFrom} 至 ${appointment.validTo}`;
        } else if (appointment.validFrom) {
          return `${appointment.validFrom} 起`;
        } else if (appointment.validTo) {
          return `至 ${appointment.validTo}`;
        } else {
          return '';
        }
      case 'isActivated':
        return appointment.isActivated ? '是' : '否';
      default:
        return '';
    }
  }
};

export default AppointmentTable; 