import React, { useState, useEffect } from 'react';
import './AppointmentEditor.css';

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
  cargoReadyTimeType: string; // 货好时间类型：date(日期) 或 range(区间)
  cargoNature: string; // 货盘性质：实单、询价
  shippingCompany: string; // 船公司
  routeType: string; // 直达/中转
  loadingPort: string; // 起运港，如 CNSHA | Shanghai
  dischargePort: string; // 卸货港，如 USLAX | Los Angels
  transitPort: string; // 中转港，如 KRPUS | Busan，仅当 routeType 为"中转"时有值
  cargoName: string; // 品名
  remarks: string; // 备注
  createTime: string; // 创建时间，精确到时分秒
  clientType?: string; // 委托单位类型：临时客户、正式客户
  clientName?: string; // 委托单位名称
}

interface AppointmentEditorProps {
  appointment: Appointment | null;
  onSave: (appointment: Appointment) => void;
  onCancel: () => void;
  isAdd: boolean;
}

const AppointmentEditor: React.FC<AppointmentEditorProps> = ({ appointment, onSave, onCancel, isAdd }) => {
  // 报价选项状态
  const [quoteOptions, setQuoteOptions] = useState({
    prePortQuote: true,
    mainlineQuote: true, // 干线报价始终为选中状态
    postPortQuote: true
  });

  // 箱型箱量状态
  const [containerGroups, setContainerGroups] = useState([
    { type: '20GP', quantity: 1 }
  ]);

  // 正式客户列表
  const formalClients = [
    "ACME CORPORATION",
    "GLOBEX INTERNATIONAL",
    "STARK INDUSTRIES",
    "WAYNE ENTERPRISES",
    "UMBRELLA CORPORATION",
    "CYBERDYNE SYSTEMS",
    "OSCORP INDUSTRIES",
    "MASSIVE DYNAMIC",
    "APERTURE SCIENCE",
    "WEYLAND-YUTANI CORP"
  ];

  // 客户名称搜索状态
  const [clientNameSearch, setClientNameSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState(formalClients);

  // 处理客户名称搜索
  const handleClientNameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setClientNameSearch(searchTerm);

    if (searchTerm.trim() === "") {
      setFilteredClients(formalClients);
    } else {
      const filtered = formalClients.filter(client =>
        client.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  };

  // 处理选择客户
  const handleSelectClient = (client: string) => {
    setForm({
      ...form,
      clientName: client
    });
    setClientNameSearch(client);
    setShowClientDropdown(false);
  };

  // 点击页面其他地方关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.client-name-container')) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [form, setForm] = useState<Appointment>({
    id: 'R' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0'),
    isSelected: false,
    inquirySource: '内部',
    inquiryPerson: '',
    headFreightStatus: '待报价',
    mainFreightStatus: '待报价',
    tailFreightStatus: '待报价',
    containerInfo: '',
    cargoReadyTime: '',
    cargoReadyTimeType: 'date',
    cargoNature: '实单',
    shippingCompany: '',
    routeType: '直达',
    loadingPort: '',
    dischargePort: '',
    transitPort: '',
    cargoName: '',
    remarks: '',
    createTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
  });

  useEffect(() => {
    if (appointment) {
      // 设置默认值
      const updatedAppointment = {
        ...appointment,
        cargoReadyTimeType: appointment.cargoReadyTimeType || 'range',
        cargoReadyTime: appointment.cargoReadyTime || '二周内',
        clientType: appointment.clientType || '临时客户',
        clientName: appointment.clientName || ''
      };

      setForm(updatedAppointment);

      // 设置客户名称搜索的初始值
      if (updatedAppointment.clientType === '正式客户' && updatedAppointment.clientName) {
        setClientNameSearch(updatedAppointment.clientName);
      }

      // 解析箱型箱量字符串，初始化containerGroups
      if (appointment.containerInfo) {
        const groups = parseContainerInfo(appointment.containerInfo);
        setContainerGroups(groups);
      }
    } else if (isAdd) {
      const newForm = {
        id: 'R' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0'),
        isSelected: false,
        inquirySource: '内部',
        inquiryPerson: '张三',
        headFreightStatus: '待报价',
        mainFreightStatus: '待报价',
        tailFreightStatus: '待报价',
        containerInfo: '',
        cargoReadyTime: '二周内',
        cargoReadyTimeType: 'range',
        cargoNature: '实单',
        shippingCompany: '',
        routeType: '直达',
        loadingPort: '',
        dischargePort: '',
        transitPort: '',
        cargoName: '',
        remarks: '',
        clientType: '临时客户',
        clientName: '',
        createTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-')
      };

      setForm(newForm);

      // 初始化一个空的箱型箱量组
      setContainerGroups([{ type: '20GP', quantity: 1 }]);
    }
  }, [appointment, isAdd]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 如果是路由类型变更，且变为"直达"，则清空中转港
    if (name === 'routeType' && value === '直达') {
      setForm({
        ...form,
        [name]: value,
        transitPort: ''
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  // 清空输入框内容
  const handleClearInput = (name: string) => {
    setForm({
      ...form,
      [name]: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 简单验证
    if (!form.id) {
      alert('请输入询价编号');
      return;
    }

    // 保存表单
    onSave(form);
  };

  const handleSaveDefault = () => {
    // 这里可以实现保存默认值的逻辑
    alert('已保存为默认值');
  };

  // 处理箱型变更
  const handleContainerTypeChange = (index: number, value: string) => {
    const newContainerGroups = [...containerGroups];
    newContainerGroups[index].type = value;
    setContainerGroups(newContainerGroups);

    // 更新表单中的箱型箱量字符串
    updateContainerInfoString(newContainerGroups);
  };

  // 处理箱量变更
  const handleContainerQuantityChange = (index: number, value: number) => {
    const newContainerGroups = [...containerGroups];
    newContainerGroups[index].quantity = value;
    setContainerGroups(newContainerGroups);

    // 更新表单中的箱型箱量字符串
    updateContainerInfoString(newContainerGroups);
  };

  // 添加新的箱型箱量组
  const addContainerGroup = () => {
    if (containerGroups.length < 5) {
      setContainerGroups([...containerGroups, { type: '20GP', quantity: 1 }]);
    }
  };

  // 删除箱型箱量组
  const removeContainerGroup = (index: number) => {
    if (containerGroups.length > 1) {
      const newContainerGroups = containerGroups.filter((_, i) => i !== index);
      setContainerGroups(newContainerGroups);

      // 更新表单中的箱型箱量字符串
      updateContainerInfoString(newContainerGroups);
    }
  };

  // 更新表单中的箱型箱量字符串
  const updateContainerInfoString = (groups: { type: string, quantity: number }[]) => {
    const containerInfoString = groups
      .map(group => `${group.quantity}*${group.type}`)
      .join('+');

    setForm({
      ...form,
      containerInfo: containerInfoString
    });
  };

  // 解析箱型箱量字符串
  const parseContainerInfo = (containerInfo: string): { type: string, quantity: number }[] => {
    if (!containerInfo) {
      return [{ type: '20GP', quantity: 1 }];
    }

    try {
      // 分割字符串，例如 "1*20GP+2*40HC" => ["1*20GP", "2*40HC"]
      const parts = containerInfo.split('+');

      return parts.map(part => {
        // 分割每个部分，例如 "1*20GP" => ["1", "20GP"]
        const [quantityStr, type] = part.split('*');
        const quantity = parseInt(quantityStr);

        return {
          type: type || '20GP',
          quantity: isNaN(quantity) ? 1 : quantity
        };
      });
    } catch (error) {
      console.error('解析箱型箱量字符串出错:', error);
      return [{ type: '20GP', quantity: 1 }];
    }
  };

  return (
    <div className="appointment-editor">
      <div className="editor-top-bar">
        <div className="editor-buttons">
          <button type="button" className="save-button" onClick={handleSubmit}>保存</button>
          <button type="button" className="cancel-button" onClick={onCancel}>取消</button>
          <button type="button" className="default-button" onClick={handleSaveDefault}>保存默认值</button>
        </div>
      </div>

      <div className="quote-options">
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="prePortQuote"
            checked={quoteOptions.prePortQuote}
            onChange={(e) => setQuoteOptions({...quoteOptions, prePortQuote: e.target.checked})}
          />
          <span className="checkbox-label">港前报价</span>
        </label>
        <label className="checkbox-container disabled">
          <input
            type="checkbox"
            name="mainlineQuote"
            checked={quoteOptions.mainlineQuote}
            disabled={true}
          />
          <span className="checkbox-label">干线报价</span>
        </label>
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="postPortQuote"
            checked={quoteOptions.postPortQuote}
            onChange={(e) => setQuoteOptions({...quoteOptions, postPortQuote: e.target.checked})}
          />
          <span className="checkbox-label">港后报价</span>
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-top-sections">
          {/* 基本信息区域 */}
          <div className="form-section">
            <h3 className="section-title">基本信息</h3>
            <div className="section-content">
            <div className="form-group">
              <label className="required">询价编号:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="id"
                  value={form.id}
                  readOnly
                  disabled
                  className="disabled-input"
                  title="询价编号(自动生成)"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>询价人:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="inquiryPerson"
                  value="张三" // 虚拟的中文名字
                  readOnly
                  disabled
                  className="disabled-input"
                  title="当前操作人"
                />
              </div>
            </div>

            <div className="form-group">
              <label>询价来源:</label>
              <div className="input-wrapper">
                <select
                  name="inquirySource"
                  value="内部"
                  disabled
                  className="disabled-input"
                  title="询价来源"
                >
                  <option value="内部">内部</option>
                </select>
              </div>
            </div>

            <div className="form-group client-unit">
              <label>委托单位:</label>
              <div className="input-wrapper">
                <div className="client-unit-container">
                  <select
                    name="clientType"
                    value={form.clientType || "临时客户"}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setForm({
                        ...form,
                        clientType: newType,
                        clientName: newType === "临时客户" ? form.clientName : ""
                      });
                    }}
                    className="client-type-select"
                  >
                    <option value="临时客户">临时客户</option>
                    <option value="正式客户">正式客户</option>
                  </select>

                  {form.clientType === "临时客户" ? (
                    <input
                      type="text"
                      name="clientName"
                      value={form.clientName || ""}
                      onChange={handleChange}
                      placeholder="请输入委托单位名称"
                      className="client-name-input"
                    />
                  ) : (
                    <div className="client-name-container">
                      <input
                        type="text"
                        name="clientNameSearch"
                        value={clientNameSearch}
                        onChange={handleClientNameSearch}
                        placeholder="请输入或选择正式客户名称"
                        className="client-name-input"
                        onFocus={() => setShowClientDropdown(true)}
                      />
                      {showClientDropdown && (
                        <div className="client-dropdown">
                          {filteredClients.map((client, index) => (
                            <div
                              key={index}
                              className="client-dropdown-item"
                              onClick={() => handleSelectClient(client)}
                            >
                              {client}
                            </div>
                          ))}
                          {filteredClients.length === 0 && (
                            <div className="client-dropdown-item">无匹配客户</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group cargo-ready-time">
              <label>货好时间:</label>
              <div className="input-wrapper">
                <div className="cargo-ready-time-container">
                  <div className="radio-group">
                    <label className="radio-container">
                      <input
                        type="radio"
                        name="cargoReadyTimeType"
                        value="date"
                        checked={form.cargoReadyTimeType === 'date'}
                        onChange={() => setForm({...form, cargoReadyTimeType: 'date'})}
                      />
                      <span className="radio-label">日期</span>
                    </label>
                    <label className="radio-container">
                      <input
                        type="radio"
                        name="cargoReadyTimeType"
                        value="range"
                        checked={form.cargoReadyTimeType === 'range'}
                        onChange={() => setForm({...form, cargoReadyTimeType: 'range', cargoReadyTime: '二周内'})}
                      />
                      <span className="radio-label">区间</span>
                    </label>
                  </div>

                  <div className="cargo-ready-time-input">
                    {form.cargoReadyTimeType === 'date' ? (
                      <input
                        type="date"
                        name="cargoReadyTime"
                        value={form.cargoReadyTime}
                        onChange={handleChange}
                        title="货好时间"
                        className="date-input"
                      />
                    ) : (
                      <select
                        name="cargoReadyTime"
                        value={form.cargoReadyTime || '二周内'}
                        onChange={handleChange}
                        title="货好时间"
                        className="range-select"
                      >
                        <option value="一周内">一周内</option>
                        <option value="二周内">二周内</option>
                        <option value="一个月内">一个月内</option>
                        <option value="一个月以上">一个月以上</option>
                        <option value="暂不确定">暂不确定</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>货盘性质:</label>
              <div className="input-wrapper">
                <select
                  name="cargoNature"
                  value={form.cargoNature}
                  onChange={handleChange}
                  title="货盘性质"
                >
                  <option value="实单">实单</option>
                  <option value="询价">询价</option>
                </select>
              </div>
            </div>


          </div>
          </div>

          {/* 货物信息区域 */}
          <div className="form-section">
            <h3 className="section-title">货物信息</h3>
            <div className="section-content">
            <div className="form-group">
              <label>船公司:</label>
              <div className="input-wrapper">
                <select
                  name="shippingCompany"
                  value={form.shippingCompany}
                  onChange={handleChange}
                  title="船公司"
                >
                  <option value="">请选择</option>
                  <option value="MSC">MSC | 地中海</option>
                  <option value="COSCO">COSCO | 中远海运</option>
                  <option value="OOCL">OOCL | 东方海外</option>
                  <option value="CMA">CMA | 达飞轮船</option>
                  <option value="ONE">ONE | 海洋网联</option>
                  <option value="HAPAG">HAPAG | 赫伯罗特</option>
                  <option value="ZIM">ZIM | 以星航运</option>
                  <option value="MAERSK">MAERSK | 马士基</option>
                  <option value="EVERGREEN">EVERGREEN | 长荣海运</option>
                  <option value="YANGMING">YANGMING | 阳明海运</option>
                </select>
                {form.shippingCompany && (
                  <button
                    type="button"
                    className="clear-button"
                    onClick={() => handleClearInput('shippingCompany')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>直达/中转:</label>
              <div className="input-wrapper">
                <select
                  name="routeType"
                  value={form.routeType}
                  onChange={handleChange}
                  title="直达/中转"
                >
                  <option value="直达">直达</option>
                  <option value="中转">中转</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>起运港:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="loadingPort"
                  value={form.loadingPort}
                  onChange={handleChange}
                  placeholder="例如: CNSHA | Shanghai"
                  title="起运港"
                />
                {form.loadingPort && (
                  <button
                    type="button"
                    className="clear-button"
                    onClick={() => handleClearInput('loadingPort')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>卸货港:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="dischargePort"
                  value={form.dischargePort}
                  onChange={handleChange}
                  placeholder="例如: USLAX | Los Angels"
                  title="卸货港"
                />
                {form.dischargePort && (
                  <button
                    type="button"
                    className="clear-button"
                    onClick={() => handleClearInput('dischargePort')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {form.routeType === '中转' && (
              <div className="form-group">
                <label>中转港:</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="transitPort"
                    value={form.transitPort}
                    onChange={handleChange}
                    placeholder="例如: KRPUS | Busan"
                    title="中转港"
                  />
                  {form.transitPort && (
                    <button
                      type="button"
                      className="clear-button"
                      onClick={() => handleClearInput('transitPort')}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>品名:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="cargoName"
                  value={form.cargoName}
                  onChange={handleChange}
                  placeholder="请输入品名"
                  title="品名"
                />
                {form.cargoName && (
                  <button
                    type="button"
                    className="clear-button"
                    onClick={() => handleClearInput('cargoName')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>备注:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="请输入备注"
                  title="备注"
                />
                {form.remarks && (
                  <button
                    type="button"
                    className="clear-button"
                    onClick={() => handleClearInput('remarks')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="form-group container-info">
              <label>箱型箱量:</label>
              <div className="input-wrapper">
                <div className="container-groups">
                  {containerGroups.map((group, index) => (
                    <div key={index} className="container-group">
                      <select
                        className="container-type"
                        value={group.type}
                        onChange={(e) => handleContainerTypeChange(index, e.target.value)}
                      >
                        <option value="20GP">20GP</option>
                        <option value="40GP">40GP</option>
                        <option value="40HC">40HC</option>
                        <option value="45HC">45HC</option>
                      </select>
                      <input
                        type="number"
                        className="container-quantity"
                        min="1"
                        max="100"
                        value={group.quantity}
                        onChange={(e) => handleContainerQuantityChange(index, parseInt(e.target.value))}
                      />
                      {containerGroups.length > 1 && (
                        <button
                          type="button"
                          className="remove-container-btn"
                          onClick={() => removeContainerGroup(index)}
                          title="删除此箱型"
                        >
                          -
                        </button>
                      )}
                      {index === containerGroups.length - 1 && containerGroups.length < 5 && (
                        <button
                          type="button"
                          className="add-container-btn"
                          onClick={addContainerGroup}
                          title="添加新箱型"
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* 匹配运价区域 */}
        <div className="form-section">
          <h3 className="section-title">匹配运价</h3>
          <div className="section-content">
            {/* 这里可以添加匹配运价的表格或其他内容 */}
            <div className="no-data">暂无匹配运价</div>
          </div>
        </div>

        {/* 底部按钮已移至顶部 */}
      </form>
    </div>
  );
};

export default AppointmentEditor;
