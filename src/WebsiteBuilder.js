import React, { useState, useEffect } from 'react';
const WebsiteBuilder = () => {
  const [sections, setSections] = useState([]);
  const [currentTool, setCurrentTool] = useState(null);

  useEffect(() => {
    // Load sections from local storage on component mount
    const storedSections = JSON.parse(localStorage.getItem('websiteSections')) || [];
    setSections(storedSections);
  }, []);

  const handleToolDragStart = (toolType) => {
    setCurrentTool(toolType);
  };

  const handleSectionDrop = (e) => {
    e.preventDefault();
    const xPos = e.clientX;
    const yPos = e.clientY;
  
    if (currentTool) {
      let newContent;
      if (currentTool === 'text') {
        newContent = 'Edit this text';
      } else if (currentTool === 'image') {
        const imageUrl = prompt('Enter the image URL:');
        newContent = imageUrl || ''; // Set to empty string if the user cancels the prompt
      }
  
      const newSection = {
        id: Date.now(),
        type: currentTool,
        xPos,
        yPos,
        content: newContent,
      };
  
      setSections((prevSections) => [...prevSections, newSection]);
    }
  };

  const handleSectionDelete = (id) => {
    setSections((prevSections) => prevSections.filter((section) => section.id !== id));
  };

  const handleSectionContentChange = (id, newContent) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, content: newContent } : section
      )
    );
  };

  const handleSaveWebsite = () => {
    localStorage.setItem('websiteSections', JSON.stringify(sections));
    alert('Website saved successfully!');
  };

  const handleDownloadWebsite = () => {
    const blob = new Blob([JSON.stringify(sections)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.json';
    a.click();
  };

  return (
    <div>
      <div style={{marginRight: '10%'}}>
        <button onClick={handleSaveWebsite}>Save Website</button>
        <button onClick={handleDownloadWebsite}>Download Website</button>
      </div>
      <div
        style={{ position: 'relative', minHeight: '500px', border: '1px solid #ddd' }}
        onDrop={handleSectionDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {sections.map((section) => (
          <div
            key={section.id}
            style={{
              position: 'absolute',
              left: section.xPos,
              top: section.yPos,
              border: '1px solid #ccc',
              padding: '10px',
            }}
          >
            {section.type === 'text' ? (
              <textarea
                value={section.content}
                onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
              />
            ) : (
              <img src={section.content} alt="image" width="100" height="100" />
            )}
            <button onClick={() => handleSectionDelete(section.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div>
        <div
          draggable
          onDragStart={() => handleToolDragStart('text')}
          style={{ display: 'inline-block', padding: '10px', border: '1px solid #ddd' }}
        >
          Text
        </div>
        <div
          draggable
          onDragStart={() => handleToolDragStart('image')}
          style={{ display: 'inline-block', padding: '10px', border: '1px solid #ddd' }}
        >
          Image
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
