import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { draco } from 'drei'
import { material } from './store'

function Label({ texture, offset = [-1, -1], repeat = [2, 2], ...props }) {
  const { nodes } = useLoader(GLTFLoader, '/draco.glb', draco())
  texture.offset.set(...offset)
  texture.repeat.set(...repeat)
  return (
    <group {...props}>
      <mesh geometry={nodes.aesop_GLBC001.geometry}>
        <meshStandardMaterial attach="material" map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={nodes.aesop_GLBC001.geometry} rotation-z={3.1}>
        <meshStandardMaterial attach="material" map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Bottle({ initial, glas, cap, liquid, children, ...props }) {
  const ref = useRef()
  const { nodes } = useLoader(GLTFLoader, '/draco.glb', draco())
  const [hovered, set] = useState(false)
  useEffect(() => void (document.body.style.cursor = hovered ? "url('/c.svg'), pointer" : "url('/cd.svg'), auto"), [
    hovered,
  ])
  useFrame(() => {
    ref.current.position.z = THREE.MathUtils.lerp(
      ref.current.position.z,
      hovered ? -15 : 0,
      0.075 - Math.abs(initial) / 2000
    )
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, hovered ? -0.5 : 0, 0.075)
  })
  return (
    <group
      rotation={[Math.PI / 2, 0, 3]}
      {...props}
      onPointerOver={(e) => (e.stopPropagation(), set(true))}
      onPointerOut={() => set(false)}>
      <group position-z={initial * 5} ref={ref}>
        {children}
        <mesh geometry={nodes[glas].geometry} material={material.inner} />
        <mesh geometry={nodes[liquid].geometry} material={material.liquid} castShadow />
        <mesh geometry={nodes[glas].geometry} material={material.outer} castShadow />
        <mesh geometry={nodes[cap].geometry} material={material.cap} />
      </group>
    </group>
  )
}

export default function Bottles(props) {
  const group = useRef()
  const { nodes } = useLoader(GLTFLoader, '/draco.glb', draco('/draco-gltf/'))
  const [a, b] = useLoader(THREE.TextureLoader, ['/aesop_GFT_d.jpg', '/aesop_PSFC_d.jpg'])
  return (
    <group ref={group} {...props} dispose={null} scale={[0.1, 0.1, 0.1]}>
      <Bottle initial={-30} position={[140, 0, 0]} glas="Untitled.018_0" cap="Untitled.018_1" liquid="Untitled.018_2">
        <Label texture={b} offset={[-1.05, -0.2]} repeat={[2, 0.8]} scale={[0.7, 0.7, 0.25]} position={[0, 0, -5]} />
      </Bottle>
      <Bottle initial={-40} position={[80, 0, 0]} glas="Untitled.078_0" cap="Untitled.078_1" liquid="Untitled.078_2">
        <Label texture={b} scale={[0.63, 0.63, 0.63]} position={[0, 0, -2]} />
      </Bottle>
      <Bottle initial={-50} position={[-2, 0, 0]} glas="Untitled.064_0" cap="Untitled.064_1" liquid="Untitled.064_3">
        <mesh name="straw" geometry={nodes['Untitled.064_2'].geometry}>
          <meshStandardMaterial attach="material" color="black" />
        </mesh>
        <Label texture={a} scale={[1.01, 1.01, 1.01]} />
      </Bottle>
      <Bottle initial={-40} position={[-90, 0, 0]} glas="Untitled.052_0" cap="Untitled.052_1" liquid="Untitled.052_2">
        <Label texture={a} scale={[0.78, 0.78, 0.78]} position={[0, 0, -5]} />
      </Bottle>
      <Bottle initial={-30} position={[-140, 0, 0]} glas="Untitled.072_0" cap="Untitled.072_1" liquid="Untitled.072_2">
        <Label texture={b} scale={[0.275, 0.275, 0.6]} position={[0, 0, 8]} />
      </Bottle>
      <Bottle initial={-20} position={[-180, 0, 0]} glas="Untitled.007_0" cap="Untitled.007_1" liquid="Untitled.007_2">
        <Label texture={a} scale={[0.53, 0.53, 0.53]} position={[0, 0, -5]} />
      </Bottle>
    </group>
  )
}
