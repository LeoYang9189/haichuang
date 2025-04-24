import React, { useState, useEffect } from 'react';
import './ModalInstructions.css';

interface ModalInstructionsProps {
  isOpen: boolean;
  title: string;
}

const ModalInstructions: React.FC<ModalInstructionsProps> = ({ isOpen, title }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // 每当弹窗打开时，重置可见状态
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  if (!isOpen || !isVisible) return null;

  return (
    <div className="modal-instructions">
      <div className="modal-instructions-content">
        <div className="modal-instructions-header">
          <h3 className="modal-instructions-title">{title}</h3>
          <button 
            className="modal-instructions-close"
            onClick={() => setIsVisible(false)}
            title="关闭说明"
          >
            ×
          </button>
        </div>
        <ol className="modal-instructions-list">
          <li>
            <strong>船公司约号</strong>：文本输入框，必填，只能输入以下字符：大写字母、数字、短横杠、斜杠、空格、小写字母、点、逗号、#、&、*（注意都是半角，不能输入全角中文）
          </li>
          <li>
            <strong>适用航线</strong>：带模糊匹配的复选下拉框控件。枚举值来自于 基础数据--基础资料--航线的维护
          </li>
          <li>
            <strong>船公司</strong>：带模糊匹配的单选下拉框控件，枚举值来自于合作伙伴，属性为 船公司的单位。注意枚举值的拼接方式为 简称 | 中文名称。这两者都可以匹配搜索
          </li>
          <li>
            <strong>约价性质</strong>：必填。单选，枚举值就是原型里这些
          </li>
          <li>
            <strong>是否NAC</strong>：默认为【请选择】的无值状态，但是如果用户选择了是，则增加一个必填项，字段名为 NAC，属性为文本框，暂时不加限制，随便输内容
          </li>
          <li>
            <strong>适用品名</strong>：默认是 请选择 的无值状态，枚举值就是原型中下拉这些，但是如果用户选择了其他，那么要增加一个必填字段，字段名为品名，placeholder占位字符为：请输入品名或HS Code，暂时不加限制，随便输
          </li>
          <li>
            <strong>MQC</strong>：默认为空，要输入只能输入数字，整数，后面置灰默认单位为 TEU
          </li>
          <li>
            <strong>舱保</strong>：默认是 请选择 的无值状态，但是如果用户选择了是，要增加额外必填字段：舱保数量：只能输入2位小数，舱保单位：默认选中 TEU/水，其他枚举值就是原型中这些
          </li>
          <li>
            <strong>有效期</strong>：日期选择控件，包含开始日期和结束日期，两个字段均为非必填。但如果填写了结束日期，则结束日期不能早于开始日期
          </li>
          <li>
            <strong>是否启用</strong>：新增时候默认是 是，编辑时候根据实际情况选择
          </li>
          <li>
            <strong>保存校验</strong>：点击保存时候，要校验必填项是否填写，未填写，无法保存，直接在该字段外框线变为红色，下方显示"必填"。校验通过，跳 toast，提示"新增成功"或"更新成功"
          </li>
        </ol>
      </div>
    </div>
  );
};

export default ModalInstructions; 