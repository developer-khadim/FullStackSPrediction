import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Linkedin, Github, Globe } from 'lucide-react';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ProfileCardComponent = ({
  avatarUrl = 'https://via.placeholder.com/400x600',
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Javi A. Torres',
  title = 'Software Engineer',
  handle = 'javicodes',
  status = 'Online',
  showUserInfo = true,
  socialLinks = {
    linkedin: '',
    github: '',
    website: ''
  }
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId = null;
    let running = false;
    let lastTs = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x, y) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;
      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`
      };

      for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
    };

    const step = ts => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x, y) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x, y) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      }
    };
  }, [enableTilt]);

  const getOffsets = (evt, el) => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    event => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerEnter = useCallback(
    event => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      shell.classList.add('active');
      shell.classList.add('entering');
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove('entering');
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback(
    event => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight
      );

      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

    shell.addEventListener('pointerenter', pointerEnterHandler);
    shell.addEventListener('pointermove', pointerMoveHandler);
    shell.addEventListener('pointerleave', pointerLeaveHandler);

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      const anyMotion = window.DeviceMotionEvent;
      if (anyMotion && typeof anyMotion.requestPermission === 'function') {
        anyMotion
          .requestPermission()
          .then(state => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationHandler);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
      }
    };
    shell.addEventListener('click', handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointerenter', pointerEnterHandler);
      shell.removeEventListener('pointermove', pointerMoveHandler);
      shell.removeEventListener('pointerleave', pointerLeaveHandler);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove('entering');
    };
  }, [
    enableTilt,
    enableMobileTilt,
    tiltEngine,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation
  ]);

  return (
    <div
      ref={wrapRef}
      className={`relative touch-none ${className}`.trim()}
      style={{
        perspective: '500px',
        transform: 'translate3d(0, 0, 0.1px)'
      }}
    >
      {/* Behind glow effect */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-200 hover:opacity-80"
        style={{
          background: `radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(125, 190, 255, 0.67) 0%, transparent 50%)`,
          filter: 'blur(50px) saturate(1.1)'
        }}
      />

      <div ref={shellRef} className="relative z-10">
        <section
          className="h-[80svh] max-h-[540px] md:max-h-[500px] sm:max-h-[400px] aspect-[0.718] rounded-[30px] relative overflow-hidden transition-transform duration-1000 ease-linear"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            boxShadow:
              'rgba(0, 0, 0, 0.8) calc((var(--pointer-from-left, 0.5) * 10px) - 3px) calc((var(--pointer-from-top, 0.5) * 20px) - 6px) 20px -5px',
            transform: 'translateZ(0) rotateX(0deg) rotateY(0deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Inner gradient background */}
          <div
            className="absolute inset-0 rounded-[30px] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(145deg, #60496e8c 0%, #71C4FF44 100%)',
              backgroundColor: 'rgba(0, 0, 0, 0.9)'
            }}
          />

          {/* Holographic shine effect */}
          <div
            className="absolute inset-0 z-[3] pointer-events-none rounded-[30px] overflow-hidden opacity-70 mix-blend-color-dodge transition-all duration-500"
            style={{
              transform: 'translate3d(0, 0, 1px)',
              filter: 'brightness(0.66) contrast(1.33) saturate(0.33) opacity(0.5)'
            }}
          />

          {/* Glare effect */}
          <div
            className="absolute inset-0 z-[4] pointer-events-none rounded-[30px] overflow-hidden mix-blend-overlay opacity-60 transition-all duration-300"
            style={{
              transform: 'translate3d(0, 0, 1.1px)',
              backgroundImage:
                'radial-gradient(farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%), hsl(248, 25%, 80%) 12%, hsla(207, 40%, 30%, 0.6) 90%)',
              filter: 'brightness(0.7) contrast(1.1)'
            }}
          />

          {/* Avatar content */}
          <div
            className="absolute inset-0 z-[2] rounded-[30px] overflow-visible mix-blend-luminosity"
            style={{ transform: 'translateZ(2px)', backfaceVisibility: 'hidden' }}
          >
            <img
              className="w-full absolute left-1/2 bottom-[-1px] will-change-transform transition-transform duration-[120ms] ease-out"
              src={avatarUrl}
              alt={`${name || 'User'} avatar`}
              loading="lazy"
              style={{
                transformOrigin: '50% 100%',
                transform:
                  'translateX(calc(-50% + (var(--pointer-from-left, 0.5) - 0.5) * 6px)) translateZ(0) scaleY(calc(1 + (var(--pointer-from-top, 0.5) - 0.5) * 0.02)) scaleX(calc(1 + (var(--pointer-from-left, 0.5) - 0.5) * 0.01))',
                backfaceVisibility: 'hidden'
              }}
              onError={e => {
                const t = e.target;
                t.style.display = 'none';
              }}
            />

            {showUserInfo && (
              <div className="absolute bottom-5 left-5 right-5 z-[6] flex items-center justify-between bg-white/10 backdrop-blur-[30px] border border-white/10 rounded-[24px] p-3 pointer-events-auto sm:bottom-[15px] sm:left-[15px] sm:right-[15px] sm:p-[10px]">
                <div className="flex items-center gap-3 sm:gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 flex-shrink-0 sm:w-8 sm:h-8">
                    <img
                      src={miniAvatarUrl || avatarUrl}
                      alt={`${name || 'User'} mini avatar`}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full"
                      onError={e => {
                        const t = e.target;
                        t.style.opacity = '0.5';
                        t.src = avatarUrl;
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-1">
                    <div className="text-sm font-medium text-white/90 leading-none sm:text-xs">
                      @{handle}
                    </div>
                    <div className="text-sm text-white/70 leading-none sm:text-[10px]">
                      {status}
                    </div>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-2 sm:gap-1.5">
                  {socialLinks?.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5 pointer-events-auto cursor-pointer sm:p-1.5 z-10 relative"
                      aria-label="LinkedIn Profile"
                      onClick={e => e.stopPropagation()}
                    >
                      <Linkedin className="w-4 h-4 text-white/80 sm:w-3.5 sm:h-3.5" />
                    </a>
                  )}
                  {socialLinks?.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5 pointer-events-auto cursor-pointer sm:p-1.5 z-10 relative"
                      aria-label="GitHub Profile"
                      onClick={e => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4 text-white/80 sm:w-3.5 sm:h-3.5" />
                    </a>
                  )}
                  {socialLinks?.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5 pointer-events-auto cursor-pointer sm:p-1.5 z-10 relative"
                      aria-label="Website"
                      onClick={e => e.stopPropagation()}
                    >
                      <Globe className="w-4 h-4 text-white/80 sm:w-3.5 sm:h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Name and title */}
          <div
            className="absolute inset-0 z-[5] pointer-events-none rounded-[30px] overflow-hidden text-center mix-blend-luminosity max-h-full"
            style={{
              transform:
                'translate3d(calc(var(--pointer-from-left, 0.5) * -6px + 3px), calc(var(--pointer-from-top, 0.5) * -6px + 3px), 0.1px)'
            }}
          >
            <div className="w-full absolute top-12 flex flex-col sm:top-8">
              <h3 className="font-semibold m-0 text-[min(5svh,3em)] bg-gradient-to-b from-white to-[#6f6fbe] bg-[length:1em_1.5em] text-transparent bg-clip-text [-webkit-text-fill-color:transparent] sm:text-[min(4svh,2.5em)]">
                {name}
              </h3>
              <p className="font-semibold relative -top-3 whitespace-nowrap text-base m-0 mx-auto w-min bg-gradient-to-b from-white to-[#4a4ac0] bg-[length:1em_1.5em] text-transparent bg-clip-text [-webkit-text-fill-color:transparent] sm:text-sm sm:-top-2">
                {title}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
  