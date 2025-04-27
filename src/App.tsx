import React, { useState } from 'react';
import './App.css';
import AppointmentTable from './components/AppointmentTable';
import Sidebar from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('询价管理');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('询价管理');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuSelect = (menuName: string) => {
    setSelectedMenu(menuName);
    setActiveTab(menuName);
  };

  return (
    <div className="App">
      <div className="app-container">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          onMenuSelect={handleMenuSelect}
          selectedMenu={selectedMenu}
        />

        <div className="content">
          <div className="tabs">
            <div className="tab">
              <span className="tab-text">首页</span>
            </div>
            <div className={`tab ${activeTab ? 'active' : ''}`}>
              <span className="tab-text">{activeTab}</span>
              <button className="close-tab" type="button">×</button>
            </div>
          </div>

          <div className="main-content">
            <AppointmentTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
