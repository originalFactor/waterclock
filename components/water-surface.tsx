"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Water } from 'three-stdlib'
import { useTexture } from "@react-three/drei"
import { PlaneGeometry, Vector3, RepeatWrapping } from "three"
import type { ReactThreeFiber } from '@react-three/fiber'

// 使用React Three Fiber扩展类型的方式声明water元素
declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: ReactThreeFiber.Object3DNode<Water, typeof Water> & {
        args?: ConstructorParameters<typeof Water>
      }
    }
  }
}

interface WaterSurfaceProps {
  position: [number, number, number]
  scale: [number, number, number]
}

export default function WaterSurface({ position, scale }: WaterSurfaceProps) {
  const waterRef = useRef<Water>(null)
  const waterNormals = useTexture('/waternormals.jpg')

  useFrame((_, delta) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.time.value += delta * 0.5
    }
  })

  useEffect(() => {
    if (waterRef.current) {
      waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping
      waterRef.current.material.transparent = true
      waterRef.current.material.opacity = 0.65
      // 调整法线贴图重复参数增强细节
      waterNormals.repeat.set(2, 2)
    }
  }, [waterNormals])

  return (
    <water
      ref={waterRef}
      args={[
        new PlaneGeometry(100, 100),
        {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals,
          sunDirection: new Vector3(),
          sunColor: 0x004477,
          waterColor: 0x0099cc,
          distortionScale: 9.2,
          fog: true,
        }
      ]}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={scale}
    />
  )
}

