import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function QueueItem({ item, isActive, singers, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const singerColor = item.singer?.color || 'var(--text-muted)';

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 8px',
        background: isActive
          ? 'rgba(0,255,255,0.08)'
          : isDragging
          ? 'rgba(255,0,255,0.1)'
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isActive ? 'rgba(0,255,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isActive ? '0 0 12px rgba(0,255,255,0.2)' : 'none',
        cursor: isDragging ? 'grabbing' : 'default',
        position: 'relative',
        transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Now playing indicator */}
      {isActive && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: 'var(--neon-cyan)',
          boxShadow: 'var(--glow-cyan)',
          animation: 'neon-pulse 1s infinite',
        }} />
      )}

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          color: 'var(--text-muted)',
          fontSize: '14px',
          padding: '0 2px',
          flexShrink: 0,
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
        title="Drag to reorder"
      >
        ⠿
      </div>

      {/* Thumbnail */}
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt=""
          style={{
            width: '46px',
            height: '34px',
            objectFit: 'cover',
            flexShrink: 0,
            border: `1px solid ${isActive ? 'rgba(0,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
          }}
        />
      ) : (
        <div style={{
          width: '46px',
          height: '34px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          flexShrink: 0,
        }}>
          {item.isRandom ? '⚡' : '🎵'}
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="truncate" style={{
          fontSize: '11px',
          color: isActive ? 'var(--neon-cyan)' : 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          lineHeight: '1.3',
          marginBottom: '2px',
        }}>
          {item.title}
          {item.isRandom && (
            <span style={{
              marginLeft: '6px',
              fontSize: '9px',
              color: 'var(--neon-orange)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '1px',
            }}>
              RANDOM
            </span>
          )}
        </div>
        {item.singer ? (
          <div style={{
            fontSize: '10px',
            color: singerColor,
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <div style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: singerColor,
              boxShadow: `0 0 4px ${singerColor}`,
              flexShrink: 0,
            }} />
            {item.singer.name}
          </div>
        ) : (
          <div style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontStyle: 'italic',
          }}>
            unassigned
          </div>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '14px',
          lineHeight: 1,
          padding: '2px 4px',
          flexShrink: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#ff3366'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        title="Remove from queue"
      >
        ×
      </button>
    </div>
  );
}
