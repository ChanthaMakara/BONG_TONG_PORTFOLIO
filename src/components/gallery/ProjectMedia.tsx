import React, { useState } from 'react';
import type { Project } from '../../types/portfolio';
import { FramePlaceholder } from './FramePlaceholder';

type ProjectMediaProps = {
  project: Project;
  mode: 'card' | 'modal';
};

export function ProjectMedia({ project, mode }: ProjectMediaProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  if (mode === 'modal' && project.video && !videoFailed) {
    return (
      <video
        src={project.video}
        poster={project.image}
        controls
        playsInline
        preload="metadata"
        onError={() => setVideoFailed(true)}
        className="absolute inset-0 h-full w-full bg-black object-contain"
      />
    );
  }

  if (project.image && !imageFailed) {
    return (
      <img
        src={project.image}
        draggable={false}
        loading={mode === 'card' ? 'lazy' : 'eager'}
        decoding="async"
        onError={() => setImageFailed(true)}
        className={`absolute inset-0 h-full w-full select-none ${
          mode === 'modal' ? 'bg-black object-contain' : 'object-cover'
        }`}
      />
    );
  }

  return <FramePlaceholder kind={project.video ? 'video' : 'image'} />;
}