import React, { useState, useEffect, useRef } from 'react';
import './EditModal.css';

interface Appointment {
  id: string;
  line: string;
  isActivated: boolean;
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
  validFrom: string;
  validTo: string;
}

interface ShippingLine {
  id: number;
  nameCn: string;
  nameEn: string;
  selected: boolean;
}

interface ShippingCompany {
  id: number;
  code: string;
  name: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSave: (appointment: Appointment) => void;
  isAdd: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, appointment, onSave, isAdd }) => {
  const [form, setForm] = useState<Appointment>({
    id: '',
    line: '',
    isActivated: true,
    shippingCompany: '',
    priceNature: '自有约价',
    isNAC: null,
    nac: '',
    applicableProducts: null,
    customProduct: '',
    mqc: '',
    cabinProtection: null,
    cabinProtectionValue: '',
    cabinProtectionUnit: 'TEU/水',
    validFrom: '',
    validTo: ''
  });

  // 航线选项
  const [shippingLines, setShippingLines] = useState<ShippingLine[]>([
    { id: 1, nameCn: '新加坡', nameEn: 'Singapore', selected: false },
    { id: 2, nameCn: '阿拉木图', nameEn: 'Almaty', selected: false },
    { id: 3, nameCn: '加勒比', nameEn: 'Caribbean', selected: false },
    { id: 4, nameCn: '印尼', nameEn: 'Indonesia', selected: false },
    { id: 5, nameCn: '中美洲', nameEn: 'Central America', selected: false },
    { id: 6, nameCn: '非洲', nameEn: 'Africa', selected: false },
    { id: 7, nameCn: '南美洲', nameEn: 'South America', selected: false }
  ]);
  
  // 船公司选项
  const [shippingCompanies] = useState<ShippingCompany[]>([
    { id: 1, code: 'MSK', name: '马士基' },
    { id: 2, code: 'MSC', name: '地中海' },
    { id: 3, code: 'CMA', name: '达飞' },
    { id: 4, code: 'COSCO', name: '中远海运' },
    { id: 5, code: 'HPL', name: '赫伯罗特' },
    { id: 6, code: 'ONE', name: '海洋网联' },
    { id: 7, code: 'EVG', name: '长荣海运' },
    { id: 8, code: 'YML', name: '阳明海运' },
    { id: 9, code: 'ZIM', name: '以星航运' },
    { id: 10, code: 'OOCL', name: '东方海外' }
  ]);
  
  // 分离搜索输入和显示值
  const [searchInput, setSearchInput] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState('');
  const [showLineDropdown, setShowLineDropdown] = useState(false);
  const [filteredLines, setFilteredLines] = useState(shippingLines);
  const lineDropdownRef = useRef<HTMLDivElement>(null);
  
  // 船公司下拉框状态
  const [companySearchInput, setCompanySearchInput] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState(shippingCompanies);
  const [selectedCompanyDisplay, setSelectedCompanyDisplay] = useState('');
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appointment) {
      setForm({ ...appointment });
      
      // 根据选中的航线更新shippingLines的状态
      if (appointment.line) {
        const selectedLines = appointment.line.split(',');
        const updatedLines = shippingLines.map(line => ({
          ...line,
          selected: selectedLines.includes(line.nameCn)
        }));
        setShippingLines(updatedLines);
        
        // 更新显示值
        setSelectedDisplay(selectedLines.join(', '));
      }
      
      // 设置船公司显示值
      if (appointment.shippingCompany) {
        const company = shippingCompanies.find(c => 
          c.code === appointment.shippingCompany || 
          c.name === appointment.shippingCompany
        );
        if (company) {
          setSelectedCompanyDisplay(`${company.code} | ${company.name}`);
        } else {
          setSelectedCompanyDisplay(appointment.shippingCompany);
        }
      }
    } else if (isAdd) {
      setForm({
        id: '',
        line: '',
        isActivated: true,
        shippingCompany: '',
        priceNature: '自有约价',
        isNAC: null,
        nac: '',
        applicableProducts: null,
        customProduct: '',
        mqc: '',
        cabinProtection: null,
        cabinProtectionValue: '',
        cabinProtectionUnit: 'TEU/水',
        validFrom: '',
        validTo: ''
      });
      
      // 重置航线选择状态
      setShippingLines(prev => prev.map(line => ({ ...line, selected: false })));
      setSelectedDisplay('');
      setSearchInput('');
      setSelectedCompanyDisplay('');
      setCompanySearchInput('');
    }
  }, [appointment, isAdd, shippingCompanies]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (lineDropdownRef.current && !lineDropdownRef.current.contains(event.target as Node)) {
        setShowLineDropdown(false);
        // 关闭下拉框时清空搜索词，恢复显示选中项
        setSearchInput('');
      }
      
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
        // 关闭下拉框时清空搜索词
        setCompanySearchInput('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 根据搜索词过滤航线
  useEffect(() => {
    if (showLineDropdown) {
      const filtered = shippingLines.filter(
        line => 
          line.nameCn.toLowerCase().includes(searchInput.toLowerCase()) || 
          line.nameEn.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredLines(filtered);
    } else {
      // 下拉框关闭时，重置过滤结果
      setFilteredLines(shippingLines);
    }
  }, [searchInput, shippingLines, showLineDropdown]);
  
  // 根据搜索词过滤船公司
  useEffect(() => {
    if (showCompanyDropdown) {
      const filtered = shippingCompanies.filter(
        company => 
          company.code.toLowerCase().includes(companySearchInput.toLowerCase()) || 
          company.name.toLowerCase().includes(companySearchInput.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      // 下拉框关闭时，重置过滤结果
      setFilteredCompanies(shippingCompanies);
    }
  }, [companySearchInput, shippingCompanies, showCompanyDropdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'isActivated') {
      setForm({
        ...form,
        isActivated: value === '是'
      });
    } else if (name === 'isNAC') {
      setForm({
        ...form,
        isNAC: value === '' ? null : value === '是'
      });
    } else if (name === 'applicableProducts') {
      setForm({
        ...form,
        applicableProducts: value === '' ? null : value,
        // 如果切换了品名且不是"其他"，清空自定义品名
        customProduct: value === '其他' ? form.customProduct : ''
      });
    } else if (name === 'mqc') {
      // 只允许输入数字或为空
      if (value === '' || /^\d*$/.test(value)) {
        setForm({
          ...form,
          mqc: value
        });
      }
    } else if (name === 'cabinProtection') {
      setForm({
        ...form,
        cabinProtection: value === '' ? null : value,
        // 如果不是"有"，清空舱保相关字段
        cabinProtectionValue: value === '有' ? form.cabinProtectionValue : '',
        // 保持舱保单位默认值
        cabinProtectionUnit: value === '有' ? (form.cabinProtectionUnit || 'TEU/水') : 'TEU/水'
      });
    } else if (name === 'cabinProtectionValue') {
      // 只允许输入数字或为空
      if (value === '' || /^\d*$/.test(value)) {
        setForm({
          ...form,
          cabinProtectionValue: value
        });
      }
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
  
  // 清空航线选择
  const handleClearLines = () => {
    // 清空所有航线选择
    const updatedLines = shippingLines.map(line => ({
      ...line,
      selected: false
    }));
    setShippingLines(updatedLines);
    setForm({
      ...form,
      line: ''
    });
    setSelectedDisplay('');
    setSearchInput('');
  };
  
  // 清空船公司选择
  const handleClearCompany = () => {
    setForm({
      ...form,
      shippingCompany: ''
    });
    setSelectedCompanyDisplay('');
    setCompanySearchInput('');
  };

  // 清除是否NAC选择
  const handleClearNAC = () => {
    setForm({
      ...form,
      isNAC: null,
      nac: ''
    });
  };

  // 清除适用品名选择
  const handleClearProduct = () => {
    setForm({
      ...form,
      applicableProducts: null,
      customProduct: ''
    });
  };

  // 清除舱保选择
  const handleClearCabinProtection = () => {
    setForm({
      ...form,
      cabinProtection: null,
      cabinProtectionValue: '',
      cabinProtectionUnit: 'TEU/水'
    });
  };

  const handleLineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 只更新搜索输入，不影响已选择的显示
    setSearchInput(e.target.value);
    setShowLineDropdown(true);
  };

  const handleLineInputFocus = () => {
    setShowLineDropdown(true);
    // 已经选择了航线，但是仍然要保持文本框内容为选择的内容，不清空搜索词
  };
  
  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanySearchInput(e.target.value);
    setShowCompanyDropdown(true);
  };
  
  const handleCompanyInputFocus = () => {
    setShowCompanyDropdown(true);
  };

  const handleShippingLineClick = (id: number) => {
    // 更新航线选择状态
    const updatedLines = shippingLines.map(line => 
      line.id === id ? { ...line, selected: !line.selected } : line
    );
    setShippingLines(updatedLines);
    
    // 更新form中的line字段和显示值
    const selectedLines = updatedLines.filter(line => line.selected);
    const selectedLinesText = selectedLines.map(line => line.nameCn).join(',');
    const displayText = selectedLines.map(line => line.nameCn).join(', ');
    
    setForm({
      ...form,
      line: selectedLinesText
    });
    setSelectedDisplay(displayText);
    
    // 不要在选择后关闭下拉框，保持打开状态以便多选
    // 下拉框会在点击外部区域时关闭
  };
  
  const handleCompanyClick = (company: ShippingCompany) => {
    // 更新form中的船公司字段
    setForm({
      ...form,
      shippingCompany: company.code
    });
    
    // 更新显示值
    setSelectedCompanyDisplay(`${company.code} | ${company.name}`);
    
    // 单选，选择后关闭下拉框
    setShowCompanyDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isAdd ? '新增约号' : '编辑约号'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="required">船公司约号:</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="id"
                value={form.id}
                onChange={handleChange}
                required
              />
              {form.id && (
                <button 
                  type="button" 
                  className="clear-button" 
                  onClick={() => handleClearInput('id')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>适用航线:</label>
            <div className="shipping-line-selector" ref={lineDropdownRef}>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="shipping-line-input"
                  placeholder="请选择航线（可多选）"
                  value={selectedDisplay}
                  onChange={handleLineInputChange}
                  onFocus={handleLineInputFocus}
                  onClick={() => setShowLineDropdown(true)}
                />
                {selectedDisplay && (
                  <button 
                    type="button" 
                    className="clear-button" 
                    onClick={handleClearLines}
                  >
                    ×
                  </button>
                )}
              </div>
              {showLineDropdown && (
                <div className="shipping-line-dropdown">
                  <div className="dropdown-header">
                    <div>当前显示{filteredLines.length}条数据（可多选）</div>
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder="搜索航线..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {filteredLines.map(line => (
                    <div 
                      key={line.id} 
                      className={`shipping-line-item ${line.selected ? 'selected' : ''}`}
                      onClick={() => handleShippingLineClick(line.id)}
                    >
                      {line.nameCn}
                      {line.selected && <span className="check-icon">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>船公司:</label>
            <div className="shipping-company-selector" ref={companyDropdownRef}>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="shipping-company-input"
                  placeholder="请选择船公司"
                  value={selectedCompanyDisplay}
                  onChange={handleCompanyInputChange}
                  onFocus={handleCompanyInputFocus}
                  onClick={() => setShowCompanyDropdown(true)}
                />
                {selectedCompanyDisplay && (
                  <button 
                    type="button" 
                    className="clear-button" 
                    onClick={handleClearCompany}
                  >
                    ×
                  </button>
                )}
              </div>
              {showCompanyDropdown && (
                <div className="shipping-company-dropdown">
                  <div className="dropdown-header">
                    <div>当前显示{filteredCompanies.length}条数据</div>
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder="搜索船公司..."
                        value={companySearchInput}
                        onChange={(e) => setCompanySearchInput(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {filteredCompanies.map(company => (
                    <div 
                      key={company.id} 
                      className={`shipping-company-item ${form.shippingCompany === company.code ? 'selected' : ''}`}
                      onClick={() => handleCompanyClick(company)}
                    >
                      {company.code} | {company.name}
                      {form.shippingCompany === company.code && <span className="check-icon">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label className="required">约价性质:</label>
            <select
              name="priceNature"
              value={form.priceNature}
              onChange={handleChange}
              required
            >
              <option value="自有约价">自有约价</option>
              <option value="客户约价">客户约价</option>
              <option value="海外代理约价">海外代理约价</option>
              <option value="无约价">无约价</option>
              <option value="同行约价">同行约价</option>
              <option value="AFC约价">AFC约价</option>
              <option value="AFG约价">AFG约价</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>是否NAC:</label>
            <div className="input-wrapper">
              <select
                name="isNAC"
                value={form.isNAC === null ? '' : form.isNAC ? '是' : '否'}
                onChange={handleChange}
              >
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
              {form.isNAC !== null && (
                <button 
                  type="button" 
                  className="clear-button" 
                  onClick={handleClearNAC}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {form.isNAC === true && (
            <div className="form-group">
              <label className="required">NAC:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="nac"
                  value={form.nac}
                  onChange={handleChange}
                  required
                />
                {form.nac && (
                  <button 
                    type="button" 
                    className="clear-button" 
                    onClick={() => handleClearInput('nac')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>适用品名:</label>
            <div className="input-wrapper">
              <select
                name="applicableProducts"
                value={form.applicableProducts || ''}
                onChange={handleChange}
              >
                <option value="">请选择</option>
                <option value="FAK">FAK</option>
                <option value="危险品">危险品</option>
                <option value="特种柜">特种柜</option>
                <option value="冷冻货">冷冻货</option>
                <option value="化工品">化工品</option>
                <option value="纺织品">纺织品</option>
                <option value="其他">其他</option>
              </select>
              {form.applicableProducts && (
                <button 
                  type="button" 
                  className="clear-button" 
                  onClick={handleClearProduct}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {form.applicableProducts === '其他' && (
            <div className="form-group">
              <label className="required">品名:</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="customProduct"
                  value={form.customProduct}
                  onChange={handleChange}
                  placeholder="请输入品名或HS Code"
                  required
                />
                {form.customProduct && (
                  <button 
                    type="button" 
                    className="clear-button" 
                    onClick={() => handleClearInput('customProduct')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>MQC:</label>
            <div className="unit-input-wrapper">
              <input
                type="text"
                name="mqc"
                value={form.mqc}
                onChange={handleChange}
                className="unit-input"
                placeholder="请输入数字"
              />
              <span className="input-unit">TEU</span>
              {form.mqc && (
                <button 
                  type="button" 
                  className="clear-button" 
                  onClick={() => handleClearInput('mqc')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>舱保:</label>
            <div className="input-wrapper">
              <select
                name="cabinProtection"
                value={form.cabinProtection || ''}
                onChange={handleChange}
              >
                <option value="">请选择</option>
                <option value="有">有</option>
                <option value="无">无</option>
              </select>
              {form.cabinProtection !== null && (
                <button 
                  type="button" 
                  className="clear-button" 
                  onClick={handleClearCabinProtection}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {form.cabinProtection === '有' && (
            <>
              <div className="form-group">
                <label className="required">舱保数量:</label>
                <div className="unit-input-wrapper">
                  <input
                    type="text"
                    name="cabinProtectionValue"
                    value={form.cabinProtectionValue}
                    onChange={handleChange}
                    className="unit-input"
                    placeholder="请输入数字"
                    required
                  />
                  {form.cabinProtectionValue && (
                    <button 
                      type="button" 
                      className="clear-button" 
                      onClick={() => handleClearInput('cabinProtectionValue')}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="required">舱保单位:</label>
                <div className="input-wrapper">
                  <select
                    name="cabinProtectionUnit"
                    value={form.cabinProtectionUnit}
                    onChange={handleChange}
                    required
                  >
                    <option value="">请选择</option>
                    <option value="TEU/周">TEU/周</option>
                    <option value="TEU/水">TEU/水</option>
                    <option value="TEU/合约期">TEU/合约期</option>
                    <option value="TEU/月">TEU/月</option>
                    <option value="TEU/年">TEU/年</option>
                  </select>
                  {form.cabinProtectionUnit && form.cabinProtectionUnit !== 'TEU/水' && (
                    <button 
                      type="button" 
                      className="clear-button" 
                      onClick={() => setForm({...form, cabinProtectionUnit: 'TEU/水'})}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label>有效期开始:</label>
            <div className="input-wrapper">
              <input
                type="date"
                name="validFrom"
                value={form.validFrom}
                onChange={handleChange}
              />
              {form.validFrom && (
                <button 
                  type="button" 
                  className="clear-button" 
                  onClick={() => handleClearInput('validFrom')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>有效期结束:</label>
            <div className="input-wrapper">
              <input
                type="date"
                name="validTo"
                value={form.validTo}
                onChange={handleChange}
                min={form.validFrom}
              />
              {form.validTo && (
                <button 
                  type="button" 
                  className="clear-button" 
                  onClick={() => handleClearInput('validTo')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>是否启用:</label>
            <div className="input-wrapper">
              <select
                name="isActivated"
                value={form.isActivated ? '是' : '否'}
                onChange={handleChange}
              >
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
              <button 
                type="button" 
                className="clear-button" 
                onClick={() => setForm({...form, isActivated: true})}
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>取消</button>
            <button type="submit" className="save-button">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal; 