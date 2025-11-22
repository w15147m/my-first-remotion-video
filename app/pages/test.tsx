import React, { useState, useRef, useEffect } from 'react';

function useTilt(animationDuration = '150ms') {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const unify = (e) => (e.changedTouches ? e.changedTouches[0] : e);

    const state = {
      rect: undefined,
      mouseX: undefined,
      mouseY: undefined,
    };

    let el = ref.current;

    const handleEnterEvent = () => {
      el.style.transition = `transform ${animationDuration} ease-out`;
    };

    const handleMoveEvent = (e) => {
      e.preventDefault();

      if (!el) {
        return;
      }
      if (!state.rect) {
        state.rect = el.getBoundingClientRect();
      }
      state.mouseX = unify(e).clientX;
      state.mouseY = unify(e).clientY;

      const px = (state.mouseX - state.rect.left) / state.rect.width;
      const py = (state.mouseY - state.rect.top) / state.rect.height;

      el.style.setProperty('--px', px.toFixed(2));
      el.style.setProperty('--py', py.toFixed(2));
    };

    const handleEndEvent = () => {
      el.style.setProperty('--px', '0.5');
      el.style.setProperty('--py', '0.5');
      el.style.transition = `transform ${animationDuration} ease-in`;
    };

    el.addEventListener('mouseenter', handleEnterEvent);
    el.addEventListener('mousemove', handleMoveEvent);
    el.addEventListener('mouseleave', handleEndEvent);
    el.addEventListener('touchstart', handleEnterEvent);
    el.addEventListener('touchmove', handleMoveEvent);
    el.addEventListener('touchend', handleEndEvent);

    return () => {
      el.removeEventListener('mouseenter', handleEnterEvent);
      el.removeEventListener('mousemove', handleMoveEvent);
      el.removeEventListener('mouseleave', handleEndEvent);
      el.removeEventListener('touchstart', handleEnterEvent);
      el.removeEventListener('touchmove', handleMoveEvent);
      el.removeEventListener('touchend', handleEndEvent);
    };
  }, [animationDuration]);

  return ref;
}

const Slide = ({ image, title, subtitle, description, offset, isPageBackground }) => {
  const active = offset === 0;
  const ref = useTilt(active ? '150ms' : null);
  const dir = offset === 0 ? 0 : offset > 0 ? 1 : -1;

  return (
    <div
      className="slide"
      data-active={active || null}
      style={{
        '--offset': offset,
        '--dir': dir,
        '--px': 0.5,
        '--py': 0.5,
        position: 'relative',
        gridArea: '1 / -1',
        zIndex: active ? 2 : 1,
        pointerEvents: active ? 'auto' : 'none',
      }}
    >
      {isPageBackground && (
        <div
          className="slideBackground"
          style={{
            backgroundImage: `url('${image}')`,
            position: 'fixed',
            top: 0,
            left: '-10%',
            right: '-10%',
            bottom: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            zIndex: -1,
            opacity: active ? 0.1 : 0,
            transition: 'opacity 0.3s linear, transform 0.3s ease-in-out',
            pointerEvents: 'none',
            transform: active ? 'none' : `translateX(calc(10% * ${dir}))`,
          }}
        />
      )}
      <div
        ref={ref}
        className="slideContent"
        style={{
          width: '250px',
          height: '300px',
          backgroundImage: `url('${image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          transition: active ? 'none' : 'transform 0.5s ease-in-out',
          opacity: active ? 1 : 0.7,
          display: 'grid',
          alignContent: 'center',
          transformStyle: 'preserve-3d',
          transform: active
            ? 'perspective(1000px) translateX(calc(100% * var(--offset)))'
            : `perspective(1000px) translateX(calc(100% * ${offset})) rotateY(calc(-45deg * ${dir}))`,
          borderRadius: '15px',
        }}
        onMouseMove={(e) => {
          if (active) {
            const el = e.currentTarget;
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform = `perspective(1000px) rotateY(${x * 45}deg) rotateX(${y * -45}deg)`;
            el.style.transition = 'none';
          }
        }}
        onMouseLeave={(e) => {
          if (active) {
            e.currentTarget.style.transform = 'perspective(1000px) translateX(calc(100% * var(--offset)))';
            e.currentTarget.style.transition = 'transform 0.5s ease-in-out';
          }
        }}
      >
        <div
          className="slideContentInner"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(2rem)',
            transition: 'opacity 0.3s linear',
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
            opacity: active ? 1 : 0,
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          {title && (
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'normal',
                letterSpacing: '0.2ch',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <h3
              style={{
                fontSize: '2rem',
                fontWeight: 'normal',
                letterSpacing: '0.2ch',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              — {subtitle}
            </h3>
          )}
          {description && (
            <p
              style={{
                margin: 0,
                fontSize: '0.8rem',
                letterSpacing: '0.2ch',
                marginTop: '0.5rem',
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Carousel = ({ slides, isPageBackground, autoScrollInterval = 2000 }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [slides.length, autoScrollInterval, isPaused]);

  const handlePrevSlide = () => {
    setSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section 
      style={{
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        width: '100%',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        style={{
          display: 'grid',
          position: 'relative',
          width: '100%',
          maxWidth: '1170px',
          placeItems: 'center',
        }}
      >
        <button
          onClick={handlePrevSlide}
          style={{
            appearance: 'none',
            background: 'transparent',
            border: 'none',
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
            position: 'absolute',
            fontSize: '3rem',
            width: '5rem',
            height: '5rem',
            top: '30%',
            left: '-10%',
            transition: 'opacity 0.3s',
            opacity: 0.7,
            zIndex: 5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          ‹
        </button>

        {[...slides, ...slides, ...slides].map((slide, i) => {
          let offset = slides.length + (slideIndex - i);

          return (
            <Slide
              image={slide.image}
              title={slide.title}
              subtitle={slide.subtitle}
              description={slide.description}
              offset={offset}
              isPageBackground={isPageBackground}
              key={i}
            />
          );
        })}

        <button
          onClick={handleNextSlide}
          style={{
            appearance: 'none',
            background: 'transparent',
            border: 'none',
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
            position: 'absolute',
            fontSize: '3rem',
            width: '5rem',
            height: '5rem',
            top: '30%',
            right: '-10%',
            transition: 'opacity 0.3s',
            opacity: 0.7,
            zIndex: 5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          ›
        </button>

        {/* Auto-scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setSlideIndex(index)}
              style={{
                width: slideIndex === index ? '30px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                background: slideIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Pause/Play indicator */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: 'white',
            fontSize: '0.8rem',
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          {isPaused ? '⏸' : '▶'} {isPaused ? 'Paused' : 'Auto-scrolling'}
        </div>
      </div>
    </section>
  );
};

const slides = [
  {
    id: 1,
    title: 'First',
    subtitle: 'slide',
    description: 'Praesent ac sem eget est.',
    image: 'https://picsum.photos/id/1/500/500',
  },
  {
    id: 2,
    title: 'Second',
    subtitle: 'slide',
    description: 'Praesent ac sem eget est.',
    image: 'https://picsum.photos/id/234/500/500',
  },
  {
    id: 3,
    title: 'Third',
    subtitle: 'slide',
    description: 'Praesent ac sem eget est.',
    image: 'https://picsum.photos/id/790/500/500',
  },
  {
    id: 4,
    title: 'Fourth',
    subtitle: 'slide',
    description: 'Beautiful mountain scenery.',
    image: 'https://picsum.photos/id/10/500/500',
  },
  {
    id: 5,
    title: 'Fifth',
    subtitle: 'slide',
    description: 'Amazing landscape views.',
    image: 'https://picsum.photos/id/20/500/500',
  },
  {
    id: 6,
    title: 'Sixth',
    subtitle: 'slide',
    description: 'Serene lakeside view.',
    image: 'https://picsum.photos/id/30/500/500',
  },
  {
    id: 7,
    title: 'Seventh',
    subtitle: 'slide',
    description: 'Golden sunset over hills.',
    image: 'https://picsum.photos/id/40/500/500',
  },
  {
    id: 8,
    title: 'Eighth',
    subtitle: 'slide',
    description: 'Lush green forest path.',
    image: 'https://picsum.photos/id/50/500/500',
  },
  {
    id: 9,
    title: 'Ninth',
    subtitle: 'slide',
    description: 'Calm beach with waves.',
    image: 'https://picsum.photos/id/60/500/500',
  },
  {
    id: 10,
    title: 'Tenth',
    subtitle: 'slide',
    description: 'Snow-covered mountain peaks.',
    image: 'https://picsum.photos/id/70/500/500',
  },
  {
    id: 11,
    title: 'Eleventh',
    subtitle: 'slide',
    description: 'Vibrant city skyline.',
    image: 'https://picsum.photos/id/80/500/500',
  },
  {
    id: 12,
    title: 'Twelfth',
    subtitle: 'slide',
    description: 'Peaceful countryside.',
    image: 'https://picsum.photos/id/90/500/500',
  },
  {
    id: 13,
    title: 'Thirteenth',
    subtitle: 'slide',
    description: 'Misty morning forest.',
    image: 'https://picsum.photos/id/100/500/500',
  },
  {
    id: 14,
    title: 'Fourteenth',
    subtitle: 'slide',
    description: 'Desert dunes and sky.',
    image: 'https://picsum.photos/id/110/500/500',
  },
  {
    id: 15,
    title: 'Fifteenth',
    subtitle: 'slide',
    description: 'Colorful autumn trees.',
    image: 'https://picsum.photos/id/120/500/500',
  },
];


export default function App() {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      <Carousel slides={slides} isPageBackground autoScrollInterval={2000} />
    </div>
  );
}