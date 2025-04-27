import React, { useState, useEffect, useRef } from 'react';
import './EditModal.css';

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



interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSave: (appointment: Appointment) => void;
  isAdd: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, appointment, onSave, isAdd }) => {
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
    cargoNature: '询价',
    shippingCompany: '',
    routeType: '直达',
    loadingPort: '',
    dischargePort: '',
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
      setForm({ ...appointment });
    } else if (isAdd) {
      setForm({
        id: 'R' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0'),
        isSelected: false,
        inquirySource: '内部',
        inquiryPerson: '',
        headFreightStatus: '待报价',
        mainFreightStatus: '待报价',
        tailFreightStatus: '待报价',
        containerInfo: '',
        cargoReadyTime: '',
        cargoNature: '询价',
        shippingCompany: '',
        routeType: '直达',
        loadingPort: '',
        dischargePort: '',
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
    }
  }, [appointment, isAdd]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 简化处理，直接更新表单值
    setForm({
      ...form,
      [name]: value
    });
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isAdd ? '新增询价' : '编辑询价'}</h2>
          <button type="button" className="close-button" onClick={onClose} title="关闭">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="required">询价编号:</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="请输入询价编号"
                title="询价编号"
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