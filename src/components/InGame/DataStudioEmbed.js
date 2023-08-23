import React from 'react';
import NavBar from '../NavBar';

const DataStudioEmbed = () => {
  const iframeStyle = {
    position: 'fixed',
    top: '10%',
    left: 0,
    width: '100%',
    height: '90%',
    bo0rder: '0',
  };

  return (
    <>
      <NavBar />
      <iframe
        src="https://lookerstudio.google.com/embed/reporting/7b6362bf-f191-4c25-8e46-e955b1447fc6/page/2rpXD"
        style={iframeStyle}
      />
    </>
  );
};

export default DataStudioEmbed;
