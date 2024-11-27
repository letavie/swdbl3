import React from 'react';
import './IdentityCardPage.css';

function IdentityCardPage() {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file);
            // Add your file handling logic here
        }
    };

    return (
        <div className="identity-card-container">
            <div className="identity-card-content">
                <h2>Identity Card</h2>
                <p>Here you can upload and manage your identity card details.</p>
                <div className="upload-button-wrapper">
                    <input 
                        type="file" 
                        id="fileUpload" 
                        className="file-input" 
                        onChange={handleFileChange} 
                    />
                    <label htmlFor="fileUpload" className="upload-button">
                        +Add Image
                    </label>
                </div>
            </div>
        </div>
    );
}

export default IdentityCardPage;
