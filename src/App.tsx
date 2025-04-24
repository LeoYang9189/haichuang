import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import AppointmentTable from './components/AppointmentTable';

function App() {
  const [activeTab, setActiveTab] = useState('船公司约号管理');

  return (
    <div className="App">
      <header className="header">
        <button className="menu-button">
          <FontAwesomeIcon icon={faList} />
        </button>
        <div className="header-title">
          行业陪检部化工品，锂电池，安定 - 04/23 【运价信息】4月23
        </div>
      </header>
      
      <div className="content">
        <div className="tabs">
          <div className="tab">
            <span className="tab-text">首页</span>
          </div>
          <div className={`tab ${activeTab === '船公司约号管理' ? 'active' : ''}`}>
            <span className="tab-text">船公司约号管理</span>
            <button className="close-tab">×</button>
          </div>
        </div>
        
        <div className="main-content">
          <AppointmentTable />
        </div>
      </div>
    </div>
  );
}

export default App;
