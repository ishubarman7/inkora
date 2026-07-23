'use client';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

const CSS = `
.rte-img-outer { display: block; line-height: 0; }
.rte-img-sizer { display: block; position: relative; max-width: 100%; line-height: 0; }
.rte-img-sizer img { display: block; width: 100%; transition: filter .2s, border-radius .2s, box-shadow .2s, transform .2s; }

.rte-rsz {
  position: absolute; width: 10px; height: 10px;
  background: #0b57d0; border: 2px solid #fff; border-radius: 2px;
  z-index: 20; box-shadow: 0 1px 4px rgba(0,0,0,.35); user-select: none;
}
.rte-rsz-nw { top:-5px;  left:-5px;  cursor:nw-resize; }
.rte-rsz-n  { top:-5px;  left:calc(50% - 5px); cursor:n-resize; }
.rte-rsz-ne { top:-5px;  right:-5px; cursor:ne-resize; }
.rte-rsz-e  { top:calc(50% - 5px); right:-5px; cursor:e-resize; }
.rte-rsz-se { bottom:-5px; right:-5px; cursor:se-resize; }
.rte-rsz-s  { bottom:-5px; left:calc(50% - 5px); cursor:s-resize; }
.rte-rsz-sw { bottom:-5px; left:-5px;  cursor:sw-resize; }
.rte-rsz-w  { top:calc(50% - 5px); left:-5px; cursor:w-resize; }
.rte-rsz-badge {
  position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
  background:rgba(11,87,208,.85); color:#fff; font-size:11px; font-weight:700;
  padding:2px 9px; border-radius:10px; pointer-events:none;
  white-space:nowrap; font-family:monospace; z-index:21;
}

.rte-img-toolbar-btn {
  background: transparent; border: none; border-radius: 6px;
  color: #e8eaed; cursor: pointer; display: inline-flex;
  align-items: center; justify-content: center; padding: 6px;
  transition: all 0.15s ease;
}
.rte-img-toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}
.rte-img-toolbar-btn:active {
  transform: scale(0.92);
}

/* Crop Modal styles */
.rte-crop-overlay {
  position: fixed; inset: 0; background: rgba(11, 13, 19, 0.65);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  z-index: 10000; display: flex; align-items: center; justify-content: center;
}
.rte-crop-modal {
  background: #161922; border: 1px solid #272b35; border-radius: 16px;
  width: 90%; max-width: 580px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  display: flex; flex-direction: column; overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}
.rte-crop-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid #272b35; background: #1a1e28;
}
.rte-crop-title {
  color: #e8ebf3; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px;
}
.rte-crop-close {
  background: transparent; border: none; color: #9ba2b0; cursor: pointer; font-size: 18px;
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; transition: background 0.15s;
}
.rte-crop-close:hover {
  background: rgba(255,255,255,0.08); color: #fff;
}
.rte-crop-body {
  padding: 20px; display: flex; flex-direction: column; gap: 16px; align-items: center;
  background: #12151e;
}
.rte-crop-img-area {
  position: relative; max-width: 100%; max-height: 320px;
  background: #0f1219; border: 1.5px dashed #272b35; border-radius: 8px;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
  user-select: none;
}
.rte-crop-mask {
  position: absolute; inset: 0; background: rgba(11, 13, 19, 0.45); pointer-events: none;
}
.rte-crop-box {
  position: absolute; border: 2.5px solid #3b82f6; box-shadow: 0 0 0 9999px rgba(11, 13, 19, 0.5);
  cursor: move; box-sizing: border-box;
}

.rte-crop-handle-corner {
  position: absolute; width: 12px; height: 12px; border: 3px solid #3b82f6; z-index: 10;
}
.rte-crop-handle-tl { top: -3px; left: -3px; border-right: none; border-bottom: none; }
.rte-crop-handle-tr { top: -3px; right: -3px; border-left: none; border-bottom: none; }
.rte-crop-handle-bl { bottom: -3px; left: -3px; border-right: none; border-top: none; }
.rte-crop-handle-br { bottom: -3px; right: -3px; border-left: none; border-top: none; cursor: se-resize; }

.rte-crop-ratio-bar {
  display: flex; gap: 6px; background: #1a1e28; padding: 4px; border-radius: 10px; border: 1px solid #272b35;
}
.rte-crop-ratio-btn {
  background: transparent; border: none; color: #9ba2b0; font-size: 12px; font-weight: 500;
  padding: 6px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
}
.rte-crop-ratio-btn:hover {
  color: #e8ebf3; background: rgba(255,255,255,0.04);
}
.rte-crop-ratio-btn.active {
  background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
}

.rte-crop-footer {
  display: flex; justify-content: flex-end; gap: 12px; padding: 12px 20px;
  border-top: 1px solid #272b35; background: #1a1e28;
}
.rte-crop-btn-cancel {
  background: transparent; border: none; color: #9ba2b0; font-size: 13.5px; font-weight: 500;
  padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: background 0.15s;
}
.rte-crop-btn-cancel:hover {
  background: rgba(255,255,255,0.06); color: #e8ebf3;
}
.rte-crop-btn-apply {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8); border: none; color: #fff;
  font-size: 13.5px; font-weight: 600; padding: 8px 18px; border-radius: 8px;
  cursor: pointer; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.22);
  transition: all 0.2s;
}
.rte-crop-btn-apply:hover {
  transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.32);
}
`;

function buildImgStyle(attrs) {
  const { shape, frame, filters, rotate, flipX, flipY } = attrs;
  const style = { display: 'block', width: '100%', height: 'auto', transition: 'transform .2s' };

  if (shape === 'rounded') {
    style.borderRadius = '14px';
  } else if (shape === 'pill') {
    style.borderRadius = '999px';
  } else if (shape === 'circle') {
    style.borderRadius = '50%'; style.aspectRatio = '1/1'; style.objectFit = 'cover';
  } else if (shape === 'square') {
    style.aspectRatio = '1/1'; style.objectFit = 'cover';
  } else if (shape === 'landscape') {
    style.aspectRatio = '16/9'; style.objectFit = 'cover';
  } else if (shape === 'portrait') {
    style.aspectRatio = '3/4'; style.objectFit = 'cover';
  }

  if (frame === 'shadow') { style.boxShadow = '0 6px 28px rgba(0,0,0,.22)'; }
  else if (frame === 'border') { style.boxShadow = '0 0 0 3px #e4e7eb'; if (!style.borderRadius) style.borderRadius = '4px'; }
  else if (frame === 'thick') { style.boxShadow = '0 0 0 7px #e4e7eb'; if (!style.borderRadius) style.borderRadius = '4px'; }
  else if (frame === 'glow') { style.boxShadow = '0 0 0 3px #0b57d0, 0 0 22px rgba(11,87,208,.32)'; }
  else if (frame === 'vintage') { style.boxShadow = '0 0 0 5px #c8a96e, 0 4px 14px rgba(0,0,0,.22)'; }
  else if (frame === 'dark') { style.boxShadow = '0 0 0 4px #202124'; if (!style.borderRadius) style.borderRadius = '4px'; }

  const f = filters ? filters.split(',').filter(Boolean) : [];
  const parts = [];
  if (f.includes('invert')) parts.push('invert(1)');
  if (f.includes('grayscale')) parts.push('grayscale(1)');
  if (f.includes('sepia')) parts.push('sepia(0.75)');
  if (f.includes('blur')) parts.push('blur(2px)');
  if (f.includes('bright')) parts.push('brightness(1.35)');
  if (f.includes('contrast')) parts.push('contrast(1.4)');
  if (parts.length) style.filter = parts.join(' ');

  // Rotation and reflection transforms
  const transformParts = [];
  if (rotate) transformParts.push(`rotate(${rotate}deg)`);
  if (flipX) transformParts.push('scaleX(-1)');
  if (flipY) transformParts.push('scaleY(-1)');
  if (transformParts.length) {
    style.transform = transformParts.join(' ');
  }

  return style;
}

const HANDLES = [
  { cls: 'nw', side: 'w' }, { cls: 'n',  side: 'e' }, { cls: 'ne', side: 'e' },
  { cls: 'e',  side: 'e' }, { cls: 'se', side: 'e' }, { cls: 's',  side: 'e' },
  { cls: 'sw', side: 'w' }, { cls: 'w',  side: 'w' },
];

export function ImageNodeView({ node, updateAttributes, selected, editor }) {
  const [liveWidth, setLiveWidth] = useState(null);
  const [pendingWidth, setPendingWidth] = useState(null);
  const wrapRef = useRef(null);
  const attrs = node.attrs;
  const isEditable = editor?.isEditable ?? true;
  const showSelected = selected && isEditable;

  // Cropping state
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const [cropRatio, setCropRatio] = useState('free'); // 'free' | 'square' | 'standard'
  const cropImgRef = useRef(null);

  // Dynamic Floating Toolbar styling state to prevent overflow cutting
  const [toolbarStyle, setToolbarStyle] = useState({
    position: 'absolute',
    top: '-45px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(30, 31, 35, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    zIndex: 100,
    boxShadow: '0 4px 18px rgba(0,0,0,.35)',
    backdropFilter: 'blur(8px)',
  });

  useEffect(() => {
    if (pendingWidth !== null && attrs.width === pendingWidth) setPendingWidth(null);
  }, [attrs.width, pendingWidth]);

  useLayoutEffect(() => {
    if (!showSelected || !wrapRef.current) return;

    const updatePosition = () => {
      if (!wrapRef.current) return;
      const el = wrapRef.current;
      const scrollEl = el.closest('.rte-scroll-container') || document.body;
      
      const rectImg = el.getBoundingClientRect();
      const rectScroll = scrollEl.getBoundingClientRect();

      const newStyle = {
        position: 'absolute',
        zIndex: 100,
        background: 'rgba(30, 31, 35, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '8px',
        padding: '4px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        boxShadow: '0 4px 18px rgba(0,0,0,.35)',
        backdropFilter: 'blur(8px)',
      };

      // 1. Vertical placement: if top edge of image is too close to top of scroll viewport, put toolbar below
      const spaceAbove = rectImg.top - rectScroll.top;
      if (spaceAbove < 55) {
        newStyle.top = 'auto';
        newStyle.bottom = '-45px';
      } else {
        newStyle.top = '-45px';
        newStyle.bottom = 'auto';
      }

      // 2. Horizontal placement: shift left/right if centering would overflow scroll viewport bounds
      const imgCenter = rectImg.left + rectImg.width / 2;
      const toolbarHalfWidth = 120; // 240px total toolbar width / 2
      
      if (imgCenter - toolbarHalfWidth < rectScroll.left + 10) {
        newStyle.left = '0';
        newStyle.right = 'auto';
        newStyle.transform = 'none';
      } else if (imgCenter + toolbarHalfWidth > rectScroll.right - 10) {
        newStyle.left = 'auto';
        newStyle.right = '0';
        newStyle.transform = 'none';
      } else {
        newStyle.left = '50%';
        newStyle.right = 'auto';
        newStyle.transform = 'translateX(-50%)';
      }

      setToolbarStyle(newStyle);
    };

    updatePosition();

    // Set up viewport scroll/resize event listeners to reposition when viewports change
    const scrollEl = wrapRef.current.closest('.rte-scroll-container') || window;
    const isWindow = scrollEl === window;
    
    if (isWindow) {
      window.addEventListener('scroll', updatePosition, { passive: true });
    } else {
      scrollEl.addEventListener('scroll', updatePosition, { passive: true });
    }
    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      if (isWindow) {
        window.removeEventListener('scroll', updatePosition);
      } else {
        scrollEl.removeEventListener('scroll', updatePosition);
      }
      window.removeEventListener('resize', updatePosition);
    };
  }, [showSelected, attrs.align, attrs.width, liveWidth, pendingWidth]);

  const onResizeStart = (e, side) => {
    e.preventDefault(); e.stopPropagation();
    const el = wrapRef.current;
    if (!el) return;
    const startX = e.clientX;
    const startW = el.getBoundingClientRect().width;
    const containerW = el.parentElement?.getBoundingClientRect().width || startW;
    const onMove = (ev) => {
      const newW = Math.max(40, Math.min(containerW, startW + (side === 'w' ? -(ev.clientX - startX) : (ev.clientX - startX))));
      setLiveWidth(Math.round(newW));
      el.style.width = `${Math.round(newW)}px`;
    };
    const onUp = (ev) => {
      const newW = Math.max(40, Math.min(containerW, startW + (side === 'w' ? -(ev.clientX - startX) : (ev.clientX - startX))));
      const pct = `${Math.max(5, Math.min(100, Math.round((newW / containerW) * 100)))}%`;
      el.style.width = '';
      setLiveWidth(null);
      setPendingWidth(pct);
      updateAttributes({ width: pct });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = side === 'w' ? 'w-resize' : 'e-resize';
    document.body.style.userSelect = 'none';
  };

  const getImgDimensions = () => {
    if (!cropImgRef.current) return { width: 1, height: 1 };
    return {
      width: cropImgRef.current.clientWidth || 1,
      height: cropImgRef.current.clientHeight || 1
    };
  };

  const handleCropBoxDragStart = (e) => {
    e.preventDefault(); e.stopPropagation();
    const dims = getImgDimensions();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = crop.x;
    const initialY = crop.y;

    const onMouseMove = (ev) => {
      const deltaX = ((ev.clientX - startX) / dims.width) * 100;
      const deltaY = ((ev.clientY - startY) / dims.height) * 100;
      
      setCrop(prev => ({
        ...prev,
        x: Math.max(0, Math.min(100 - prev.w, initialX + deltaX)),
        y: Math.max(0, Math.min(100 - prev.h, initialY + deltaY))
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleCropResizeStart = (e) => {
    e.preventDefault(); e.stopPropagation();
    const dims = getImgDimensions();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialW = crop.w;
    const initialH = crop.h;

    const onMouseMove = (ev) => {
      const deltaW = ((ev.clientX - startX) / dims.width) * 100;
      const deltaH = ((ev.clientY - startY) / dims.height) * 100;

      let newW = Math.max(10, Math.min(100 - crop.x, initialW + deltaW));
      let newH = crop.h;

      if (cropRatio === 'square') {
        const aspectFactor = dims.width / dims.height;
        newH = newW * aspectFactor;
        if (crop.y + newH > 100) {
          newH = 100 - crop.y;
          newW = newH / aspectFactor;
        }
      } else if (cropRatio === 'standard') {
        const aspectFactor = (dims.width / dims.height) * (9 / 16);
        newH = newW * aspectFactor;
        if (crop.y + newH > 100) {
          newH = 100 - crop.y;
          newW = newH / aspectFactor;
        }
      } else {
        newH = Math.max(10, Math.min(100 - crop.y, initialH + deltaH));
      }

      setCrop(prev => ({
        ...prev,
        w: newW,
        h: newH
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const setRatioMode = (mode) => {
    setCropRatio(mode);
    const dims = getImgDimensions();
    if (mode === 'square') {
      const aspectFactor = dims.width / dims.height;
      const newH = Math.min(100 - crop.y, crop.w * aspectFactor);
      setCrop(prev => ({ ...prev, h: newH }));
    } else if (mode === 'standard') {
      const aspectFactor = (dims.width / dims.height) * (9 / 16);
      const newH = Math.min(100 - crop.y, crop.w * aspectFactor);
      setCrop(prev => ({ ...prev, h: newH }));
    }
  };

  const handleApplyCrop = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = attrs.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      const targetX = (crop.x / 100) * naturalWidth;
      const targetY = (crop.y / 100) * naturalHeight;
      const targetW = (crop.w / 100) * naturalWidth;
      const targetH = (crop.h / 100) * naturalHeight;

      canvas.width = targetW;
      canvas.height = targetH;
      ctx.drawImage(img, targetX, targetY, targetW, targetH, 0, 0, targetW, targetH);

      const croppedDataUrl = canvas.toDataURL('image/png');
      updateAttributes({ src: croppedDataUrl, width: '100px' });
      setIsCropping(false);
    };
  };

  const sizerWidth = liveWidth !== null ? `${liveWidth}px` : pendingWidth !== null ? pendingWidth : (attrs.width || '100px');
  const align = attrs.align || 'left';
  const alignStyle = align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' }
    : align === 'right'  ? { marginLeft: 'auto', marginRight: 0 }
    : {};

  return (
    <NodeViewWrapper className="rte-img-outer">
      <style>{CSS}</style>
      <div ref={wrapRef} className="rte-img-sizer" style={{ width: sizerWidth, ...alignStyle }}>
        <img
          src={attrs.src} alt={attrs.alt || ''} title={attrs.title || ''}
          style={{ ...buildImgStyle(attrs), outline: showSelected ? '2.5px solid #0b57d0' : 'none', outlineOffset: '2px' }}
          draggable={false}
        />
        {showSelected && (
          <>
            {HANDLES.map(h => (
              <div key={h.cls} className={`rte-rsz rte-rsz-${h.cls}`} onMouseDown={e => onResizeStart(e, h.side)} />
            ))}
            {liveWidth !== null && <div className="rte-rsz-badge">{liveWidth}px</div>}
          </>
        )}

        {/* Floating Image Action Toolbar */}
        {showSelected && (
          <div
            className="rte-img-toolbar"
            contentEditable={false}
            style={toolbarStyle}
            onMouseDown={e => e.stopPropagation()}
          >
            <button
              className="rte-img-toolbar-btn"
              onClick={() => updateAttributes({ rotate: ((attrs.rotate || 0) - 90) % 360 })}
              title="Rotate Counter-Clockwise"
              type="button"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <polyline points="3 3 3 8 8 8"/>
              </svg>
            </button>
            <button
              className="rte-img-toolbar-btn"
              onClick={() => updateAttributes({ rotate: ((attrs.rotate || 0) + 90) % 360 })}
              title="Rotate Clockwise"
              type="button"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <polyline points="21 3 21 8 16 8"/>
              </svg>
            </button>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
            <button
              className="rte-img-toolbar-btn"
              onClick={() => updateAttributes({ flipX: !attrs.flipX })}
              title="Flip Horizontal"
              type="button"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2v20M20 8l-4 4 4 4M4 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="rte-img-toolbar-btn"
              onClick={() => updateAttributes({ flipY: !attrs.flipY })}
              title="Flip Vertical"
              type="button"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M2 12h20M8 20l4-4 4 4M8 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
            <button
              className="rte-img-toolbar-btn"
              onClick={() => {
                setCrop({ x: 15, y: 15, w: 70, h: 70 });
                setCropRatio('free');
                setIsCropping(true);
              }}
              title="Crop Image"
              style={{
                background: '#0b57d0',
                color: '#ffffff',
                fontWeight: '600',
                padding: '4px 8px',
              }}
              type="button"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2v14a2 2 0 0 0 2 2h14"/>
                <path d="M18 22V8a2 2 0 0 0-2-2H2"/>
              </svg>
              <span style={{ fontSize: 11, marginLeft: 4 }}>Crop</span>
            </button>
          </div>
        )}
      </div>

      {/* Crop Overlay Modal */}
      {isCropping && (
        <div className="rte-crop-overlay" onMouseDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
          <div className="rte-crop-modal" contentEditable={false}>
            <div className="rte-crop-header">
              <div className="rte-crop-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2v14a2 2 0 0 0 2 2h14"/>
                  <path d="M18 22V8a2 2 0 0 0-2-2H2"/>
                </svg>
                Crop Image
              </div>
              <button className="rte-crop-close" onClick={() => setIsCropping(false)} type="button">✕</button>
            </div>
            
            <div className="rte-crop-body">
              <div className="rte-crop-img-area">
                <img
                  ref={cropImgRef}
                  src={attrs.src}
                  alt="Crop preview"
                  style={{ maxWidth: '100%', maxHeight: '280px', display: 'block' }}
                  draggable={false}
                />
                <div className="rte-crop-mask" />
                <div
                  className="rte-crop-box"
                  style={{
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    width: `${crop.w}%`,
                    height: `${crop.h}%`
                  }}
                  onMouseDown={handleCropBoxDragStart}
                >
                  <div className="rte-crop-handle-corner rte-crop-handle-tl" />
                  <div className="rte-crop-handle-corner rte-crop-handle-tr" />
                  <div className="rte-crop-handle-corner rte-crop-handle-bl" />
                  <div
                    className="rte-crop-handle-corner rte-crop-handle-br"
                    onMouseDown={handleCropResizeStart}
                  />
                </div>
              </div>

              {/* Aspect Ratio Selector Bar */}
              <div className="rte-crop-ratio-bar">
                <button
                  className={`rte-crop-ratio-btn ${cropRatio === 'free' ? 'active' : ''}`}
                  onClick={() => setRatioMode('free')}
                  type="button"
                >
                  Free
                </button>
                <button
                  className={`rte-crop-ratio-btn ${cropRatio === 'square' ? 'active' : ''}`}
                  onClick={() => setRatioMode('square')}
                  type="button"
                >
                  Square (1:1)
                </button>
                <button
                  className={`rte-crop-ratio-btn ${cropRatio === 'standard' ? 'active' : ''}`}
                  onClick={() => setRatioMode('standard')}
                  type="button"
                >
                  Standard (16:9)
                </button>
              </div>
            </div>

            <div className="rte-crop-footer">
              <button className="rte-crop-btn-cancel" onClick={() => setIsCropping(false)} type="button">Cancel</button>
              <button className="rte-crop-btn-apply" onClick={handleApplyCrop} type="button">Apply Crop</button>
            </div>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
}
