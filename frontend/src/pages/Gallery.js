import React, { useState } from 'react';
import galleryImg1 from '../assets/images/WhatsApp Image 2025-09-14 at 16.09.08 (1).jpeg';
import galleryImg2 from '../assets/images/WhatsApp Image 2025-09-14 at 16.09.07 (1).jpeg';
import galleryImg3 from '../assets/images/WhatsApp Image 2025-09-14 at 16.09.09.jpeg';
import galleryImg4 from '../assets/images/WhatsApp Image 2025-09-14 at 16.09.06.jpeg';
import galleryImg5 from '../assets/images/light Coffee.jpeg';
import galleryImg6 from '../assets/images/lily.jpeg';

const galleryItems = [
  { src: galleryImg1, caption: '✨ Cozy fine-dining ambience with warm lighting.' },
  { src: galleryImg2, caption: '☕ Freshly brewed coffee to brighten your day.' },
  { src: galleryImg3, caption: '🍷 Elegant dinner setup perfect for family & friends.' },
  { src: galleryImg4, caption: '🍰 Homemade desserts to sweeten your dining experience.' },
  { src: galleryImg5, caption: '☕ Light Coffee – perfect brew for mornings and evenings.' },
  { src: galleryImg6, caption: '🌸 At LILY Restaurant, every dish is served with elegance and warmth.' },
];
const Gallery = () => {
  const [modal, setModal] = useState(null);
  return (
    <section className="section">
      <h1>Gallery</h1>
      <div className="gallery-images">
        {galleryItems.map((item, i) => (
          <div key={i} className="gallery-card" onClick={() => setModal(item)}>
            <img src={item.src} alt={`Gallery ${i+1}`} />
            <p className="caption">{item.caption}</p>
          </div>
        ))}
      </div>
      {modal && (
        <div className="modal" onClick={() => setModal(null)}>
          <span className="close" onClick={() => setModal(null)}>&times;</span>
          <img className="modal-content" src={modal.src} alt="Gallery" />
        </div>
      )}
    </section>
  );
};
export default Gallery;
