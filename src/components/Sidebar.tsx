import React, { useState } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onMenuSelect: (menuName: string) => void;
  selectedMenu: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  onMenuSelect,
  selectedMenu
}) => {
  const [isFreightExpanded, setIsFreightExpanded] = useState(true);

  const toggleFreightMenu = () => {
    if (!isCollapsed) {
      setIsFreightExpanded(!isFreightExpanded);
    }
  };

  const handleMenuItemClick = (menuName: string) => {
    onMenuSelect(menuName);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-menu">
        {/* 一级菜单：运价 */}
        <div 
          className={`sidebar-menu-item ${isFreightExpanded ? 'expanded' : ''}`} 
          onClick={toggleFreightMenu}
        >
          <div className="menu-item-content">
            <FontAwesomeIcon icon={faMoneyBill} className="menu-icon" />
            {!isCollapsed && (
              <>
                <span className="menu-text">运价</span>
                <FontAwesomeIcon 
                  icon={isFreightExpanded ? faAngleDown : faAngleRight} 
                  className="expand-icon" 
                />
              </>
            )}
          </div>
        </div>

        {/* 二级菜单 */}
        {!isCollapsed && isFreightExpanded && (
          <div className="submenu">
            <div 
              className={`submenu-item ${selectedMenu === '询价管理' ? 'active' : ''}`}
              onClick={() => handleMenuItemClick('询价管理')}
            >
              询价管理
            </div>
            <div 
              className={`submenu-item ${selectedMenu === '报价管理' ? 'active' : ''}`}
              onClick={() => handleMenuItemClick('报价管理')}
            >
              报价管理
            </div>
          </div>
        )}
      </div>

      {/* 侧边栏收起/展开按钮 */}
      <div className="sidebar-toggle" onClick={onToggle}>
        {isCollapsed ? '>' : '<'}
      </div>
    </div>
  );
};

export default Sidebar;
