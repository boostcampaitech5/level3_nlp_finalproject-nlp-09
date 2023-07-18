

import MakeGrid from "./route/mainGrid";
import React, { Component } from 'react';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: '100%', height: '100%' }} >
          <MakeGrid>
          </MakeGrid>
        </div>
      </header>
    </div >
  );
}

export default App;
