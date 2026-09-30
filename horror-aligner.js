/**
 * HORROR ALIGNMENT SCRAMBLER ENGINE
 * Automatically re-aligns the website into random, complicated, non-Euclidean geometric configurations on EVERY button click.
 */

window.HorrorAligner = (function() {
  let alignmentState = {
    tilt: 0,
    skew: 0,
    rotX: 0,
    rotY: 0,
    textAlign: 'left',
    flexAlign: 'flex-start',
    gridGap: 20,
    shiftX: 0,
    shiftY: 0,
    cardRotEven: 0,
    cardRotOdd: 0,
    topologyName: 'EUCLIDEAN (FLAT)'
  };

  const topologyNames = [
    'NON-EUCLIDEAN SKEW',
    'MINKOWSKI CONTORTION',
    'ASYMMETRIC WARP',
    'HYPERBOLIC GRAVITY',
    'TILT VECTOR 0xDEAD',
    'RIEMANNIAN DRIFT',
    'SPATIAL FRACTURE',
    'PARALLAX DISCORD'
  ];

  const textAlignments = ['left', 'right', 'center', 'justify'];
  const flexAlignments = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'];

  function scrambleAlignment() {
    // Only scramble in horror views; keep solution view clean
    const root = document.querySelector('.terminal-root');
    if (root && root.classList.contains('view-solution')) return;

    const tilt = (Math.random() * 6 - 3).toFixed(2); // -3.00 to +3.00 deg
    const skew = (Math.random() * 4 - 2).toFixed(2); // -2.00 to +2.00 deg
    const rotX = (Math.random() * 3 - 1.5).toFixed(2); // -1.50 to +1.50 deg
    const rotY = (Math.random() * 4 - 2).toFixed(2); // -2.00 to +2.00 deg
    const shiftX = (Math.random() * 34 - 17).toFixed(1); // -17px to +17px
    const shiftY = (Math.random() * 22 - 11).toFixed(1); // -11px to +11px
    const cardRotEven = (Math.random() * 5 - 2.5).toFixed(2);
    const cardRotOdd = (Math.random() * 5 - 2.5).toFixed(2);
    const gridGap = Math.floor(Math.random() * 20) + 16; // 16px to 36px

    const textAlign = textAlignments[Math.floor(Math.random() * textAlignments.length)];
    const flexAlign = flexAlignments[Math.floor(Math.random() * flexAlignments.length)];
    const topology = topologyNames[Math.floor(Math.random() * topologyNames.length)];

    alignmentState = {
      tilt, skew, rotX, rotY, textAlign, flexAlign, gridGap, shiftX, shiftY, cardRotEven, cardRotOdd,
      topologyName: `${topology} [${tilt > 0 ? '+' : ''}${tilt}°]`
    };

    const el = document.documentElement;
    el.style.setProperty('--chaos-tilt', `${tilt}deg`);
    el.style.setProperty('--chaos-skew', `${skew}deg`);
    el.style.setProperty('--chaos-rot-x', `${rotX}deg`);
    el.style.setProperty('--chaos-rot-y', `${rotY}deg`);
    el.style.setProperty('--chaos-text-align', textAlign);
    el.style.setProperty('--chaos-flex-align', flexAlign);
    el.style.setProperty('--chaos-grid-gap', `${gridGap}px`);
    el.style.setProperty('--chaos-card-shift-x', `${shiftX}px`);
    el.style.setProperty('--chaos-card-shift-y', `${shiftY}px`);
    el.style.setProperty('--chaos-card-rot-even', `${cardRotEven}deg`);
    el.style.setProperty('--chaos-card-rot-odd', `${cardRotOdd}deg`);

    window.dispatchEvent(new CustomEvent('alignment-scrambled', { detail: alignmentState }));
  }

  function resetAlignment() {
    const el = document.documentElement;
    el.style.setProperty('--chaos-tilt', '0deg');
    el.style.setProperty('--chaos-skew', '0deg');
    el.style.setProperty('--chaos-rot-x', '0deg');
    el.style.setProperty('--chaos-rot-y', '0deg');
    el.style.setProperty('--chaos-text-align', 'left');
    el.style.setProperty('--chaos-flex-align', 'flex-start');
    el.style.setProperty('--chaos-grid-gap', '20px');
    el.style.setProperty('--chaos-card-shift-x', '0px');
    el.style.setProperty('--chaos-card-shift-y', '0px');
    el.style.setProperty('--chaos-card-rot-even', '0deg');
    el.style.setProperty('--chaos-card-rot-odd', '0deg');
    alignmentState.topologyName = 'EUCLIDEAN (RESTORED)';
    window.dispatchEvent(new CustomEvent('alignment-scrambled', { detail: alignmentState }));
  }

  return {
    scrambleAlignment,
    resetAlignment,
    getState: () => alignmentState
  };
})();
