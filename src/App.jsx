import { useState, useRef, useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Button, Select, Switch, Slider, message, Radio, Tooltip } from 'antd';
import { SettingOutlined, ShrinkOutlined, WarningOutlined } from '@ant-design/icons';
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import canvasSketch from "canvas-sketch";
import random from 'canvas-sketch-util/random';
import { Base64 } from 'js-base64';
import _ from 'lodash';

import { sketch } from './sketch/sketch';
import { useWindowSize, useCanvasPixelRatio, useAllDocumentFontsLoaded } from './utils/hooks';
import { defaultSettings, defaultFontSize, estKanjiSpacing, 
  availableFonts, defaultStyle, availableDatasets, defaultDataset, availableStyles, STYLE_FLAG_COLORS, STYLE_FLAG  } from './const';
import 'antd/dist/antd.css';
import './App.scss';
import { ExportModal } from './ExportModal';
import { ConditionalRender } from './utils/ConditionalRender';

const transition = {
  type: "spring",
  duration: 0.35
}

function App() {
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.success('URL copied to clipboard!');
    } catch {
      message.error('We have troubles accessing clipboard :( Please copy URL of page manually');
    }
  };

  const exportPicture = async ({dimensions, pixelsPerInch, bleed, units, fillWhite, orientation, pixelRatio, file}) => {
    // TODO: consider adding option to export to TIFF. This might produce very large build, but will be more convenient for users since print offices often prefers this format
    // https://github.com/motiz88/canvas-to-tiff
    const canvas = document.createElement('canvas');
    console.log('Creating manager with dimensions set to', dimensions);
    const manager = await canvasSketch(sketch, {
      ...defaultSettings,
      animate: false,
      dimensions,
      pixelsPerInch,
      units,
      bleed,
      orientation,
      canvas: canvas,
      file,
      data: {
        font,
        seed,
        pixelRatio,
        fontSize,
        spacing,
        style,
        dataset,
        fillWhite
      },
      
    });
    console.log('Saving with name', file);
    await manager.exportFrame();
    canvas.remove();
  };

  const loadStateFromString = (stateString) => {
    try {
      const arr = Base64.decode(stateString).split('|');
      console.log('Params arr:', arr);
      if (arr.length !== 7) return;
      const seed = arr[0];
      const fontSize = parseInt(arr[1]);
      const fontNumber = parseInt(arr[2]);
      const dataset = arr[5];
      const font = ['mix', ...availableFonts[dataset]][fontNumber + 1];
      const spacing = parseInt(arr[3]);
      const animate = arr[4] === '1';
      const style = arr[6] === '1' ? STYLE_FLAG_COLORS : STYLE_FLAG;

      setSeed(seed);
      setFontSize(fontSize);
      setFont(font);
      setSpacing(spacing);
      setAnimate(animate);
      setDataset(dataset);
      setStyle(style);
    } catch {
      message.error("Unknown error while loading state from URL :(");
    }
  };

  const pushStateToUrl = () => {
    const f = font === 'mix' ? -1 : availableFonts[dataset].indexOf(font);
    const a = animate ? 1 : 0;
    const st = style === STYLE_FLAG_COLORS ? 1 : 2;
    const stateStr = Base64.encodeURI(`${seed}|${fontSize}|${f}|${spacing}|${a}|${dataset}|${st}`);
    window.history.pushState(stateStr, `Wall of Kanji - ${seed}`, `/${stateStr}`);
  };

  const pixelRatio = useCanvasPixelRatio();
  const fontsLoaed = useAllDocumentFontsLoaded();
  const [seed, setSeed] = useState(random.getRandomSeed());
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [font, setFont] = useState('mix');
  const [spacing, setSpacing] = useState(estKanjiSpacing);
  const [animate, setAnimate] = useState(defaultSettings.animate);
  const [style, setStyle] = useState(defaultStyle);
  const [dataset, setDataset] = useState(defaultDataset);

  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const fullscreenHandle = useFullScreenHandle();

  const canvas = useRef();
  const sketchManager = useRef();
  const rootRef = useRef();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (window.location.pathname !== '/') {
      console.log('Loading parameters from path');
      loadStateFromString(window.location.pathname.slice(1));
    }
  }, []);

  
  useEffect(() => {
    console.log('Redraw with settings:', {seed, font, animate, sketchManager});
    if (sketchManager.current) {
      sketchManager.current.unload();
    }
    canvasSketch(sketch, {
      ...defaultSettings,
      dimensions: [
        (width || 1024) * pixelRatio, 
        (height || 1024) * pixelRatio],
      bleed: 0,
      canvas: canvas.current,
      data: {
        font,
        seed,
        pixelRatio,
        fontSize,
        spacing,
        style,
        dataset,
        fillWhite: true,
      },
      animate,
    }).then(manager => {
      sketchManager.current = manager;
      pushStateToUrl();
    });
  }, [canvas, seed, width, height, font, animate, pixelRatio, fontSize, spacing, style, dataset, fontsLoaed]);

  return (
    <FullScreen handle={fullscreenHandle}>
      <div className="App" ref={rootRef}>
        <AnimateSharedLayout type="crossfade">
          {!isPanelExpanded && <motion.div 
            className="show-panel-button" 
            layoutId="panel"
            transition={transition}
            whileHover={{ scale: 1.1 }}
          >
            <Button icon={<SettingOutlined />} onClick={() => setIsPanelExpanded(true)}/>
          </motion.div>}
          <AnimatePresence>
            {isPanelExpanded && <motion.div 
              key="panel" 
              layoutId="panel" 
              className="panel"
              transition={transition}
            >
              <div className="title-row">
                <ConditionalRender condition={isPanelExpanded}>
                  <span className="title">Options</span>
                  <Button icon={<ShrinkOutlined />} className="hide-panel-button" onClick={() => setIsPanelExpanded(false)}/>
                </ConditionalRender>
              </div>
              <ConditionalRender condition={isPanelExpanded}>
                <div className="row">
                  <div className="label">Random seed:</div>
                  <div className="value">
                    {seed}
                    <Button 
                      size="small" 
                      style={{marginLeft: 6}}
                      onClick={() => setSeed(random.getRandomSeed())}
                    >Regenerate</Button>  
                  </div>
                </div>
                <div className="row">
                  <div className="label">Dataset:</div>
                  <div className="value">
                    <Radio.Group
                      options={Object.keys(availableDatasets).map(key => {
                        return {label: width > 600 ? availableDatasets[key][0] : availableDatasets[key][1], value: key};
                      })}
                      onChange={e => {
                        if (font !== 'mix') {
                          setFont('mix');
                        }
                        setDataset(e.target.value)
                      }}
                      value={dataset}
                      optionType="button"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="label">Style:</div>
                  <div className="value">
                    <Radio.Group
                      options={Object.keys(availableStyles).map(key => {
                        return {label: availableStyles[key], value: key};
                      })}
                      onChange={e => setStyle(e.target.value)}
                      value={style}
                      optionType="button"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="label">Font:</div>
                  <div className="value">
                    <Select value={font} onChange={val => setFont(val)} size="small" style={{width: 160}}>
                      {availableFonts[dataset].map(font => {
                        return (<Select.Option value={font} key={font}>{font}</Select.Option>);
                      })}
                      <Select.Option value="mix">Mix</Select.Option>
                    </Select>
                  </div>
                </div>
                <div className="row animation-row">
                  <div className="label">Animate:</div>
                  <div className="value">
                    <Tooltip title="This feature is considered as experimental and might cause heavy 
                    load on your graphics card. Especially with big amount of characters 
                    on screen and small spacing." placement="left" getPopupContainer={() => rootRef.current}>
                      <Switch onChange={val => setAnimate(val)} checked={animate} />
                      <WarningOutlined className="warning-icon"/>
                    </Tooltip>
                  </div>
                </div>
                <div className="row">
                  <div className="label">Font size:</div>
                  <div className="value">
                    <Slider style={{width: 150}} onChange={val => setFontSize(val)} value={fontSize} min={16} max={160} />
                  </div>
                </div>
                <div className="row">
                  <div className="label">Spacing:</div>
                  <div className="value">
                    <Slider style={{width: 150}} onChange={val => setSpacing(val)} value={spacing} min={24} max={180} />
                  </div>
                </div>
                <div className="row">
                  <Button 
                    className="action-button" 
                    block type="primary"
                    onClick={copyUrl}
                  >Share</Button>
                  <Button 
                    className="action-button" 
                    block type="primary"
                    onClick={() => setIsExportModalVisible(true)}
                  >Save HiRes</Button>
                </div>  
                <div className="row">
                  <Button type="primary" block onClick={fullscreenHandle.active ? fullscreenHandle.exit : fullscreenHandle.enter}>Toggle fullscreen</Button>
                </div>
                <div className="row about-row">
                  Crafted with love by OlegWock. Source code is open and any feedback is welcome! If you like it, please spread the word across your social media or give it a star on GitHub.<br />
                  <a href="https://github.com/OlegWock/wall-of-kanji">OlegWock/wall-of-kanji</a>
                </div>
              </ConditionalRender>
            </motion.div>}
          </AnimatePresence>
        </AnimateSharedLayout>
                    

        <canvas ref={canvas} style={{width, height}} />

        <ExportModal
          visible={isExportModalVisible}
          onVisibilityChange={setIsExportModalVisible}
          exportFn={exportPicture}
          getContainer={() => rootRef.current}
        />
      </div>
    </FullScreen>
  )
}

export default App
