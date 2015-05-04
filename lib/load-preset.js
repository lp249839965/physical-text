import loadFont from './load-font'
import loadMaps from './load-maps'
import assign from 'object-assign'
import THREE from 'three'

import quotes from './quotes'

const presetDefault = {
  repeat: 4,
  shininess: 100,
  scale: 1,
}

const base = `assets`
const presets = [ { 
  fontUrl: `${base}/Trash`, 
  mapUrl: `${base}/brick`,
  lineHeight: 35,
  color: '#ffd735',
  graffiti: true,
  scale: 0.4,
  repeat: 4,
  shininess: 150,
  text: 'the world is yours'
}, { 
  fontUrl: `${base}/LatoBlack-sdf`, 
  mapUrl: `${base}/burlap`, 
  color: '#ffd735',
  shininess: 20,
  text: 'ARMY',
  graffiti: false,
  scale: 0.9,
  letterSpacing: -0,
  repeat: 3,
}, { 
  fontUrl: `${base}/Dan`, 
  mapUrl: `${base}/paper1`, 
  color: '#000',//1b1b1b
  shininess: 10,
  graffiti: true,
  text: quotes[0],
  lineHeight: 45,
  graffiti: false,
  scale: 0.3, 
  letterSpacing: -0,
  repeat: 6,
  width: 500,
} ]

const cached = []

const fontOpts = {
  minFilter: THREE.LinearFilter,
  generateMipmaps: false
}

export default function(index, opt) {
  index = index % presets.length
  if (cached[index])
    return cached[index]

  const preset = assign({}, presetDefault, presets[index])
  const { fontUrl, mapUrl } = preset
  const repeat = preset.repeat || defaultRepeat

  const mapOpts = assign({}, fontOpts, {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    minFilter: THREE.LinearMipMapLinearFilter,
    generateMipmaps: true,
    anisotropy: opt.anisotropy,
    repeat: new THREE.Vector2(1,1).multiplyScalar(repeat)
  })

  const p = Promise.all([
    loadFont(fontUrl, fontOpts),
    loadMaps(mapUrl, mapOpts)
  ]).then(results => {
    return assign({}, preset, {
      font: results[0],
      maps: results[1],
      repeat: mapOpts.repeat
    })
  })
  cached[index] = p
  return p
}