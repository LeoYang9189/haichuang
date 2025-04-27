import React, { useState, useEffect } from 'react';
import './AppointmentTable.css';
import EditModal from './EditModal';
import FilterPanel, { FilterCriteria } from './FilterPanel';
import Toast from './Toast';
import ColumnSettings, { ColumnConfig } from './ColumnSettings';
import ConfirmModal from './ConfirmModal';
import ModalInstructions from './ModalInstructions';

interface Appointment {
  id: string; // 询价编号，R开头带一串数字
  isSelected?: boolean;
  inquirySource: string; // 询价来源：内部、外部
  inquiryPerson: string; // 询价人
  headFreightStatus: string; // 头程报价状态：待报价、已报价、拒绝报价
  mainFreightStatus: string; // 干线报价状态：待报价、已报价、拒绝报价
  tailFreightStatus: string; // 尾程报价状态：待报价、已报价、拒绝报价
  containerInfo: string; // 箱型箱量，如 1*20GP+2*40HC
  cargoReadyTime: string; // 货好时间：具体日期或 1周内、2周内、1个月内、暂不确定
  cargoNature: string; // 货盘性质：实单、询价
  shippingCompany: string; // 船公司
  routeType: string; // 直达/中转
  loadingPort: string; // 起运港，如 CNSHA | Shanghai
  dischargePort: string; // 卸货港，如 USLAX | Los Angels
  cargoName: string; // 品名
  remarks: string; // 备注
  createTime: string; // 创建时间，精确到时分秒
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
    { id: 'R20240001', isSelected: false, inquirySource: '内部', inquiryPerson: '张三', headFreightStatus: '待报价', mainFreightStatus: '待报价', tailFreightStatus: '待报价', containerInfo: '1*20GP+2*40HC', cargoReadyTime: '1周内', cargoNature: '询价', shippingCompany: 'MSC', routeType: '直达', loadingPort: 'CNSHA | Shanghai', dischargePort: 'USLAX | Los Angels', cargoName: '电子产品', remarks: '优先考虑直达航线', createTime: '2024-05-10 08:30:15' },
    { id: 'R20240002', isSelected: false, inquirySource: '内部', inquiryPerson: '李四', headFreightStatus: '已报价', mainFreightStatus: '已报价', tailFreightStatus: '待报价', containerInfo: '3*40HC', cargoReadyTime: '2周内', cargoNature: '实单', shippingCompany: 'COSCO', routeType: '中转', loadingPort: 'CNTAO | Qingdao', dischargePort: 'USNYC | New York', cargoName: '机械设备', remarks: '需要温控', createTime: '2024-05-10 09:45:22' },
    { id: 'R20240003', isSelected: true, inquirySource: '内部', inquiryPerson: '王五', headFreightStatus: '已报价', mainFreightStatus: '已报价', tailFreightStatus: '已报价', containerInfo: '2*20GP', cargoReadyTime: '2024-06-15', cargoNature: '询价', shippingCompany: 'OOCL', routeType: '直达', loadingPort: 'CNNGB | Ningbo', dischargePort: 'DEHAM | Hamburg', cargoName: '服装', remarks: '', createTime: '2024-05-10 10:15:30' },
    { id: 'R20240004', isSelected: false, inquirySource: '内部', inquiryPerson: '赵六', headFreightStatus: '拒绝报价', mainFreightStatus: '待报价', tailFreightStatus: '待报价', containerInfo: '1*40HC+1*40HQ', cargoReadyTime: '1个月内', cargoNature: '实单', shippingCompany: 'CMA', routeType: '中转', loadingPort: 'CNXMN | Xiamen', dischargePort: 'GBFXT | Felixstowe', cargoName: '家具', remarks: '客户要求准班期', createTime: '2024-05-10 11:20:45' },
    { id: 'R20240005', isSelected: false, inquirySource: '内部', inquiryPerson: '钱七', headFreightStatus: '待报价', mainFreightStatus: '拒绝报价', tailFreightStatus: '待报价', containerInfo: '5*40GP', cargoReadyTime: '暂不确定', cargoNature: '询价', shippingCompany: 'ONE', routeType: '直达', loadingPort: 'CNDLC | Dalian', dischargePort: 'SGSIN | Singapore', cargoName: '化工品', remarks: '危险品6.1类', createTime: '2024-05-10 13:05:10' },
    { id: 'R20240006', isSelected: false, inquirySource: '内部', inquiryPerson: '孙八', headFreightStatus: '待报价', mainFreightStatus: '待报价', tailFreightStatus: '拒绝报价', containerInfo: '2*20GP+1*40HC', cargoReadyTime: '2024-07-10', cargoNature: '实单', shippingCompany: 'HAPAG', routeType: '中转', loadingPort: 'CNCAN | Guangzhou', dischargePort: 'NLRTM | Rotterdam', cargoName: '玩具', remarks: '需要提供装箱方案', createTime: '2024-05-10 14:30:25' },
    { id: 'R20240007', isSelected: false, inquirySource: '内部', inquiryPerson: '周九', headFreightStatus: '已报价', mainFreightStatus: '已报价', tailFreightStatus: '已报价', containerInfo: '4*40HQ', cargoReadyTime: '2周内', cargoNature: '询价', shippingCompany: 'ZIM', routeType: '直达', loadingPort: 'CNSZX | Shenzhen', dischargePort: 'AEDXB | Dubai', cargoName: '电器', remarks: '', createTime: '2024-05-10 15:45:50' },
    { id: 'R20240008', isSelected: false, inquirySource: '内部', inquiryPerson: '吴十', headFreightStatus: '待报价', mainFreightStatus: '待报价', tailFreightStatus: '待报价', containerInfo: '1*20GP', cargoReadyTime: '1周内', cargoNature: '实单', shippingCompany: 'MSC', routeType: '中转', loadingPort: 'CNQIN | Qinhuangdao', dischargePort: 'JPTYO | Tokyo', cargoName: '食品', remarks: '需要冷藏', createTime: '2024-05-10 16:20:35' },
    { id: 'R20240009', isSelected: false, inquirySource: '内部', inquiryPerson: '郑十一', headFreightStatus: '已报价', mainFreightStatus: '待报价', tailFreightStatus: '待报价', containerInfo: '3*40GP+2*20GP', cargoReadyTime: '2024-08-01', cargoNature: '询价', shippingCompany: 'MAERSK', routeType: '直达', loadingPort: 'CNTSN | Tianjin', dischargePort: 'KRPUS | Busan', cargoName: '汽车配件', remarks: '高价值货物', createTime: '2024-05-11 09:10:15' },
    { id: 'R20240010', isSelected: false, inquirySource: '内部', inquiryPerson: '王十二', headFreightStatus: '待报价', mainFreightStatus: '已报价', tailFreightStatus: '已报价', containerInfo: '2*40HC', cargoReadyTime: '暂不确定', cargoNature: '实单', shippingCompany: 'EVERGREEN', routeType: '中转', loadingPort: 'CNLYG | Lianyungang', dischargePort: 'MYPKG | Port Klang', cargoName: '塑料制品', remarks: '需要提供报关资料', createTime: '2024-05-11 10:25:40' },
    { id: 'R20240011', isSelected: false, inquirySource: '内部', inquiryPerson: '李十三', headFreightStatus: '拒绝报价', mainFreightStatus: '拒绝报价', tailFreightStatus: '拒绝报价', containerInfo: '1*45HC', cargoReadyTime: '1个月内', cargoNature: '询价', shippingCompany: 'YANGMING', routeType: '直达', loadingPort: 'CNWEH | Weihai', dischargePort: 'VNSGN | Ho Chi Minh', cargoName: '纺织品', remarks: '客户要求低价', createTime: '2024-05-11 11:30:55' },
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
    { key: 'id', title: '询价编号', visible: true, order: 0 },
    { key: 'inquirySource', title: '询价来源', visible: true, order: 1 },
    { key: 'inquiryPerson', title: '询价人', visible: true, order: 2 },
    { key: 'headFreightStatus', title: '头程报价状态', visible: true, order: 3 },
    { key: 'mainFreightStatus', title: '干线报价状态', visible: true, order: 4 },
    { key: 'tailFreightStatus', title: '尾程报价状态', visible: true, order: 5 },
    { key: 'containerInfo', title: '箱型箱量', visible: true, order: 6 },
    { key: 'cargoReadyTime', title: '货好时间', visible: true, order: 7 },
    { key: 'cargoNature', title: '货盘性质', visible: true, order: 8 },
    { key: 'shippingCompany', title: '船公司', visible: true, order: 9 },
    { key: 'routeType', title: '直达/中转', visible: true, order: 10 },
    { key: 'loadingPort', title: '起运港', visible: true, order: 11 },
    { key: 'dischargePort', title: '卸货港', visible: true, order: 12 },
    { key: 'cargoName', title: '品名', visible: true, order: 13 },
    { key: 'remarks', title: '备注', visible: true, order: 14 },
    { key: 'createTime', title: '创建时间', visible: true, order: 15 },
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
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = allAppointments.filter(appointment =>
      appointment.id.toLowerCase().includes(searchTermLower) ||
      appointment.inquiryPerson.toLowerCase().includes(searchTermLower) ||
      appointment.shippingCompany.toLowerCase().includes(searchTermLower) ||
      appointment.loadingPort.toLowerCase().includes(searchTermLower) ||
      appointment.dischargePort.toLowerCase().includes(searchTermLower) ||
      appointment.cargoName.toLowerCase().includes(searchTermLower) ||
      appointment.remarks.toLowerCase().includes(searchTermLower) ||
      appointment.createTime.toLowerCase().includes(searchTermLower)
    );

    setAppointments(filtered);
  };

  const handleFilter = (filters: FilterCriteria) => {
    setCurrentFilters(filters);

    const filtered = allAppointments.filter(appointment => {
      // 根据操作符和值进行筛选
      // 询价编号筛选
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

      // 询价来源筛选
      if (filters.inquirySource) {
        const val = appointment.inquirySource.toLowerCase();
        const filterVal = filters.inquirySource.toLowerCase();

        switch (filters.inquirySourceOp) {
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

      // 询价人筛选
      if (filters.inquiryPerson) {
        const val = appointment.inquiryPerson.toLowerCase();
        const filterVal = filters.inquiryPerson.toLowerCase();

        switch (filters.inquiryPersonOp) {
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

      // 头程报价状态筛选
      if (filters.headFreightStatus) {
        const val = appointment.headFreightStatus.toLowerCase();
        const filterVal = filters.headFreightStatus.toLowerCase();

        switch (filters.headFreightStatusOp) {
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

      // 干线报价状态筛选
      if (filters.mainFreightStatus) {
        const val = appointment.mainFreightStatus.toLowerCase();
        const filterVal = filters.mainFreightStatus.toLowerCase();

        switch (filters.mainFreightStatusOp) {
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

      // 尾程报价状态筛选
      if (filters.tailFreightStatus) {
        const val = appointment.tailFreightStatus.toLowerCase();
        const filterVal = filters.tailFreightStatus.toLowerCase();

        switch (filters.tailFreightStatusOp) {
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

      // 创建时间筛选
      if (filters.createTime) {
        const val = appointment.createTime.toLowerCase();
        const filterVal = filters.createTime.toLowerCase();

        switch (filters.createTimeOp) {
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

      // 箱型箱量筛选
      if (filters.containerInfo) {
        const val = appointment.containerInfo.toLowerCase();
        const filterVal = filters.containerInfo.toLowerCase();

        switch (filters.containerInfoOp) {
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

      // 直达/中转筛选
      if (filters.routeType) {
        const val = appointment.routeType.toLowerCase();
        const filterVal = filters.routeType.toLowerCase();

        switch (filters.routeTypeOp) {
          case '等于':
            if (val !== filterVal) return false;
            break;
          case '不等于':
            if (val === filterVal) return false;
            break;
        }
      }

      // 起运港筛选
      if (filters.loadingPort) {
        const val = appointment.loadingPort.toLowerCase();
        const filterVal = filters.loadingPort.toLowerCase();

        switch (filters.loadingPortOp) {
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

      // 卸货港筛选
      if (filters.dischargePort) {
        const val = appointment.dischargePort.toLowerCase();
        const filterVal = filters.dischargePort.toLowerCase();

        switch (filters.dischargePortOp) {
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

      // 品名筛选
      if (filters.cargoName) {
        const val = appointment.cargoName.toLowerCase();
        const filterVal = filters.cargoName.toLowerCase();

        switch (filters.cargoNameOp) {
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

      // 备注筛选
      if (filters.remarks) {
        const val = appointment.remarks.toLowerCase();
        const filterVal = filters.remarks.toLowerCase();

        switch (filters.remarksOp) {
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

  // 添加以下函数来检查选中的记录的状态
  const checkSelectedStatus = () => {
    const selectedAppointments = appointments.filter(a => a.isSelected);

    // 如果没有选中任何记录，返回空对象
    if (selectedAppointments.length === 0) {
      return { count: 0, allActivated: false, allDeactivated: false };
    }

    // 在新的数据模型中，我们不再使用isActivated属性
    // 这里我们可以根据需要定义新的检查逻辑，或者保持原有的返回结构
    // 为了保持代码兼容性，我们返回默认值
    return {
      count: selectedAppointments.length,
      allActivated: true,
      allDeactivated: false
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

    // 在新的数据模型中，我们不再使用isActivated属性
    // 这里我们可以根据需要定义新的激活逻辑
    // 为了保持代码兼容性，我们只更新选中状态

    // 关闭确认模态框
    setIsConfirmModalOpen(false);

    // 显示成功提示
    setToastMessage('操作成功');
    setToastType('success');
    setShowToast(true);
  };

  // 修改handleDeactivate函数
  const handleDeactivate = () => {
    const selectedIds = new Set(
      appointments.filter(a => a.isSelected).map(a => a.id)
    );

    // 在新的数据模型中，我们不再使用isActivated属性
    // 这里我们可以根据需要定义新的禁用逻辑
    // 为了保持代码兼容性，我们只更新选中状态

    // 关闭确认模态框
    setIsConfirmModalOpen(false);

    // 显示成功提示
    setToastMessage('操作成功');
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
      // 确保新记录有创建时间
      const newAppointment = {
        ...appointment,
        isSelected: false,
        createTime: appointment.createTime || new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-')
      };

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
      // 查找原始记录以保留创建时间
      const originalAppointment = allAppointments.find(a => a.id === appointment.id);

      const updatedAppointment = {
        ...appointment,
        isSelected: true,
        // 保留原始创建时间
        createTime: originalAppointment?.createTime || appointment.createTime
      };

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
            type="button"
            className="column-settings-button"
            onClick={() => setShowColumnSettings(true)}
          >
            设置列
          </button>
        </div>

        <div className="table-content-wrapper">
          <table>
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  onChange={handleToggleSelectAll}
                  title="全选/取消全选"
                  aria-label="全选/取消全选"
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
                    title={`选择询价编号 ${appointment.id}`}
                    aria-label={`选择询价编号 ${appointment.id}`}
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
        </div>

        {/* 分页器和数量统计 */}
        <div className="pagination-container">
          <div className="pagination-info">
            共 {appointments.length} 条记录，每页
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              title="每页显示记录数"
              aria-label="每页显示记录数"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            条，共 {totalPages} 页
          </div>

          <div className="pagination">
            <button
              type="button"
              className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="首页"
            >
              首页
            </button>
            <button
              type="button"
              className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="上一页"
            >
              &lt;
            </button>

            {getPageNumbers().map(page => (
              <button
                type="button"
                key={page}
                className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
                aria-label={`第${page}页`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="下一页"
            >
              &gt;
            </button>
            <button
              type="button"
              className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="末页"
            >
              末页
            </button>

            <div className="pagination-goto">
              前往
              <input
                type="text"
                className="pagination-input"
                value={goToPage}
                onChange={handleGoToPageChange}
                title="跳转到指定页码"
                aria-label="跳转到指定页码"
                placeholder="页码"
              />
              页
              <button
                type="button"
                className="pagination-go"
                onClick={handleGoToPageSubmit}
              >
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
          <li>在以下页面增加规则：海出--【订舱预审】【海运订舱】 订舱页签的字段【船公司约号】，控件改为支持模糊匹配选择的下拉框。用户可以输入2个以上字符，触发匹配，可以点击选择对应约号，选择约号之后，根据数据维护，自动在 基本页签的 约价性质 中自动跳对应的 内容。同时，NAC 也要可以自动跳，对应字段为 订舱页签--美线信息--N/A， 如果该约号下有1个NAC，则直接自动跳。 如果有N个，则这个字段可以模糊匹配下拉选择，下拉枚举值来自于 改约号下的 NAC 列表。 当然，用户依然可以强制输入。</li>
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
          <li><strong>NAC多个时候的显示方式</strong>：用 | 隔开，显示不下时候显示...，鼠标Hover出现气泡，显示完整内容</li>
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
      case 'inquirySource':
        return appointment.inquirySource;
      case 'inquiryPerson':
        return appointment.inquiryPerson;
      case 'headFreightStatus':
        return renderStatusWithColor(appointment.headFreightStatus);
      case 'mainFreightStatus':
        return renderStatusWithColor(appointment.mainFreightStatus);
      case 'tailFreightStatus':
        return renderStatusWithColor(appointment.tailFreightStatus);
      case 'containerInfo':
        return appointment.containerInfo;
      case 'cargoReadyTime':
        return appointment.cargoReadyTime;
      case 'cargoNature':
        return appointment.cargoNature;
      case 'shippingCompany':
        return formatShippingCompany(appointment.shippingCompany);
      case 'routeType':
        return appointment.routeType;
      case 'loadingPort':
        return appointment.loadingPort;
      case 'dischargePort':
        return appointment.dischargePort;
      case 'cargoName':
        return appointment.cargoName;
      case 'remarks':
        // 添加title属性以便在鼠标悬停时显示完整值
        return (
          <div className="truncate-text" title={appointment.remarks}>
            {appointment.remarks}
          </div>
        );
      case 'createTime':
        return appointment.createTime;
      default:
        return '';
    }
  }

  // 根据状态返回带颜色的状态文本
  function renderStatusWithColor(status: string) {
    let className = '';

    switch (status) {
      case '待报价':
        className = 'status-pending';
        break;
      case '已报价':
        className = 'status-quoted';
        break;
      case '拒绝报价':
        className = 'status-rejected';
        break;
    }

    return <span className={className}>{status}</span>;
  }
};

export default AppointmentTable;