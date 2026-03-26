import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import QueueItem from './QueueItem';

export default function Queue({ queue, currentSong, singers, onRemove, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = queue.findIndex((item) => item.id === active.id);
      const newIndex = queue.findIndex((item) => item.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <div className="cyber-panel" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0,
    }}>
      <div className="section-header" style={{ color: 'var(--neon-orange)', borderBottomColor: 'rgba(255,102,0,0.2)' }}>
        <span className="indicator" style={{ background: 'var(--neon-orange)', boxShadow: 'var(--glow-orange)', animation: queue.length > 0 ? 'neon-pulse 2s infinite' : 'none' }} />
        QUEUE
        <span style={{
          marginLeft: 'auto',
          fontSize: '10px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          [{queue.length}]
        </span>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
      }}>
        {queue.length === 0 && !currentSong && (
          <div style={{
            textAlign: 'center',
            padding: '24px 16px',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            lineHeight: '1.8',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
            Queue is empty.<br />
            Search for songs or hit<br />
            RANDOM to fill it up.
          </div>
        )}

        {currentSong && (
          <div style={{
            padding: '8px',
            borderBottom: '1px solid rgba(0,255,255,0.15)',
            marginBottom: '4px',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '8px',
              letterSpacing: '2px',
              color: 'var(--neon-cyan)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--neon-cyan)',
                boxShadow: 'var(--glow-cyan)',
                animation: 'neon-pulse 1s infinite',
              }} />
              NOW PLAYING
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px',
              background: 'rgba(0,255,255,0.06)',
              border: '1px solid rgba(0,255,255,0.3)',
              boxShadow: '0 0 10px rgba(0,255,255,0.1)',
            }}>
              {currentSong.thumbnail ? (
                <img
                  src={currentSong.thumbnail}
                  alt=""
                  style={{ width: '40px', height: '30px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(0,255,255,0.3)' }}
                />
              ) : (
                <div style={{ width: '40px', height: '30px', background: 'rgba(0,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                  🎵
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="truncate" style={{ fontSize: '11px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {currentSong.title}
                </div>
                {currentSong.singer && (
                  <div style={{ fontSize: '10px', color: currentSong.singer.color, fontFamily: 'var(--font-mono)' }}>
                    {currentSong.singer.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={queue.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px' }}>
              {queue.map((item) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  isActive={false}
                  singers={singers}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
