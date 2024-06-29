import { useState } from "react";
import images from '../data/images.json';

export const ImageSlider = () => {
    const [imageIndex, setImageIndex] = useState(0);

    return (
        <div className="slider-wrapper">
            <div className="img-slider-wrapper">
                {images.map(({ url, title, desc }, index) => (
                    <div key={url} className="img-slider" style={{ translate: `${ -100 * imageIndex}%` }}>
                        <figure className="img">
                            <img src={url} alt={title} aria-hidden={imageIndex !== index} />
                        </figure>
                        <div className="slider-content">
                            <h2>{title}</h2>
                            <p>{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="img-slider-dot-wrapper">
                {images.map((_, index) => (
                    <button 
                        key={index}
                        onClick={() => setImageIndex(index)}
                        aria-label={`View Image ${index + 1}`}
                        className={`img-slider-dot ${index === imageIndex ? 'active' : ''}`}
                    >
                        {index}
                    </button>
                ))}
            </div>
        </div>
    )
}