import React, { useEffect, useState } from 'react';
import { ExternalLink, Film, Play, X } from 'lucide-react';
import { View } from '../../types';
import { getSubjectConfig } from '../../data/sidebarNavigation';
import {
  getEmbedUrl,
  getSubjectPublishedVideos,
  getTopicVideo,
  GOOGLE_DRIVE_FOLDER_URL,
  TopicVideoEntry,
} from '../../data/topicVideos';

interface TopicVideoBannerProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const TopicVideoBanner: React.FC<TopicVideoBannerProps> = ({
  currentView,
  onNavigate,
}) => {
  const [activeVideo, setActiveVideo] = useState<TopicVideoEntry | null>(null);

  useEffect(() => {
    setActiveVideo(null);
  }, [currentView]);

  useEffect(() => {
    if (!activeVideo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeVideo]);

  const subjectConfig = getSubjectConfig(currentView);
  const isSubjectDashboard = Boolean(
    subjectConfig && currentView === subjectConfig.dashboardView
  );

  const topicVideo = !isSubjectDashboard ? getTopicVideo(currentView) : null;
  const dashboardVideos =
    isSubjectDashboard && subjectConfig
      ? getSubjectPublishedVideos(subjectConfig.id)
      : [];

  if (!topicVideo && dashboardVideos.length === 0) {
    return null;
  }

  const openDriveUrl = activeVideo?.driveFileId
    ? `https://drive.google.com/file/d/${activeVideo.driveFileId}/view`
    : activeVideo?.videoUrl || GOOGLE_DRIVE_FOLDER_URL;

  return (
    <>
      {topicVideo && (
        <div className="mb-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-cyan-950/50 p-4 shadow-lg shadow-cyan-950/20 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <button
                type="button"
                onClick={() => setActiveVideo(topicVideo)}
                className="shrink-0 w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer"
                aria-label={`Play ${topicVideo.title} Reel`}
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                  <Film className="w-3.5 h-3.5" />
                  <span>MICRO-LESSON REEL · {topicVideo.durationSec}s</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">SUBJ {topicVideo.subjectCode}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                  {topicVideo.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-0.5">
                  {topicVideo.examTakeaway}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveVideo(topicVideo)}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Watch Reel
            </button>
          </div>
        </div>
      )}

      {isSubjectDashboard && dashboardVideos.length > 0 && (
        <div className="mb-6 rounded-2xl border border-cyan-500/25 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                {subjectConfig?.title} Micro-Lesson Reels ({dashboardVideos.length})
              </span>
            </div>
            <a
              href={GOOGLE_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-cyan-300 transition-colors"
            >
              Drive Library <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {dashboardVideos.map((vid) => (
              <div
                key={vid.view}
                className="shrink-0 w-72 rounded-xl border border-white/10 bg-slate-950/90 p-3.5 flex flex-col justify-between gap-3 hover:border-cyan-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase">
                    <span>REEL · {vid.durationSec}s</span>
                    <span>BATCH {vid.dayBatch}</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1 line-clamp-1">
                    {vid.title}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {vid.examTakeaway}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(vid)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" /> Watch
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate(vid.view)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer transition-colors"
                  >
                    Open Topic
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeVideo && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-md flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white px-1">
              <div className="min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                  SUBJ {activeVideo.subjectCode} · {activeVideo.durationSec}s REEL
                </div>
                <div className="text-sm font-bold truncate">{activeVideo.title}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={openDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  Open in Drive <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  aria-label="Close video player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full max-h-[82vh] aspect-[9/16] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
              {activeVideo.videoUrl?.trim() ? (
                <video
                  controls
                  playsInline
                  autoPlay
                  src={activeVideo.videoUrl}
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={getEmbedUrl(activeVideo)}
                  title={activeVideo.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopicVideoBanner;
