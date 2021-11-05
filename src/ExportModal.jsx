import { useState } from 'react';
import { Alert, Modal, Radio, Select, Input, InputNumber, Tooltip, Typography, Switch } from 'antd';
import { ConditionalRender } from './utils/ConditionalRender';

import './ExportModal.scss';

const sizes = {
  'digital': {
    '1920x1080': {
      'label': 'Full HD (1920x1080)',
      'dimensions': [1920, 1080],
    },
    '1366x768': {
      'label': '1366x768',
      'dimensions': [1366, 768],
    },
    '1536x864': {
      'label': '1536x864',
      'dimensions': [1536, 864],
    },
    '3840x2160': {
      'label': '4K (3840x2160)',
      'dimensions': [3840, 2160],
    },
    '2560x1440': {
      'label': 'Quad HD (2560x1080)',
      'dimensions': [2560, 1440],
    },
    '1080x1920': {
      'label': 'Full HD (1080x1920)',
      'dimensions': [1080, 1920],
    },
    '768x1366': {
      'label': '768x1366',
      'dimensions': [768, 1366],
    },
    '864x1536': {
      'label': '864x1536',
      'dimensions': [864, 1536],
    },
    '2160x3840': {
      'label': '4K (2160x3840)',
      'dimensions': [2160, 3840],
    },
    '1440x2560': {
      'label': 'Quad HD (1080x2560)',
      'dimensions': [1440, 2560],
    },
  },
  'print': {
    'a4': {
      label: 'A4 (210mm x 297mm)', 
      dimensions: [210, 297],
      units: 'mm',
    },
    'a3': {
      label: 'A3 (297mm x 420mm)', 
      dimensions: [297, 420],
      units: 'mm',
    },
    'a2': {
      label: 'A2 (420mm x 594mm)', 
      dimensions: [420, 594],
      units: 'mm',
    },
    'postcard': {
      label: 'Postcard (101.6mm x 152.4mm)', 
      dimensions: [101.6, 152.4],
      units: 'mm',
    },
    'poster-small': {
      label: 'Poster small (280mm x 430mm)', 
      dimensions: [280, 430],
      units: 'mm',
    },
    'poster': {
      label: 'Poster (460mm x 610mm)', 
      dimensions: [460, 610],
      units: 'mm',
    },
    'poster-large': {
      label: 'Poster large (610mm x 910mm)', 
      dimensions: [610, 910],
      units: 'mm',
    },
    'letter': {
      label: 'Letter (8.5in x 11in)', 
      dimensions: [8.5, 11],
      units: 'in',
    },
    'legal': {
      label: 'Legal (8.5in x 14in)', 
      dimensions: [8.5, 14],
      units: 'in',
    },
    'ledger': {
      label: 'Ledger/Tabloid (11in x 17in)', 
      dimensions: [11, 17],
      units: 'in',
    }
  },
}

export const ExportModal = (props) => {
  const doExport = async () => {
    let { dimensions, units } = sizes[mode][size];
    console.log('Export dimensions:', dimensions);

    let dimensionsPx, bleedPx;
    // Convert dimensions to pixels
    if (units === 'mm') {
      const ppmm = ppi / 25.4;
      dimensionsPx = [
        Math.round(dimensions[0] * ppmm), 
        Math.round(dimensions[1] * ppmm)
      ];
      bleedPx = Math.round(bleed * ppmm);
    } else {
      dimefinalDimensionsnsions = [
        Math.round(dimensions[0] * ppi), 
        Math.round(dimensions[1] * ppi)
      ];
      bleedPx = Math.round(bleed * ppi);
    }
    
    let file = `wall-of-kanji-${mode}-${size}`;
    if (mode === 'print') {
      file += `-${orientation}`;
    }
    // Just a random id
    file += `-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)}`;

    await props.exportFn({
      dimensions: dimensionsPx,
      pixelsPerInch: ppi,
      units: 'px',
      bleed: includeBleed ? bleedPx : 0,
      fillWhite,
      orientation,
      pixelRatio: 1,
      file,
    });
    props.onVisibilityChange(false);
  };

  const setPaperSize = (presetName) => {
    const size = sizes[mode][presetName];
    setSize(presetName);
    setBleedUnits(size.units);
  };

  const [mode, setMode] = useState('digital');
  const [size, setSize] = useState('3840x2160');
  const [ppi, setPpi] = useState(300);
  const [includeBleed, setIncludeBleed] = useState(false);
  const [bleed, setBleed] = useState(0);
  const [bleedUnits, setBleedUnits] = useState('mm');
  const [fillWhite, setFillWhite] = useState(false);
  const [orientation, setOrientation] = useState('landscape');

  return <Modal
    className="ExportModal"
    title="Export picture"
    visible={props.visible}
    okText="Export"
    onOk={doExport}
    onCancel={() => props.onVisibilityChange(false)}
    getContainer={props.getContainer}
  >
    <div className="content">
        <Alert 
          className="alert" type="info" showIcon 
          message={"Because we use random to generate map, exported version might look a bit similar to what you see " +
                   "on screen now, but characters will be a bit different unless you're viewing this on the exact same " +
                   "size screen as export target."}
        />
        <Radio.Group
          className="mode-select"
          options={[
            {label: 'Digital', value: 'digital'},
            {label: 'For print', value: 'print'}
          ]}
          onChange={e => {
            setMode(e.target.value);
            if (e.target.value === 'digital') {
              setSize('3840x2160');
            } else {
              setSize('a4');
            }
          }}
          value={mode}
          optionType="button"
          buttonStyle="solid"
        />

        <div className="row">
          <div>Size:</div>
          <Select 
            style={{width: 250}}
            value={size}
            onChange={setPaperSize}
            getPopupContainer={props.getContainer}
            options={Object.keys(sizes[mode]).map(key => {
              return {label: sizes[mode][key].label, value: key};
            })}
          />
        </div>
      <ConditionalRender condition={mode === 'print'}>
        <div className="row">
          <div>Pixels Per Inch (PPI)</div>
          <div className="column">
            <InputNumber min={72} max={600} onChange={setPpi} value={ppi} />
            <Tooltip title="300 PPI is considered industry standart and is well supported by all modern printers. 
            If you would like extra crisp image, set PPI to 400 or more, but remember to consult 
            with print service where you're going to print this." getPopupContainer={props.getContainer}>
              <Typography.Link>Not sure?</Typography.Link>
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div>Bleed</div>
          <div className="column">
            <Switch onChange={val => setIncludeBleed(val)} checked={includeBleed} />
            <ConditionalRender condition={includeBleed}>

                <Input
                  type="number"
                  className="bleed-input" 
                  min={0} max={500} 
                  onChange={e => setBleed(parseInt(e.target.value))} 
                  value={bleed} 
                  addonAfter={bleedUnits}
                />
      
            </ConditionalRender>
            <Tooltip title="Some print shops will ask you to include 'offset' for each side of image. This is 
            especially actual for images with filling edge to edge. To set correct bleeding (and avoid disaster later) 
            visit print shop site or ask them in person, different print shops might have different requirements" getPopupContainer={props.getContainer}>
              <Typography.Link>Not sure?</Typography.Link>
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div>Fill white background</div>
          <div className="column">
            <Switch checked={fillWhite} onChange={val => setFillWhite(val)}/>
            <Tooltip title="If enabled, we won't fill white background of image (e.g. background of Japanese flag) 
            and leave it transperent." getPopupContainer={props.getContainer}>
              <Typography.Link>Not sure?</Typography.Link>
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div>Orientation</div>
          <Radio.Group
          options={[
            {label: 'Landscape', value: 'landscape'},
            {label: 'Portain', value: 'portain'}
          ]}
          onChange={e => setOrientation(e.target.value)}
          value={orientation}
          optionType="button"
        />
        </div>
      </ConditionalRender>
    </div>
  </Modal>
};