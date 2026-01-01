// ===== SharePoll.jsx =====
import React, { useState } from "react";
import "../../styles/sharePoll.css"; 
import Swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
const SharePoll = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  // The poll link (In a real app, retrieve this from props or URL params)
  const pollLink = pollId ? `http://localhost:5173/poll/${pollId}` : "https://yourpoll.com/p/xyz123";
  const qrImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAD6h1Avu8A1aljHpdjV1q0Xswjwm3oOcWv7FTnmEEOoRNag-jZBKTXEvONmCF_ZW1jxovlvRLha50BcR1xAclLWsKttONzFO8MRHAwO8XhLEi3CVRwyci8t3NR4-9tORvjGq5kINhC6AW60luL8cY5BPFzcid7vaGeJ01fVCYNEQHA9EnJDSTwT5cm3tzN-Mj2yYel-TOW8Q3LXKD-EFPa76kMja_1aVVA-ZMFczh2j5pTBnEesITxQ43Ngz13ZXIS22p0z1esWfhy";

  const [copyStatus, setCopyStatus] = useState("content_copy"); // Icon state

  // --- HANDLERS ---
  const handleDone = () => {
    Swal.fire({
      icon: 'success',
      title: 'All Set!',
      text: 'Your poll has been created successfully. Redirecting to dashboard...',
      confirmButtonColor: '#137fec',
      confirmButtonText: 'Go to Dashboard'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/dashboard');
      }
    });
  };
  // 1. Handle Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(pollLink).then(() => {
      setCopyStatus("check"); // Change icon to checkmark
      
      // Show SweetAlert success notification
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: 'Poll link copied to clipboard',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      
      setTimeout(() => setCopyStatus("content_copy"), 2000); // Revert after 2s
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to copy',
        text: 'Could not copy to clipboard',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    });
  };

  // 2. Share Handlers (Opens new window)
  const openShare = (url) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareTwitter = () => openShare(`https://twitter.com/intent/tweet?text=Vote on my poll!&url=${encodeURIComponent(pollLink)}`);
  const shareFacebook = () => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollLink)}`);
  const shareTelegram = () => openShare(`https://t.me/share/url?url=${encodeURIComponent(pollLink)}&text=Check out this poll!`);
  const shareEmail = () => window.location.href = `mailto:?subject=Vote on this poll&body=Hi, check out this poll: ${pollLink}`;
  
  const handleDownloadQR = () => {
    // In a real app, you'd trigger a download of the image blob
    Swal.fire({
      icon: 'info',
      title: 'Download Started',
      text: 'Your QR code is being downloaded...',
      confirmButtonColor: '#137fec'
    });
  };

  return (
    <div className="share-page-container">
      {/* Load Material Symbols Font */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

      <div className="share-wrapper">
        
        {/* Header */}
        <div className="share-header">
          <h1>Share Your Poll</h1>
          <p>Your poll is ready! Share it to start collecting votes.</p>
        </div>

        {/* White Card */}
        <div className="share-card">
          <div className="share-grid">
            
            {/* LEFT SECTION: Link & Socials */}
            <div className="share-section-left">
              <label className="input-label">Your unique poll link</label>
              
              <div className="input-group">
                <input 
                  type="text" 
                  className="link-input" 
                  value={pollLink} 
                  readOnly 
                />
                <button className="copy-btn" onClick={handleCopy} title="Copy Link">
                  <span className="material-symbols-outlined">{copyStatus}</span>
                </button>
              </div>

              <div className="social-section">
                <h4 className="social-title">Share directly to:</h4>
                <div className="social-icons">
                  
                  {/* Twitter (X) */}
                  <button className="social-btn" onClick={shareTwitter} title="Share on Twitter">
                    <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.8.36-1.65.6-2.54.69.9-.54 1.6-1.4 1.92-2.45-.84.5-1.78.86-2.79 1.07A4.83 4.83 0 0 0 16.36 4c-2.43 0-4.4 1.97-4.4 4.4 0 .35.04.68.12 1.01-3.66-.18-6.9-1.94-9.08-4.6-.38.65-.6 1.4-.6 2.2 0 1.52.78 2.86 1.96 3.64-.72-.02-1.4-.22-2-.56v.06c0 2.12 1.5 3.88 3.5 4.28-.37.1-.76.15-1.16.15-.28 0-.55-.03-.82-.08.56 1.74 2.18 3 4.1 3.03A9.66 9.66 0 0 1 2 17.58c-1.24.8-2.65 1.28-4.14 1.28-2.5 0-4.87-1.5-4.87-3.6 0-1.8 1.4-3.2 3.1-3.2.73 0 1.4.24 1.96.65a4.3 4.3 0 0 0 3.73-1.66c.26-.52.42-1.1.42-1.72 0-.28-.03-.55-.08-.82a4.4 4.4 0 0 0-.6-1.57c-1.42-2.22-3.8-3.6-6.47-3.6-1.2 0-2.34.34-3.32.92a4.33 4.33 0 0 0-1.67 3.73c0 1.84 1.48 3.32 3.32 3.32.9 0 1.74-.36 2.34-.95.2.82.5 1.58.9 2.22a8.68 8.68 0 0 1-5.1 2.05c-.32 0-.63-.02-.94-.05C5.3 21.1 7.9 22 10.74 22c6.43 0 11.2-5.04 11.2-11.2 0-.17-.01-.34-.02-.5.7-.5 1.3-1.12 1.8-1.85z"></path>
                    </svg>
                  </button>

                  {/* Facebook */}
                  <button className="social-btn" onClick={shareFacebook} title="Share on Facebook">
                    <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88V15.5H8.31v-3.5h2.13V9.67c0-2.12 1.26-3.32 3.23-3.32.93 0 1.9.17 1.9.17v2.98h-1.5c-1.03 0-1.35.62-1.35 1.32v1.55h3.33l-.53 3.5h-2.8V21.88C18.34 21.13 22 16.99 22 12z"></path>
                    </svg>
                  </button>

                  {/* Email */}
                  <button className="social-btn" onClick={shareEmail} title="Share via Email">
                    <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.2 5.89v12.22c0 1.13-.91 2.04-2.04 2.04H3.84c-1.13 0-2.04-.91-2.04-2.04V5.89c0-1.13.91-2.04 2.04-2.04h16.32c1.13 0 2.04.91 2.04 2.04zm-3.03 1.6L12 12.35 4.83 7.49h14.34zM3.84 18.15h16.32V9.22l-8.16 5.24-8.16-5.24v8.93z"></path>
                    </svg>
                  </button>

                   {/* Telegram */}
                   <button className="social-btn" onClick={shareTelegram} title="Share on Telegram">
                    <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </button>

                </div>
              </div>
            </div>

            {/* RIGHT SECTION: QR Code */}
            <div className="share-section-right">
              <div className="qr-section">
                <p className="qr-title">Scan the QR code</p>
                
                {/* QR Image */}
                <div 
                  className="qr-image"
                  style={{ backgroundImage: `url("${qrImage}")` }}
                  role="img"
                  aria-label="Poll QR Code"
                ></div>

                <button className="download-btn" onClick={handleDownloadQR}>
                  <span className="material-symbols-outlined">download</span>
                  Download QR Code
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Action */}
        <button className="done-btn" onClick={handleDone}>
          Done
        </button>

      </div>
    </div>
  );
};

export default SharePoll;