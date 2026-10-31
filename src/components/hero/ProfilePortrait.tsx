import React, { useState } from 'react';
import { media } from '../../data/media';

type ProfilePortraitProps = {
  className?: string;
};

/**
 * Shows /images/profile.jpg. Until that file exists, crops the portrait
 * directly from the uploaded CV so the real face is always shown.
 * Container should be 4:5.
 */
export function ProfilePortrait({ className = '' }: ProfilePortraitProps) {
  const [failed, setFailed] = useState(false);
  const alt = 'Portrait of Piseth Maratong';

  return (
    <div className={`relative overflow-hidden bg-navy ${className}`}>
      {!failed ?
      <img
        src={media.profile}
        alt={alt}
        onError={() => setFailed(true)}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-top" /> :


      <img
        src={media.cvSource}
        alt={alt}
        draggable={false}
        className="absolute top-0 max-w-none select-none"
        style={{ width: '340%', left: '-12.5%' }} />

      }
    </div>);

}